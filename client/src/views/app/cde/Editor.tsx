import {
  ResizableHandle,
  ResizablePanel,
  ResizablePanelGroup,
} from "@/components/ui/resizable";
import MonacoEditor from "@monaco-editor/react";

const Editor = () => {
  return (
    <div className="h-full w-full flex flex-col justify-center items-center">
      <div className="h-[3.5%] w-full bg-editor"></div>
      <div className=" h-[93%] w-full">
        <ResizablePanelGroup direction="horizontal">
          <ResizablePanel defaultSize={15} maxSize={20} minSize={15}>
            File structure
          </ResizablePanel>
          <ResizableHandle  className="bg-white/40"/>
          <ResizablePanel defaultSize={55} minSize={45}>
            <ResizablePanelGroup direction="vertical">
              <ResizablePanel defaultSize={70}>
                <MonacoEditor
                  defaultLanguage="text"
                  className="h-full w-full"
                  theme="vs-dark"
                />
              </ResizablePanel>
              <ResizableHandle className="bg-blue-500"/>
              <ResizablePanel defaultSize={30}>Terminal</ResizablePanel>
            </ResizablePanelGroup>
          </ResizablePanel>
          <ResizableHandle />
          <ResizablePanel defaultSize={30}>
            <iframe src="http://localhost:4000/" className="h-full w-full" />
          </ResizablePanel>
        </ResizablePanelGroup>
      </div>
      <div className="h-[3.5%] w-full bg-editor"></div>
    </div>
  );
};

export default Editor;
