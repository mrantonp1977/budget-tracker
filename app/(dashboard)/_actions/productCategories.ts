"use server";

import prisma from "@/lib/prisma";
import { CreateProductCategorySchema, CreateProductCategorySchemaType, DeleteProductCategorySchema, DeleteProductCategorySchemaType } from "@/schema/productCategories";
import { currentUser } from "@clerk/nextjs/server";
import { redirect } from "next/navigation";

export async function CreateProductCategory(form: CreateProductCategorySchemaType) {
  const parsedBody = CreateProductCategorySchema.safeParse(form);

  if (!parsedBody.success) {
    throw new Error ("Invalid form data");
  }

  const user = await currentUser();

  if (!user) {
    redirect("/sign-in");
  }

  const { name, icon, type } = parsedBody.data;
  return await prisma.productCategory.create({
    data: {
      userId: user.id,
      name,
      icon,
      type,
    }
  })
}




export async function DeleteProductCategory(form: DeleteProductCategorySchemaType) {
  const parsedBody = DeleteProductCategorySchema.safeParse(form);

  if (!parsedBody.success) {
    throw new Error ("Invalid form data");
  }

  const user = await currentUser();

  if (!user) {
    redirect("/sign-in");
  }

  return await prisma.productCategory.delete({
    where: {
      name_userId_type: {
        userId: user.id,
        name: parsedBody.data.name,
        type: parsedBody.data.type
      }
    }
  })
 
}