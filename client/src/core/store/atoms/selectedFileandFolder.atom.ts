import { atom } from "recoil";

export const SelectedFileAndFolderAtom = atom({
  default: {
    file: "",
    folder: "",
  },
  key: "seleclted/file/folder/atom",
});
