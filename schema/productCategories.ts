import { z } from "zod";

export const CreateProductCategorySchema = z.object({
  name: z.string().min(3).max(255),
  icon: z.string().max(20),
  type: z.enum(["chestnuts", "cherries"]),
});


export type CreateProductCategorySchemaType = z.infer<typeof CreateProductCategorySchema>;


export const DeleteProductCategorySchema = z.object({
  name: z.string().min(3).max(255),
  type: z.enum(["chestnuts", "cherries"]),
});

export type DeleteProductCategorySchemaType = z.infer<typeof DeleteProductCategorySchema>;