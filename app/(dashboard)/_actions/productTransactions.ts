"use server";

import prisma from "@/lib/prisma";
import { CreateProductTransactionSchema, CreateProductTransactionSchemaType } from "@/schema/productTransaction";
import { CreateTransactionSchema, CreateTransactionSchemaType } from "@/schema/transaction";
import { currentUser } from "@clerk/nextjs/server";
import { redirect } from "next/navigation";

export async function CreateProductTransaction(form: CreateProductTransactionSchemaType) {
  const parsedBody = CreateProductTransactionSchema.safeParse(form);

  if (!parsedBody.success) {
    throw new Error("Invalid form data");
  }

  const user = await currentUser();

  if (!user) {
    redirect("/sign-in");
  }

  const { amount, productCategory, date, description, type } = parsedBody.data;


  const productCategoryRow = await prisma.productCategory.findFirst({
    where: {
      name: productCategory,
      userId: user.id,
    },
  });

  if (!productCategoryRow) {
    throw new Error("Category not found");
  }

  

  await prisma.$transaction([
    prisma.productTransaction.create({
      data: {
        userId: user.id,
        amount,
        date,
        description: description || "",
        type,
        productCategory: productCategoryRow.name,
        productCategoryIcon: productCategoryRow.icon,
      },
    }),

    prisma.productMonthHistory.upsert({
      where: {
        userId_day_month_year: {
          userId: user.id,
          day: date.getUTCDate(),
          month: date.getUTCMonth(),
          year: date.getUTCFullYear(),
          
        },
      },
      create: {
        userId: user.id,
        day: date.getUTCDate(),
        month: date.getUTCMonth(),
        year: date.getUTCFullYear(),
        chestnuts: type === "chestnuts" ? amount : 0,
        cherries: type === "cherries" ? amount : 0,
      },
      update: {
        chestnuts: {
          increment: type === "chestnuts" ? amount : 0,
        },
        cherries: {
          increment: type === "cherries" ? amount : 0,
        },
      },
    }),

    prisma.productYearHistory.upsert({
      where: {
        userId_year_month: {
          userId: user.id,
          month: date.getUTCMonth(),
          year: date.getUTCFullYear(),
        },
      },
      create: {
        userId: user.id,
        month: date.getUTCMonth(),
        year: date.getUTCFullYear(),
        chestnuts: type === "chestnuts" ? amount : 0,
        cherries: type === "cherries" ? amount : 0,
      },
      update: {
        chestnuts: {
          increment: type === "chestnuts" ? amount : 0,
        },
        cherries: {
          increment: type === "cherries" ? amount : 0,
        },
      },
    }),
  ]);
}
