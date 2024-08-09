import {
  ResizableHandle,
  ResizablePanel,
  ResizablePanelGroup,
} from "@/components/ui/resizable";
import { FileTreeAtom } from "@/core/store/atoms/file_tree.atom";
import { DirectoryStructure } from "@/core/types/cde.types";

import { useEffect, useRef } from "react";
import { useSetRecoilState } from "recoil";
import { Socket, io } from "socket.io-client";
import FileTree from "./FileTree";
import { useLocation, useSearchParams } from "react-router-dom";
import { FILE_ATOM } from "@/core/store/atoms/file.atom";
import CodeEditor from "./CodeEditor";
import Footer from "./Footer";
import Headers from "./Headers";

const Editor = () => {
  const socketRef = useRef<Socket | null>(null);
  const { pathname } = useLocation();
  const [params] = useSearchParams();
  const setFileTree = useSetRecoilState<DirectoryStructure[]>(FileTreeAtom);
  const setFile = useSetRecoilState(FILE_ATOM);

  useEffect(() => {
    console.log("Use effect triggered");

    async function getfile() {
      const path = params.get("path");
      const res = (await sendRequest("get:file", path!)) as string;
      setFile(res);
    }
    if (socketRef.current) {
      getfile();
    } else {
      console.error("No active socket connection");
    }
  }, [params, pathname]);

  useEffect(() => {
    const socket = io("http://localhost:3300");

    socket.on("connect", async () => {
      console.log("Connected to Container");

      socketRef.current = socket;

      const message = (await sendRequest("get:fs")) as DirectoryStructure[];
      console.log("Message", message);

      setFileTree(message);
    });

    return () => {
      socket.disconnect();
      socketRef.current = null;
    };
  }, []);

  function sendRequest(type: string, data: unknown = {}) {
    return new Promise((resolve, reject) => {
      if (!socketRef.current) {
        alert("No socket state active");
        return;
      }
      socketRef.current.emit(type, data, (response: unknown, err: unknown) => {
        if (!err) {
          resolve(response);
        } else {
          reject(err);
        }
      });
    });
  }

  return (
    <div className="h-full w-full flex flex-col justify-center items-center">
      <div className="h-[3.5%] w-full bg-primary-black border-b border-gray-500/60">
        <Headers />
      </div>
      <div className=" h-[93%] w-full">
        <ResizablePanelGroup direction="horizontal">
          <ResizablePanel defaultSize={15} maxSize={20} minSize={15}>
            <FileTree />
          </ResizablePanel>
          <ResizableHandle className="bg-white/40" />
          <ResizablePanel defaultSize={55} minSize={45}>
            <ResizablePanelGroup direction="vertical">
              <ResizablePanel defaultSize={70}>
                <CodeEditor />
              </ResizablePanel>
              <ResizableHandle className="bg-blue-500" />
              <ResizablePanel defaultSize={30} className="bg-primary-black">
                {/* <Terminal socketRef={socketRef} /> */}
              </ResizablePanel>
            </ResizablePanelGroup>
          </ResizablePanel>
          <ResizableHandle className="bg-gray-500" />
          <ResizablePanel defaultSize={30}>
            <iframe
              src="http://localhost:2450/auth/signin"
              className="h-full w-full"
            />
          </ResizablePanel>
        </ResizablePanelGroup>
      </div>
      <div className="h-[3.5%] w-full bg-primary-black border-t border-gray-500/60">
        <Footer />
      </div>
    </div>
  );
};

export default Editor;
