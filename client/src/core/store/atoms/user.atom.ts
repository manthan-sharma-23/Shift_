import { User } from "@/core/types/user.types";
import { atom } from "recoil";

export const UserAtom = atom({
  key: "key/user/details/hook",
  default: null as User | null,
});
