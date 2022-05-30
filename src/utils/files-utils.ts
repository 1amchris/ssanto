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
        // Kinda hacky, but we need to get the file absolute and relative path from the file
        absolutePath: (file as any).path,
        relativePath: (file as any).webkitRelativePath,
      } as FileMetadataModel;
    });

  // export const treeify = (files: FileMetadataModel[]) => {
  //   console.log({ files });
  //   const tree: { [folder: string]: FileMetadataModel[] } = {};
  //   for (const file of files) {
  //     const { relativePath } = file;
  //     if (relativePath === undefined) {
  //       console.warn(`File ${file.id} has no relative path:`, file);
  //       continue;
  //     }
  //     const key = relativePath.substring(0).replaceAll('/', '.');
  //     tree[key]
  //   }
  //   return tree;
  // };

  export function indexFiles<FileType>(files: FileType[]) {
    return files.map((file, index) => [file, index]) as [FileType, number][];
  }
}

export default FilesUtils;
