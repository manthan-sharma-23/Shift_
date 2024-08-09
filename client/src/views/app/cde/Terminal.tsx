import { MutableRefObject, useEffect, useRef } from "react";
import { Terminal as XTerminal } from "@xterm/xterm";
import "@xterm/xterm/css/xterm.css";
import { Socket } from "socket.io-client";

const Terminal = ({
  socketRef,
}: {
  socketRef: MutableRefObject<Socket | null>;
}) => {
  const termRef = useRef<HTMLDivElement | null>(null);
  const termInstance = useRef<XTerminal | null>(null);

  useEffect(() => {
    const term = new XTerminal({rows:40});
    if (!termRef.current || !socketRef.current) {
      console.log("No terminal found exiting");
      return;
    }

    term.open(termRef.current);

    const onData = (data) => {
      term.write(data);
    };

    term.onData((data) => {
      if (socketRef.current) {
        socketRef.current.emit("terminal:write", data);
      }
    });

    socketRef.current.on("terminal:written", (data) => {
        console.log(data);
        
      onData(data);
    });

    // Cleanup function to dispose of the terminal instance
    return () => {
      termInstance.current?.dispose();
    };
  }, []);

  return <div ref={termRef} className="h-full w-full text-white"></div>;
};

export default Terminal;
