import { useState } from "react";
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
import { SELECTED_ATOM_DIR } from "@/lib/helpers/selectedDirectory.atom";
import { FaFileCirclePlus } from "react-icons/fa6";
import { MdCreateNewFolder } from "react-icons/md";
import { RiDeleteBin7Fill } from "react-icons/ri";
import { SelectedFileAndFolderAtom } from "@/core/store/atoms/selectedFileandFolder.atom";

const FileTree = () => {
  const fileTree = useRecoilValue(FileTreeAtom);
  const path = useSearchParams()[0].get("path");
  const [_cwd, setCWD] = useRecoilState(SELECTED_ATOM_DIR);
  const [isCreating, setIsCreating] = useState<{
    type: "file" | "folder";
    parent: string;
  } | null>(null);
  const [newName, setNewName] = useState("");

  console.log("FILE TREE", fileTree);

  const handleCreate = () => {
    if (isCreating && newName.trim()) {
      // Handle the creation of new file or folder
      // Update FileTreeAtom with new file/folder
      // For example, you could do a setRecoilState on FileTreeAtom to add the new item
      setIsCreating(null);
      setNewName("");
    }
  };

  return (
    <div className="h-full w-full bg-[#0F0F0F]  px-3 py-2 overflow-y-scroll file_tree_scroll ">
      <div className="h-[1rem] w-full justify-end flex items-center gap-4 text-gray-600 px-2 my-2 ">
        <FaFileCirclePlus
          className="cursor-pointer hover:text-gray-300"
          onClick={() => setIsCreating({ type: "file", parent: _cwd })}
        />
        <MdCreateNewFolder
          className="cursor-pointer hover:text-gray-300"
          onClick={() => setIsCreating({ type: "folder", parent: _cwd })}
        />
        <RiDeleteBin7Fill className="cursor-pointer hover:text-gray-300" />
      </div>
      <RenderTree tree={fileTree} />
      {isCreating && (
        <div className="p-2">
          <input
            type="text"
            value={newName}
            onChange={(e) => setNewName(e.target.value)}
            onBlur={handleCreate}
            onKeyDown={(e) => e.key === "Enter" && handleCreate()}
            placeholder={`Enter ${isCreating.type} name`}
            autoFocus
            className="w-full bg-gray-800 text-white p-1 rounded-sm"
          />
        </div>
      )}
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
  const [selectedCWD, setSelectedFileAndFolder] = useRecoilState(
    SelectedFileAndFolderAtom
  );
  const path = node.path.split("/");

  const dir_path = globalPath?.split("/");
  dir_path?.pop();
  const actual_dir_path = "";
  dir_path?.forEach((el) => {
    actual_dir_path.concat(el + "/");
  });

  const file = path[path.length - 1];
  const icon_ = findIcon(file);

  const handleFolderClick = () => {
    setCWD(node.path);
    setSelectedFileAndFolder({
      file: "",
      folder: node.path,
    });
  };

  const handleFileClick = () => {
    setSelectedFileAndFolder({
      file: node.path,
      folder: path.slice(0, -1).join("/"),
    });

    const params = new URLSearchParams({ path: node.path });
    navigate(`/app/project/${projectId}?${params}`);
  };

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
              onClick={handleFolderClick}
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
          onClick={handleFileClick}
        >
          {icon_ ? <icon_.icon className={clsx(icon_.color)} /> : "🗌"}
          {node.name}
        </div>
      )}
    </div>
  );
};

export default FileTree;
