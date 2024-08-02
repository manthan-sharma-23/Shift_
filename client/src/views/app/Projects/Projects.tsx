import { Button } from "@/components/ui/button";
import { FaTools } from "react-icons/fa";
import { IoAdd } from "react-icons/io5";
import { FaCube } from "react-icons/fa";
import { useRecoilValue } from "recoil";
import { UserAtom } from "@/core/store/atoms/user.atom";

const Projects = () => {
  const user = useRecoilValue(UserAtom);

  return (
    <div className="h-full w-full flex flex-col justify-start items-center">
      <div className="h-[25vh] w-full">
        <Banner />
      </div>
      <div className="h-[10vh] w-full px-5 flex justify-between items-center">
        <p className="font-poppins text-2xl font-normal text-white/75 flex gap-2 justify-center items-center">
          Recent
        </p>
        <div className="w-auto h-full flex gap-3 items-center justify-center">
          <Button className="gap-2">
            <IoAdd className="text-lg" />
            <p>Create Cube</p>
          </Button>
          <Button className="gap-2 ">
            <FaCube />
            <p>Explore Cubes</p>
          </Button>
        </div>
      </div>
    </div>
  );
};

function Banner() {
  return (
    <div className="h-full w-full bg-gradient-to-r from-yellow-400 via-yellow-500 to-green-400 flex justify-center items-center animate-gradientMove">
      <div className="text-center text-white">
        <h1 className="text-4xl font-bold">
          Lynx - Your Reliable Cloud Development Environment
        </h1>
        <p className="text-lg mt-2 font-medium">
          Manage and create projects effortlessly
        </p>
      </div>
    </div>
  );
}

export default Projects;
