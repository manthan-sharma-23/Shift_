import { Router } from "express";
import { getDirStructure } from "../controllers/dir";
import fs from "fs";
import { configurations } from "../config";
import { FileObject, readFilesRecursively } from "../controllers/file";
import path from "path";
import util from "util";
import { exec } from "child_process";
import { spawn } from "child_process";

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

  const PORT2 = process.env.PORT2;

  if (!PORT2) {
    return res.status(404).json({ message: "No Internal Port available" });
  }

  const projectName = configurations.env.project.projectName;
  const path_to_project = path.join(configurations.fs.project, projectName);

  console.log("FILES ::: ");
  console.log(files.length);

  try {
    await new Promise<void>((resolve, reject) => {
      const lsofProcess = spawn("lsof", ["-t", `-i:${PORT2}`]);
      let output = "";

      lsofProcess.stdout.on("data", (data) => {
        output += data.toString();
      });

      lsofProcess.stderr.on("data", (data) => {
        console.error(`lsof error: ${data}`);
      });

      lsofProcess.on("close", (code) => {
        if (code === 0) {
          if (output) {
            const killProcess = spawn("xargs", ["kill", "-9"]);
            killProcess.stdin.write(output);
            killProcess.stdin.end();

            killProcess.on("close", (killCode) => {
              if (killCode === 0) {
                resolve();
              } else {
                reject(new Error(`kill process exited with code ${killCode}`));
              }
            });
          } else {
            resolve();
          }
        } else {
          reject(new Error(`lsof process exited with code ${code}`));
        }
      });
    });

    console.log("PROCESS KILLED");

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
    console.log("ALL FILES WRITTEN");

    const path_to_script = path.join(configurations.fs.root, "reinit.sh");
    console.log(path_to_script);

    // Spawn the process to execute the shell script
    const script = spawn("bash", [path_to_script, projectName, PORT2]);

    let output = "";

    // Capture stdout data, log it, and accumulate it in the output variable
    script.stdout.on("data", (data) => {
      const dataStr = data.toString();
      console.log(dataStr); // Log the output to the console
      output += dataStr; // Accumulate the output
    });

    // Capture stderr data, log it, and accumulate it in the output variable
    script.stderr.on("data", (data) => {
      const dataStr = data.toString();
      console.error(dataStr); // Log the error output to the console
      output += dataStr; // Accumulate the error output
    });

    // Handle process completion
    script.on("close", (code) => {
      if (code === 0) {
        res.status(200).json({
          message: `Project reinitialized successfully`,
          output: output, // Send all accumulated output back to the client
        });
      } else {
        res.status(500).json({
          error: `Script exited with code ${code}`,
          output: output, // Send all accumulated output back to the client
        });
      }
    });
  } catch (error) {
    res.status(500).json({ error: "Failed to write files", details: error });
  }
});
