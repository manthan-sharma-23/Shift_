import { Link, useLocation } from "react-router-dom";
import ListWorkSpaces from "./ListWorkSpaces";
import { PiCubeFill } from "react-icons/pi";
import { cn } from "@/lib/utils";
import { MdOutlineCellTower } from "react-icons/md";
import { LuGitMerge } from "react-icons/lu";

const nav = [
  {
    icon: PiCubeFill,
    name: "Projects",
    href: "/app/projects",
  },
  {
    icon: MdOutlineCellTower,
    name: "Social",
    href: "/app/social",
  },
  {
    icon: LuGitMerge,
    name: "Collaborations",
    href: "/app/collab",
  },
];

const AppBar = () => {
  const { pathname } = useLocation();
  return (
    <div className="w-full h-full flex flex-col p-2 py-5">
      <div className="w-full h-[6vh] px-2 flex items-center justify-center ">
        <ListWorkSpaces />
      </div>
      <div className="w-full h-auto flex flex-col items-center justify-start gap-2">
        <h1 className=" mb-5 text-sm text-white/10">
          ░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░
        </h1>
        {nav &&
          nav.map((option, index) => {
            return (
              <Link
                key={index}
                to={option.href}
                className={cn(
                  " w-full h-auto flex  justify-start items-center gap-3 hover:bg-white/5 px-2 py-1 rounded-md cursor-pointer",
                  pathname === option.href
                    ? "text-white bg-white/5"
                    : "text-white/75 "
                )}
              >
                <option.icon />
                <p>{option.name}</p>
              </Link>
            );
          })}
      </div>
    </div>
  );
};

export default AppBar;
