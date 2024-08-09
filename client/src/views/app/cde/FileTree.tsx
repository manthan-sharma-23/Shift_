import { FileTreeAtom } from "@/core/store/atoms/file_tree.atom";
import { DirectoryStructure } from "@/core/types/cde.types";
import { useNavigate, useParams } from "react-router-dom";
import { useRecoilValue } from "recoil";
import "@/styles/ScrollBarFileTree.css";

const FileTree = () => {
  const fileTree = useRecoilValue(FileTreeAtom);

  return (
    <div className="h-full w-full bg-[#0F0F0F]  pr-2 overflow-y-scroll file_tree_scroll">
      <RenderTree tree={fileTree} />
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

  return (
    <div className="w-full" style={{ paddingLeft: level * 20 }}>
      <div
        className=" text-sm cursor-pointer mb-1 hover:bg-white/5 pl-4 py-1 rounded-sm"
        onClick={() => {
          if (node.type === "directory") return;
          const params = new URLSearchParams({ path: node.path });
          navigate(`/app/project/${projectId}?${params}`);
        }}
      >
        {node.children ? "🗀 " : "🗌 "}
        {node.name}
      </div>
      {node.children && node.children.length > 0 && (
        <div>
          {node.children.map((childNode) => (
            <TreeNode key={childNode.name} node={childNode} level={level + 1} />
          ))}
        </div>
      )}
    </div>
  );
};

export default FileTree;
