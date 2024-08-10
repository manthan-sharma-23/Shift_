import { Ports } from "@/core/types/cube.types";
import { atom } from "recoil";

export const PORTS_ATOM = atom({
  key: "ports/cube/key/default",
  default: null as Ports | null,
});
