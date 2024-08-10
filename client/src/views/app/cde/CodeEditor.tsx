import { FILE_ATOM } from "@/core/store/atoms/file.atom";
import { getLanguageFromFileExtension } from "@/lib/helpers/lang";
import MonacoEditor from "@monaco-editor/react";
import { useSearchParams } from "react-router-dom";
import { useRecoilState } from "recoil";
import { Socket } from "socket.io-client";
import { toast, Toaster } from "sonner";

const CodeEditor = ({ socket }: { socket: Socket }) => {
  const [fileContent, setFileContent] = useRecoilState(FILE_ATOM);
  const [params] = useSearchParams();
  const path = params.get("path")?.split("/");

  if (!path) {
    return <div>Select a file</div>;
  }

  const sendFileData = (value: string) => {
    const path_ = params.get("path");
    socket.emit("change:file:content", { file: value, path: path_ });

    toast.success("File Saved", { richColors: true });
  };

  const file = path[path.length - 1];
  const lang = getLanguageFromFileExtension(file);

  const onKeyDown = (event: React.KeyboardEvent) => {
    // Check if Ctrl + S is pressed
    if (event.ctrlKey && event.key === "s") {
      event.preventDefault(); // Prevent the default browser save behavior
      sendFileData(fileContent);
    }
  };

  return (
    <div className="h-full w-full" onKeyDown={onKeyDown}>
      <Toaster position="top-center" expand={false} style={{backgroundColor:"black"}} />
      <MonacoEditor
        language={lang}
        className="h-full w-full"
        theme="vs-dark"
        value={fileContent}
        onChange={(value) => {
          if (value) setFileContent(value);
        }}
      />
    </div>
  );
};

export default CodeEditor;
