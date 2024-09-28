"use server";

import prisma from "@/lib/prisma";
import { currentUser } from "@clerk/nextjs/server";
import { redirect } from "next/navigation";

export async function DeleteProductTransaction(id: string) {
  const user = await currentUser();

  if (!user) {
    redirect("/sign-in");
  }

  const transaction = await prisma.productTransaction.findUnique({
    where: {
      userId: user.id,
      id,
    },
  });

  if (!transaction) {
    throw new Error("Transaction not found");
  }

  await prisma.$transaction([
    prisma.productTransaction.delete({
      where: {
        id,
        userId: user.id,
      },
    }),
    prisma.productMonthHistory.update({
      where: {
        userId_day_month_year: {
          userId: user.id,
          day: transaction.date.getUTCDate(),
          month: transaction.date.getUTCMonth(),
          year: transaction.date.getUTCFullYear(),
        },
      },
      data: {
        ...(transaction.type === "cherries" && {
          cherries: {
            decrement: transaction.amount,
          }
        }),
        ...(transaction.type === "chestnuts" && {
          chestnuts: {
            decrement: transaction.amount,
          }
        })
      },
    }),
    prisma.productYearHistory.update({
      where: {
        userId_year_month: {
          userId: user.id,
          month: transaction.date.getUTCMonth(),
          year: transaction.date.getUTCFullYear(),
        },
      },
      data: {
        ...(transaction.type === "cherries" && {
          cherries: {
            decrement: transaction.amount,
          }
        }),
        ...(transaction.type === "chestnuts" && {
          chestnuts: {
            decrement: transaction.amount,
          }
        })
      },
    }),
  ])
    
} 