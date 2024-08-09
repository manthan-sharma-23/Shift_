export interface DirectoryStructure {
  name: string;
  path: string;
  type: "file" | "directory";
  children?: DirectoryStructure[];
}
