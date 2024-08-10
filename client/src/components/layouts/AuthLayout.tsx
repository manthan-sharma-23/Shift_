import { Outlet, useNavigate } from "react-router-dom";
import logo from "/icon.svg";
import { Toaster } from "sonner";

const MyComponent = () => {
  const navigate = useNavigate();
  return (
    <div className="realtive bg-gradient-to-r from-pink-500 via-red-500  to-purple-500  from-purple-500 via-indigo-500 to-blue-500  bg-[length:400%_400%] animate-gradientMove text-white h-screen w-screen flex justify-center items-center">
      <div
        onClick={() => {
          navigate("/");
        }}
        className="cursor-pointer absolute shadow-md shadow-black/30 bg-white text-black top-0 left-0 h-[2.5rem] overflow-hidden w-auto p-1 rounded-md ml-5 mt-5 flex justify-start px-3 items-center gap-2"
      >
        <img src={logo} className=" h-[75%]" />
      </div>
      <Outlet />
      <Toaster position="bottom-right" />
    </div>
  );
};

export default MyComponent;
