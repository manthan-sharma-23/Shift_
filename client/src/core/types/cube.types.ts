export interface Cube {
  id: string;
  name: string;
  createdAt: Date;
  updatedAt: Date;
  type: CubeType;
  userId: string;
  status: "running" | "stopped" | "preparing";
}

export enum CubeType {
  REACT_JS = "react-js-vite",
}

export type CreateCubeInput = {
  name: string;
  type: string;
};

export interface Ports {
  ports: {
    express_port: number;
    other_port: number;
  };
}
