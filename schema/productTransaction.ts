import { z } from "zod";

export const CreateProductTransactionSchema = z.object({
  amount: z.coerce.number().positive().multipleOf(0.01),
  description: z.string().optional(),
  date: z.coerce.date(),
  productCategory: z.string(),
  type: z.union([z.literal('chestnuts'), z.literal("cherries")]),
});


export type CreateProductTransactionSchemaType = z.infer<typeof CreateProductTransactionSchema>;