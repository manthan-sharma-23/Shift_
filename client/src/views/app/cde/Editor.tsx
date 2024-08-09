import {
  ResizableHandle,
  ResizablePanel,
  ResizablePanelGroup,
} from "@/components/ui/resizable";
import { configuration } from "@/core/config/config";
import { FileTreeAtom } from "@/core/store/atoms/file_tree.atom";
import { DirectoryStructure } from "@/core/types/cde.types";

import { useEffect, useRef } from "react";
import { useRecoilState, useSetRecoilState } from "recoil";
import { Socket, io } from "socket.io-client";
import FileTree from "./FileTree";
import { useLocation, useSearchParams } from "react-router-dom";
import { FILE_ATOM } from "@/core/store/atoms/file.atom";
import CodeEditor from "./CodeEditor";

const Editor = () => {
  const socketRef = useRef<Socket | null>(null);
  const { pathname } = useLocation();
  const [params] = useSearchParams();
  const [fileTree, setFileTree] =
    useRecoilState<DirectoryStructure[]>(FileTreeAtom);
  const setFile = useSetRecoilState(FILE_ATOM);

  useEffect(() => {
    console.log("Use effect triggered");

    async function getfile() {
      const path = params.get("path");
      const res = (await sendRequest("get:file:path", path)) as string;
      setFile(res);
    }
    if (socketRef.current) {
      getfile();
    } else {
      console.error("No active socket connection");
    }
  }, [params, pathname]);

  useEffect(() => {
    const socket = io(configuration.server.http_url);

    socket.on("connect", async () => {
      console.log("Socket connected to Proxy Server");

      socketRef.current = socket;

      socketRef.current.emit("list:filesystem");

      const message = (await sendRequest(
        "list:filesystem"
      )) as DirectoryStructure[];

      setFileTree(message);
    });

    return () => {
      socket.disconnect();
      socketRef.current = null;
    };
  }, []);

  function sendRequest(type: string, data: any = null) {
    return new Promise((resolve, reject) => {
      if (!socketRef.current) {
        alert("No socket state active");
        return;
      }
      socketRef.current.emit(type, data, (response: any, err: any) => {
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
        {params.get("path")}
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
                Terminal
              </ResizablePanel>
            </ResizablePanelGroup>
          </ResizablePanel>
          <ResizableHandle className="bg-gray-500" />
          <ResizablePanel defaultSize={30}>
            <iframe src="http://localhost:2450/auth/signin" className="h-full w-full" />
          </ResizablePanel>
        </ResizablePanelGroup>
      </div>
      <div className="h-[3.5%] w-full bg-primary-black border-t border-gray-500/60"></div>
    </div>
  );
};

export default Editor;
