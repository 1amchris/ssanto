import FileContentModel from 'models/file/FileContentModel';
import { encode } from 'base64-arraybuffer';
import FileMetadataModel from 'models/file/FileMetadataModel';
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
}

export default FilesUtils;
