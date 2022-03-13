import FileContentModel from 'models/FileContentModel';
import { encode as base64encode } from 'base64-arraybuffer';


// Extracts data from files and encodes it in base64
export const extractContentFromFiles = async (files: File[]) =>
  Promise.all(
    Array.from(files).map(async (file: File) => ({
      name: file.name,
      size: file.size,
      content: await file.arrayBuffer(),
    }))
  ).then((contents: FileContentModel[]) =>
    contents.map(({ name: fileName, size: fileSize, content }) => ({
      fileName,
      fileSize,
      base64content: base64encode(content),
    }))
  );
