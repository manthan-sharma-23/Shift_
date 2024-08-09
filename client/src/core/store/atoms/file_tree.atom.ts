import { DirectoryStructure } from "@/core/types/cde.types";
import { atom } from "recoil";

export const FileTreeAtom = atom({
  key: "/file/tree/atom/new",
  default: [] as DirectoryStructure[],
});
