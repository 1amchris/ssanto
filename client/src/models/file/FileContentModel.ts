export default interface FileContentModel<ContentType> {
  name: string;
  size: number;
  content: ContentType;
}
