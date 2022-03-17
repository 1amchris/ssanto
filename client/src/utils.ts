import FileContentModel from 'models/FileContentModel';
import { encode } from 'base64-arraybuffer';

namespace Utils {
  // Extracts data from files and encodes it in base64
  export const extractContentFromFiles = async (
    files: File[]
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
}

export default Utils;
