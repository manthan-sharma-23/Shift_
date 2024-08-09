import { FILE_ATOM } from "@/core/store/atoms/file.atom";
import { getLanguageFromFileExtension } from "@/lib/helpers/lang";
import MonacoEditor from "@monaco-editor/react";
import { useSearchParams } from "react-router-dom";
import { useRecoilState } from "recoil";

const CodeEditor = () => {
  const [fileContent, setFileContent] = useRecoilState(FILE_ATOM);
  const [params] = useSearchParams();
  const path = params.get("path")?.split("/");

  if (!path) {
    return <div>Select a file</div>;
  }

  const file = path[path.length - 1];
  const lang = getLanguageFromFileExtension(file);

  return (
    <div className="h-full w-full">
      <MonacoEditor
        language={lang}
        className="h-full w-full"
        theme="vs-dark"
        value={fileContent}
      />
    </div>
  );
};

export default CodeEditor;
