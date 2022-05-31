import FileContentModel from 'models/file/FileContentModel';
import FileMetadataModel from 'models/file/FileMetadataModel';
import { encode } from 'base64-arraybuffer';
import { uniqueId } from 'lodash';

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
        id: uniqueId('file-'),
        name: file.name,
        stem: file.name.substring(0, indexOfLastPeriod),
        extension: file.name.substring(indexOfLastPeriod + 1),
        /* Kinda hacky, but we need to get the file absolute and relative path from the file */
        absolutePath: (file as any).path,
        relativePath: (file as any).webkitRelativePath,
      } as FileMetadataModel;
    });

  export const treeify = (files: FileMetadataModel[]) => {
    return (
      files
        ?.filter(file => file.relativePath !== undefined)
        ?.reduce((acc: any, file: FileMetadataModel) => {
          let directory = acc;
          file
            .relativePath!.split('/')
            .slice(0, -1)
            .forEach(folder => {
              if (!directory.hasOwnProperty(folder)) {
                directory[folder] = {};
              }

              directory = directory[folder];
            });

          directory[file.name] = file;
          return acc;
        }, {}) || {}
    );
  };

  export function splitFoldersAndFiles(directory: any) {
    const folders: [string, Object][] = [];
    const files: [string, FileMetadataModel][] = [];
    Object.entries(directory).forEach(([name, value]: [string, any]) => {
      /* hacky way of figuring out if it's a file */
      if (name === value.name) {
        files.push([name, value]);
      } else {
        folders.push([name, value]);
      }
    });
    return { folders, files };
  }

  export function indexFiles<FileType>(files: FileType[]) {
    return files.map((file, index) => [file, index]) as [FileType, number][];
  }
}

export default FilesUtils;
