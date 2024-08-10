import { z } from 'zod';

export const ProjectCreationInput = z.object({
  name: z.string(),
  type: z.string(),
});

export const RunCubeInput = z.object({
  cubeId: z.string(),
});
