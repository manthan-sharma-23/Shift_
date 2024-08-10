import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import { FileTreeAtom } from "@/core/store/atoms/file_tree.atom";
import { DirectoryStructure } from "@/core/types/cde.types";
import { useNavigate, useParams, useSearchParams } from "react-router-dom";
import { useRecoilState, useRecoilValue, useSetRecoilState } from "recoil";
import "@/styles/ScrollBarFileTree.css";
import { findIcon } from "@/lib/helpers/iconFinder";
import clsx from "clsx";
import { FaFolder } from "react-icons/fa";
import { useEffect } from "react";
import { SELECTED_ATOM_DIR } from "@/lib/helpers/selectedDirectory.atom";
import { FaFileCirclePlus } from "react-icons/fa6";
import { MdCreateNewFolder } from "react-icons/md";
import { RiDeleteBin7Fill } from "react-icons/ri";

const FileTree = () => {
  const fileTree = useRecoilValue(FileTreeAtom);
  const path = useSearchParams()[0].get("path");
  const [cwd, setCWD] = useRecoilState(SELECTED_ATOM_DIR);
  console.log(cwd);

  useEffect(() => {
    if (!path) return;
    const dir_path = path.split("/");
    dir_path.pop();
    const actual_dir_path = "";
    dir_path.forEach((el) => {
      actual_dir_path.concat(el + "/");
    });

    setCWD(actual_dir_path);
  }, [path]);

  return (
    <div className="h-full w-full bg-[#0F0F0F]  px-3 py-2 overflow-y-scroll file_tree_scroll ">
      <div className="h-[1rem] w-full justify-end flex items-center gap-4 text-gray-600 px-2 my-2 ">
        <FaFileCirclePlus className="cursor-pointer hover:text-gray-300" />
        <MdCreateNewFolder className="cursor-pointer hover:text-gray-300" />
        <RiDeleteBin7Fill className="cursor-pointer hover:text-gray-300" />
      </div>
      <RenderTree tree={fileTree} />
    </div>
  );
};

const RenderTree = ({ tree }: { tree: DirectoryStructure[] }) => {
  return (
    <div className="w-full h-auto">
      {tree.map((node) => (
        <TreeNode key={node.name} node={node} level={0} />
      ))}
    </div>
  );
};

const TreeNode = ({
  node,
  level,
}: {
  node: DirectoryStructure;
  level: number;
}) => {
  const { projectId } = useParams();
  const navigate = useNavigate();
  const [params] = useSearchParams();
  const globalPath = params.get("path");
  const setCWD = useSetRecoilState(SELECTED_ATOM_DIR);

  const path = node.path.split("/");

  const dir_path = globalPath?.split("/");
  dir_path?.pop();
  const actual_dir_path = "";
  dir_path?.forEach((el) => {
    actual_dir_path.concat(el + "/");
  });

  const file = path[path.length - 1];

  const icon_ = findIcon(file);

  return (
    <div className="w-full" style={{ paddingLeft: level * 15 }}>
      {node.children && node.children.length > 0 ? (
        <Accordion type="single" collapsible>
          <AccordionItem value={node.name} className="border-0">
            <AccordionTrigger
              className={clsx(
                " px-2 text-sm cursor-pointer hover:bg-white/5 py-1 rounded-sm ",
                actual_dir_path === node.path && "bg-white/5"
              )}
              onClick={() => setCWD(node.path)}
            >
              <div className="flex items-center justify-start gap-2">
                <FaFolder className="w-auto text-gray-500" />
                {node.name}
              </div>
            </AccordionTrigger>
            <AccordionContent>
              {node.children.map((childNode) => (
                <TreeNode
                  key={childNode.path}
                  node={childNode}
                  level={level + 1}
                />
              ))}
            </AccordionContent>
          </AccordionItem>
        </Accordion>
      ) : (
        <div
          className={clsx(
            "px-3 text-sm cursor-pointer mb-1 hover:bg-white/5 py-1 rounded-sm flex items-center h-auto gap-1",
            globalPath == node.path && "bg-white/5"
          )}
          onClick={() => {
            if (node.type === "file") {
              const params = new URLSearchParams({ path: node.path });
              navigate(`/app/project/${projectId}?${params}`);
            }
          }}
        >
          {icon_ ? <icon_.icon className={clsx(icon_.color)} /> : "🗌"}
          {node.name}
        </div>
      )}
    </div>
  );
};

export default FileTree;
