import { z } from 'zod';

export const ProjectCreationInput = z.object({
  name: z.string(),
  type: z.string(),
});
