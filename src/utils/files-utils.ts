import FileContentModel from 'models/file/FileContentModel';
import FileMetadataModel from 'models/file/FileMetadataModel';
import FolderMetadataModel from 'models/file/FolderMetadataModel';
import { encode } from 'base64-arraybuffer';

namespace FilesUtils {
  // Extracts data from files and encodes it in base64
  export const extractContentFromFiles = async (
    files: File[] | FileList
  ): Promise<FileContentModel<string>[]> =>
    Promise.all(
      Array.from(files).map(async (file: File) => ({
        name: file.name,
        size: file.size,
        content: await file.arrayBuffer(),
      }))
    ).then((contents: FileContentModel<ArrayBuffer>[]) =>
      contents.map(({ name: fileName, size: fileSize, content }) => ({
        name: fileName,
        size: fileSize,
        content: encode(content),
      }))
    );

  // Extracts metadata from files
  export const extractMetadataFromFiles = (
    files: File[] | FileList
  ): FileMetadataModel[] =>
    Array.from(files).map(file => {
      const indexOfLastPeriod = file.name.lastIndexOf('.');
      return {
        name: file.name,
        stem: file.name.substring(0, indexOfLastPeriod),
        extension: file.name.substring(indexOfLastPeriod + 1),
        /* Kinda hacky, but we need to get the file uri and relative path */
        uri: `file://${(file as any).path}`,
        relativePath: (file as any).webkitRelativePath,
      } as FileMetadataModel;
    });

  export const treeify = (
    files: FileMetadataModel[]
  ): FolderMetadataModel | undefined => {
    if (files.length === 0) {
      return undefined;
    }

    const rootFolderName = files[0].relativePath.split('/')[0];
    const root: FolderMetadataModel = {
      uri: `${files[0].uri.slice(
        0,
        -files[0].relativePath.length
      )}${rootFolderName}/`,
      name: rootFolderName,
      folders: [],
      files: [],
      relativePath: `${rootFolderName}/`,
    };

    return files.reduce((acc: FolderMetadataModel, file: FileMetadataModel) => {
      let directory = acc;
      file
        .relativePath!.split('/')
        .slice(1, -1)
        .forEach(folderName => {
          const existingFolderIndex = directory.folders.findIndex(
            folder => folder.name === folderName
          );
          if (existingFolderIndex === -1) {
            directory.folders.push({
              uri: `${directory.uri}${folderName}/`,
              name: folderName,
              folders: [],
              files: [],
              relativePath: `${directory.relativePath}${folderName}/`,
            } as FolderMetadataModel);
          }

          directory = directory.folders[directory.folders.length - 1];
        });

      directory.files.push(file);
      return acc;
    }, root);
  };

  export function indexFiles<FileType>(files: FileType[]) {
    return files.map((file, index) => [file, index]) as [FileType, number][];
  }
}

export default FilesUtils;
