export default interface FileMetadataModel {
  id: string;
  name: string;
  stem: string;
  extension: string;
  // TODO remove "undefined" from supported types
  absolutePath: string | undefined;
  relativePath: string | undefined;
}
