import Loading from "@/components/components/utility-components/Loading";
import Server from "@/core/api/api";
import { useQuery } from "@tanstack/react-query";
import ProjectsTable from "./ProjectTable";

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
      {cubes && <ProjectsTable cubes={cubes} />}
    </div>
  );
};

export default ProjectsList;
