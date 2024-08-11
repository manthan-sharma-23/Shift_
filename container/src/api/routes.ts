import { Router } from "express";
import { getDirStructure } from "../controllers/dir";
import fs from "fs";
import { configurations } from "../config";
import { FileObject, readFilesRecursively } from "../controllers/file";
import path from "path";
import util from "util";
import { exec } from "child_process";

const execPromise = util.promisify(exec);
export const router = Router();

router.get("/", (_, res) => {
  return res.json({ status: "ALIVE 200 🟢" });
});

router.get("/fs", async (_, res) => {
  const struct = await getDirStructure();
  return res.json(struct);
});

router.get("/project", async (_, res) => {
  const path = configurations.fs.project;

  const r = await readFilesRecursively(path, "project");
  return res.json(r);
});

router.put("/reinit", async (req, res) => {
  const files = req.body.files as FileObject[];
  const projectName = configurations.env.project.projectName;
  const path_to_project = path.join(configurations.fs.project, projectName);
  try {
    await fs.promises.rm(path_to_project, { recursive: true, force: true });

    await Promise.all(
      files.map(async (file) => {
        const fullPath = path.join(configurations.fs.project, file.path);
        const dir = path.dirname(fullPath);

        // Ensure the directory exists
        await fs.promises.mkdir(dir, { recursive: true });

        // Write the file
        await fs.promises.writeFile(fullPath, file.content, {
          encoding: "utf8",
          flag: "w+",
          mode: 0o666,
        });
      })
    );
    const path_to_script = path.join(configurations.fs.root, "reinit.sh");

    await execPromise(`bash ${path_to_script} ${projectName}`);
    res.status(200).json({
      message: `Project reinitialized successfully , ${files.length} files updated`,
    });
  } catch (error) {
    res.status(500).json({ error: "Failed to write files", details: error });
  }
});
