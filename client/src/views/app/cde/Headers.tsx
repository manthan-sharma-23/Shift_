import { IoMdHome } from "react-icons/io";
import { useNavigate } from "react-router-dom";

const Headers = () => {
  const navigate = useNavigate();
  return (
    <div className="h-full w-full flex items-center justify-start px-3">
      <IoMdHome
        onClick={() => {
          navigate("/app/projects");
        }}
        className="text-[1.1rem] text-gray-400 cursor-pointer text"
      />
    </div>
  );
};

export default Headers;
