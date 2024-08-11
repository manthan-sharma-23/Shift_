import { Router } from "express";
import { getDirStructure } from "../controllers/dir";
import fs from "fs";
import { configurations } from "../config";
import { readFilesRecursively } from "../controllers/file";

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
