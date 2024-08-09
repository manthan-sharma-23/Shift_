import { configurations } from "../config";
import fs from "fs-extra";
import path from "path";

interface DirectoryStructure {
  name: string;
  path: string;
  type: "file" | "directory";
  children?: DirectoryStructure[];
}

export const getDirStructure = async (
  dirPath: string = configurations.fs.project
): Promise<DirectoryStructure[]> => {
  const getStructure = async (
    currentPath: string
  ): Promise<DirectoryStructure> => {
    const stats = await fs.stat(currentPath);
    const relativePath = path.relative(dirPath, currentPath);

    // Skip `node_modules` directory and its contents
    if (path.basename(currentPath) === "node_modules" && stats.isDirectory()) {
      return {
        name: "node_modules",
        path: relativePath,
        type: "directory",
      };
    }

    const structure: DirectoryStructure = {
      name: path.basename(currentPath),
      path: relativePath,
      type: stats.isDirectory() ? "directory" : "file",
    };

    if (stats.isDirectory()) {
      const children = await fs.readdir(currentPath);
      structure.children = await Promise.all(
        children.map((child) => getStructure(path.join(currentPath, child)))
      );
    }

    return structure;
  };

  const rootChildren = await fs.readdir(dirPath);
  const structure = await Promise.all(
    rootChildren.map((child) => getStructure(path.join(dirPath, child)))
  );

  return structure;
};
