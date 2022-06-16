from base64 import b64decode
import os
import shutil
import geopandas as gpd

from files.file_metadata import FileMetaData
from files.file import File
from files.shapefile import Shapefile
from files.document_manager import DocumentsManager
from logger.log_manager import LogsManager
from subjects.subjects_manager import SubjectsManager
from views.manager import ViewsManager
from views.views import View


class FileParser:
    @staticmethod
    def load(file: File, path: str):
        # This is an instance of the Open-Closed Principle being violated
        # This is fine for now since shapefiles are the only files being loaded
        if isinstance(file, Shapefile):
            shp = file.get_file_by_ext("shp")
            return FileParser.__load_shp(shp, path)
        # elif ext == '...'

        return None

    @staticmethod
    def __load_shp(shp_file: File, path: str):
        gdf = gpd.read_file(os.path.join(path, shp_file.name)).to_crs("epsg:4326")
        return bytes(gdf.to_json(), "ascii")


class FilesWriter:
    def __init__(self):
        self.main_dir = os.path.join(os.getcwd(), "temp")
        if os.path.exists(self.main_dir):
            shutil.rmtree(self.main_dir)
        os.makedirs(self.main_dir)

    def get_path(self):
        return self.main_dir

    def save_file(self, name, content):
        path = os.path.join(self.main_dir, name)
        is_overwritten = os.path.exists(path)
        with open(path, "wb") as file:
            file.write(content)
        return is_overwritten

    def remove_file(self, name):
        os.remove(os.path.join(self.main_dir, name))

    def __del__(self):
        shutil.rmtree(self.main_dir)


class FilesManager:
    def __init__(self, subjects_manager: SubjectsManager, logger: LogsManager):
        self.subjects_manager = subjects_manager
        self.logger = logger
        self.workspace = None
        self.files_content = dict()
        self.files = self.subjects_manager.create("file_manager.files", dict())
        self.writer = FilesWriter()
        self.shapefiles = self.subjects_manager.create("file_manager.shapefiles", dict())
        self.shapefiles_content = dict()

    def serialize(self) -> dict:
        return {key: file.serialize() for key, file in self.files_content.items()}

    def get_writer_path(self):
        return self.writer.get_path()

    def get_file(self, name):
        return self.files_content[name]

    def get_shp_path(self, name):
        return os.path.join(self.get_writer_path(), name)

    def get_files_metadatas(self):
        return list(
            map(
                lambda file: FileMetaData(file.name),
                self.files_content.values(),
            )
        )

    def get_shapefiles_metadatas(self):
        return list(
            map(
                lambda shapefile: shapefile.get_metadatas(),
                self.files_content.values(),
            )
        )

    def get_files_by_names(self, *names):
        return list(filter(lambda file: file.name in names, self.files_content.values()))

    # def get_shapefile_by_id(self, id):
    #    return list(filter(lambda shapefile: shapefile['id'] == id, self.shapefiles.data))[0]

    def get_file_names(self):
        return self.files_content.keys()

    def get_extension(self, file_name):
        return file_name.split(".")[-1]

    def get_name(self, file_name):
        return file_name.split(".")[0]

    def add_file(self, file):
        self.writer.save_file(file.name, file.read_content())
        self.files_content[file.name] = file
        return file

    def remove_file(self, name):
        # TODO: Popped might be None if there is no files corresponding and generate an error
        popped = self.files_content.pop(name)
        # It is not elegant, but we need to implement composite in the self.files_content
        if isinstance(popped, Shapefile):
            for file in popped.get_files():
                self.writer.remove_file(file.name)
        else:  # Probably not used since only shapefile are allowed
            self.writer.remove_file(popped.name)
        self.__notify_metadatas()
        return popped

    def add_shapefile(self, shp):
        for file in shp.get_files():
            self.writer.save_file(file.name, file.read_content())
        self.files_content[shp.name] = shp
        return shp

    def add_shapefile_from_save(self, name, data):
        shp = Shapefile(name)
        content = data["content"]
        shp.content = b64decode(content.encode("ascii"))
        for file_data in data["files"]:
            file = File(file_data["name"], b64decode(file_data["content"].encode("ascii")))
            shp.add_file(file)

        self.add_shapefile(shp)
        shp.content = FileParser.load(shp, self.get_writer_path())
        shp.set_feature(self.get_writer_path())
        self.__notify_metadatas()

    def add_files(self, *files):
        added = []
        rejected = []
        invalided = []

        created = {}
        for file in files:
            new_file = File(file["name"], b64decode(file["content"]))
            created[new_file.name] = new_file

        shapefiles = dict()
        for file in created.values():
            if Shapefile.is_shapefile_ext(file.extension):
                shapefile = shapefiles.setdefault(file.stem, Shapefile(file.stem + ".shp"))
                # TODO: Check if there is already a file with the extension added
                shapefile.add_file(file)
            else:
                invalided.append(file.name)

        for shapefile in shapefiles.values():
            if not shapefile.is_complete():
                rejected.append(shapefile.name)
                continue
            is_already_added = shapefile.name in self.files_content
            self.add_shapefile(shapefile)
            shapefile.content = FileParser.load(shapefile, self.get_writer_path())
            shapefile.set_feature(self.get_writer_path())
            if not is_already_added:
                added.append(shapefile)

        self.__notify_metadatas()

        return added, rejected, invalided

    def __notify_metadatas(self):
        metadatas = self.get_files_metadatas()
        shapefiles_metadatas = self.get_shapefiles_metadatas()
        self.files.notify(metadatas)
        self.shapefiles.notify(shapefiles_metadatas)

    # Add loaded file to the file manager?


class WorkspaceManager:
    def __init__(self, subjects_manager: SubjectsManager, logger: LogsManager):
        self.subjects_manager = subjects_manager
        self.logger = logger
        self.workspace = None
        self.files = self.subjects_manager.create("workspace_manager.files", dict())

    def open_workspace(self, path):
        if self.workspace is not None:
            self.close_workspace()

        self.workspace = path
        all_files = [FileMetaData(file, root) for root, dirs, files in os.walk(path) for file in files]
        self.files.notify(all_files)
        self.logger.info(f"[Workspace] Opened workspace: {self.workspace}")

    def close_workspace(self):
        # TODO: Perhaps we should save the files in the workspace before closing it
        if self.workspace is not None:
            self.files.notify([])
            self.logger.info(f"[Workspace] Closed workspace: {self.workspace}")
            self.workspace = None

    def open_file(self, views_manager: ViewsManager, documents_manager: DocumentsManager):
        def hof(file_uri: str, view_type: str = None):
            view = View(file_uri[file_uri.rfind("/") + 1 :], file_uri, view_type=view_type)
            views_manager.editor.add_view(view)
            documents_manager.open_document(file_uri)
            self.logger.info(f"[Workspace] Opened document: {file_uri}")

        return hof
