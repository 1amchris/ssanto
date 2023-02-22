import FileContentModel from 'models/file/FileContentModel';
import FileMetadataModel from 'models/file/FileMetadataModel';
import FolderMetadataModel from 'models/file/FolderMetadataModel';
import { encode } from 'base64-arraybuffer';

namespace FilesUtils {
  // Extracts data from files and encodes it in base64
  export const extractContent = async (
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

  export const extractMetadata = (
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
        // relativePath: (file as any).webkitRelativePath,
      } as FileMetadataModel;
    });

  export const pathFromUri = (uri: string): string =>
    uri.slice('file://'.length);

  export const relativePath = (path: string, root: string): string => {
    const _root = root.endsWith('/') ? root.slice(0, -1) : root;
    return path.slice(_root.length - _root.split('/').pop()!.length);
  };

  export const extractRootPath = (paths: string[]): string | undefined =>
    paths[0] === undefined
      ? undefined
      : paths.length === 1
      ? paths[0].split('/').slice(0, -1).join('/')
      : (Array.from(paths).reduce((acc: string | undefined, curr: string) => {
          if (acc === undefined) return curr;
          const accPath = acc.split('/');
          const currPath = curr.split('/');
          const commonPath = accPath.filter(
            (_: any, i: number) => currPath[i] === accPath[i]
          );
          return commonPath.join('/');
        }, undefined) || '') + '/';

  export const treeify = (
    files: FileMetadataModel[]
  ): FolderMetadataModel | undefined => {
    if (files.length === 0) {
      return undefined;
    }

    const rootPath = extractRootPath(files.map(f => pathFromUri(f.uri)));

    if (rootPath === undefined) throw new Error('Root path is undefined.');

    const rootFolderName = rootPath.split('/').pop()!;
    const root: FolderMetadataModel = {
      uri: `file://${rootPath}`,
      name: rootFolderName,
      folders: [],
      files: [],
    };

    return files.reduce((acc: FolderMetadataModel, file: FileMetadataModel) => {
      let directory = acc;
      relativePath(pathFromUri(file.uri), rootPath)
        .split('/')
        .slice(1, -1)
        .forEach((folderName: string) => {
          const existingFolderIndex = directory.folders.findIndex(
            folder => folder.name === folderName
          );
          if (existingFolderIndex === -1) {
            directory.folders.push({
              uri: `${directory.uri}${folderName}/`,
              name: folderName,
              folders: [],
              files: [],
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
