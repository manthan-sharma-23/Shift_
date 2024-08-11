import fs from "fs";
import path from "path";

export interface FileObject {
  path: string;
  content: string;
}

export const readFilesRecursively = async (
  dir: string,
  baseDir: string
): Promise<FileObject[]> => {
  let files: FileObject[] = [];

  const items = await fs.promises.readdir(dir, { withFileTypes: true });

  for (const item of items) {
    const fullPath = path.join(dir, item.name);

    if (item.isDirectory()) {
      if (item.name !== "node_modules" && item.name !== "package-lock.json") {
        const nestedFiles = await readFilesRecursively(fullPath, baseDir);
        files = files.concat(nestedFiles);
      }
    } else {
      const content = await fs.promises.readFile(fullPath, "utf-8");
      const relativePath = path.relative(baseDir, fullPath);
      files.push({ path: relativePath, content });
    }
  }

  return files;
};
