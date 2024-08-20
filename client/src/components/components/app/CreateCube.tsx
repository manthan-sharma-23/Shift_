import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import Server from "@/core/api/api";
import { cube_types } from "@/lib/helpers/cube_types";
import { useMutation } from "@tanstack/react-query";
import clsx from "clsx";
import { useState } from "react";
import Loading from "../utility-components/Loading";

const CreateCube = () => {
  const [projectName, setProjectName] = useState("");
  const [projectType, setProjectType] = useState("");
  const { mutate, isPending } = useMutation({
    mutationFn: new Server().cube.create_user_cube,
    onError: (err) => {
      console.log(err);
    },
    onSuccess: () => {
      window.location.reload();
    },
  });

  const onCreateCube = () => {
    if (projectName && projectType) {
      mutate({ name: projectName.toLowerCase(), type: projectType });
    }
  };

  return (
    <div className="bg-primary-dark h-full relative w-full p-4 text-white flex flex-col items-start justify-between py-8 ">
      {isPending && (
        <div className="h-full w-full absolute bg-primary-black">
          <Loading />
        </div>
      )}
      <div className="h-auto w-full  flex flex-col items-start justify-start ">
        <div className="text-xl font-semibold mb-1">Create Cube</div>
        <p className="font-medium text-gray-500 mb-4">
          create a cube (project) you want to create
        </p>
        <div className="grid w-full max-w-sm items-center gap-2 mb-4">
          <Label htmlFor="Name">Cube Name</Label>
          <Input
            disabled={isPending}
            type="text"
            id="name"
            placeholder="Cube Name"
            className="bg-transparent focus:ring-1 focus:outline-none w-[270px]"
            value={projectName}
            onChange={(e) => setProjectName(e.target.value)}
          />
        </div>
        <div className="grid w-full max-w-sm items-center gap-2 mb-4">
          <Label htmlFor="Name">Cube Type</Label>
          <Select
            disabled={isPending}
            onValueChange={(v) => setProjectType(v)}
            value={projectType}
          >
            <SelectTrigger className="w-[270px] text-white bg-transparent ">
              <SelectValue placeholder="Cube Type" />
            </SelectTrigger>
            <SelectContent className="flex flex-col">
              {cube_types.map((cube) => {
                return (
                  <SelectItem
                    value={cube.type}
                    key={cube.type}
                    className="flex items-center justify-start w-full gap-3 h-full  pl-7 "
                  >
                    <div className=" flex gap-2 text-[1.1rem] items-center justify-center">
                      <cube.icon className={clsx(cube.color)} />
                      <p>{cube.label}</p>
                    </div>
                  </SelectItem>
                );
              })}
            </SelectContent>
          </Select>
        </div>
      </div>
      <Button
        disabled={isPending}
        onClick={onCreateCube}
        className="bg-white text-primary-black h-[2.2rem] hover:bg-white/75 text-[.9rem] font-medium"
      >
        Create cube
      </Button>
    </div>
  );
};

export default CreateCube;
