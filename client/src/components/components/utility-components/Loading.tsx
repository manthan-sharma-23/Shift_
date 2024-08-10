import { BiSolidCube } from "react-icons/bi";
import "@/styles/Loading.css";

const Loading = () => {
  return (
    <div className="h-full w-full flex flex-col justify-center items-center text-white/70">
      <div className="relative flex flex-col items-center">
        <BiSolidCube className="bounce" style={{ fontSize: "2rem" }} />
      </div>
    </div>
  );
};

export default Loading;
