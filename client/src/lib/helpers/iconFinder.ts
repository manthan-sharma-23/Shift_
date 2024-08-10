import { icons } from "./icons";

export const findIcon = (file: string) => {
  const ext = `.${file.split(".").pop()}`;

  if (!ext) icons.get("default");

  return icons.get(ext) || icons.get("default");
};
