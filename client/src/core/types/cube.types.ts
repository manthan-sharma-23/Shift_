export interface Cube {
  id: string;
  name: string;
  createdAt: Date;
  type: CubeType;
  userId: string;
}

export enum CubeType {
  REACT_JS = "react-js-vite",
}

export type CreateCubeInput = {
  name: string;
  type: string;
};
