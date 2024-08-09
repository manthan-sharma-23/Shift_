import Loading from "@/components/components/utility-components/Loading";
import Server from "@/core/api/api";
import { Cube } from "@/core/types/cube.types";
import { useQuery } from "@tanstack/react-query";
import logo from "@/assets/containers.png";
import moment from "moment";
import { PiCubeDuotone } from "react-icons/pi";
import { useNavigate } from "react-router-dom";
const ProjectsList = () => {
  const { data: cubes, isLoading } = useQuery({
    queryFn: () => new Server().cube.get_user_cubes(),
    queryKey: ["cubes"],
  });

  if (isLoading) {
    return (
      <div className="h-[50vh] w-full">
        <Loading />
      </div>
    );
  }

  return (
    <div className="w-full h-auto px-5 flex flex-wrap gap-5">
      {cubes && cubes.map((cube) => <CubeC key={cube.id} cube={cube} />)}
    </div>
  );
};

function CubeC({ cube }: { cube: Cube }) {
  const navigate = useNavigate();
  return (
    <div
      onClick={() => {
        console.log("New here");

        navigate(`/app/project/${cube.id}`);
      }}
      className="relative block h-[25vh] w-[25vw] rounded-md overflow-hidden cursor-pointer hover:scale-[.98] duration-500"
    >
      <img src={logo} className="opacity-85 bg-black" />
      <div className="absolute top-0 left-0 z-20 h-full w-full">
        <div className="bg-black/80 h-full w-[70%] p-4 flex flex-col justify-end items-start">
          <p className="font-poppins text-3xl">{cube.name}</p>
          <p className="text-[1rem]">{moment(cube.createdAt).fromNow()}</p>
        </div>
      </div>
      <div className="absolute bottom-0 right-0 p-4 z-100">
        <PiCubeDuotone className="bg-white text-black text-3xl p-1 rounded-xl" />
      </div>
    </div>
  );
}

export default ProjectsList;