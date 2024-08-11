import { Button } from "@/components/ui/button";
import { IoAdd } from "react-icons/io5";
import { PiCubeFill } from "react-icons/pi";
import ProjectsList from "./ProjectsList";
import CreateCube from "@/components/components/app/CreateCube";
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet";
import { Toaster } from "sonner";
import { GLOBAL_LOADING } from "@/core/store/atoms/globalLoading";
import { useRecoilValue } from "recoil";
import Loading from "@/components/components/utility-components/Loading";

const Projects = () => {
  const globalLoading = useRecoilValue(GLOBAL_LOADING);

  return (
    <div className=" h-full relative w-full flex flex-col justify-start items-center">
      {globalLoading && (
        <div className="h-full w-full absolute z-[200] bg-black/80">
          <Loading />
        </div>
      )}
      <div className="h-[25vh] w-full">
        <Banner />
      </div>
      <div className="h-[10vh] w-full px-5 flex justify-between items-center">
        <p className="font-poppins text-2xl font-normal text-white/75 flex gap-2 justify-center items-center">
          Recent
        </p>
        <div className="w-auto h-full flex gap-3 items-center justify-center">
          <Sheet>
            <SheetTrigger>
              <Button className="gap-2 bg-white text-black hover:bg-white/80">
                <IoAdd className="text-lg" />
                <p>Create Cube</p>
              </Button>
            </SheetTrigger>
            <SheetContent className="bg-black border-0 text-white p-0 m-0">
              <CreateCube />
            </SheetContent>
          </Sheet>
          <Button className="gap-2  bg-white text-black hover:bg-white/80">
            <PiCubeFill />
            <p>Explore Cubes</p>
          </Button>
        </div>
      </div>
      <div className="w-full h-auto flex flex-wrap">
        <ProjectsList />
      </div>
      <Toaster />
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
