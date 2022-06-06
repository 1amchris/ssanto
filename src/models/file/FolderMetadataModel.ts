import FileMetadataModel from 'models/file/FileMetadataModel';

export default interface FolderMetadataModel {
  uri: string;
  name: string;
  folders: FolderMetadataModel[];
  files: FileMetadataModel[];
}
