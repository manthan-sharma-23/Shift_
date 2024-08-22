import {
  Table,
  TableBody,
  TableCaption,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Cube } from "@/core/types/cube.types";
import { useMutation } from "@tanstack/react-query";
import moment from "moment";
import { RxDotsVertical } from "react-icons/rx";
import { useSetRecoilState } from "recoil";
import Server from "../../../core/api/api";
import { PORTS_ATOM } from "@/core/store/atoms/ports.atom";
import { toast } from "sonner";
import { MdOpenInNew } from "react-icons/md";
import { twMerge } from "tailwind-merge";
import { useState } from "react";
import LinearProgress from "@mui/material/LinearProgress";

const ProjectsTable = ({ cubes }: { cubes: Cube[] }) => {
  return (
    <Table className="border  border-white/20 rounded-xl font-poppins">
      <TableCaption>A list of your projects.</TableCaption>
      <TableHeader className="border-0">
        <TableRow className="hover:bg-white/5 border-0">
          <TableHead className="w-[150px]">Sno.</TableHead>
          <TableHead className={"w-[10vw]"}>Type</TableHead>
          <TableHead className={"w-[30vw]"}>Project Name</TableHead>
          <TableHead className="w-[10vw]">Status</TableHead>
          <TableHead className="w-[10vw]">Updated At</TableHead>
          <TableHead className="w-[10vw]">Created At</TableHead>
          <TableHead className="w-[10vw]" />
          <TableHead className="text-right" />
        </TableRow>
      </TableHeader>
      <TableBody>
        {cubes.map((cube, index) => (
          <CubeTableRow cube={cube} index={index} />
        ))}
      </TableBody>
    </Table>
  );
};

const CubeTableRow = ({ cube, index }: { cube: Cube; index: number }) => {
  const setPorts = useSetRecoilState(PORTS_ATOM);
  const [loading, setLoading] = useState(false);
  const { mutate } = useMutation({
    mutationFn: new Server().cube.run_cube,
    onError: (err) => {
      toast.error(err.message, { richColors: true });
      setLoading(false);
    },
    onSuccess: (data) => {
      if (data) {
        setPorts(data);
        window.localStorage.setItem("ports", JSON.stringify(data));
      }
      toast.success("Cubed successfully , ports set alive", {
        richColors: true,
      });
      window.location.assign(`/app/project/${cube.id}`);
      setLoading(false);
    },
  });

  const onClickOnCube = async () => {
    if (!loading) {
      setLoading(true);
      mutate({ cubeId: cube.id });
    }
  };
  return (
    <TableRow className="hover:bg-white/5 border-0" key={cube.id}>
      <TableCell className="font-medium">{index + 1}</TableCell>
      <TableCell>{cube.type}</TableCell>
      <TableCell className="font-bold">{cube.name}</TableCell>
      <TableCell>{cube.status}</TableCell>
      <TableCell>{moment(cube.updatedAt).fromNow()}</TableCell>
      <TableCell>{moment(cube.createdAt).format("ll")}</TableCell>
      <TableCell className="text-center">
        {(loading || cube.status === "preparing") ? (
          <LinearProgress />
        ) : (
          <MdOpenInNew
            onClick={onClickOnCube}
            className={twMerge(
              "hover:cursor-pointer hover:text-blue-600 text-lg",
              cube.status === "running" && "text-green-400 hover:text-green-500"
            )}
          />
        )}
      </TableCell>
      <TableCell className="text-right">
        <RxDotsVertical />
      </TableCell>
    </TableRow>
  );
};

export default ProjectsTable;
