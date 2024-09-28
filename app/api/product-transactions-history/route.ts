import { GetFormatterForCurrency } from "@/lib/helpers";
import prisma from "@/lib/prisma";
import { Period, Timeframe } from "@/lib/types";
import { OverviewQuerySchema } from "@/schema/overview";
import { ProductOverviewQuerySchema } from "@/schema/product-overview";
import { currentUser } from "@clerk/nextjs/server";
import { getDaysInMonth } from "date-fns";
import { redirect } from "next/navigation";
import { z } from "zod";



export async function GET(request: Request) {
  const user = await currentUser();

  if (!user) {
    redirect("/sign-in");
  }

  const { searchParams } = new URL(request.url);
  const from = searchParams.get("from");
  const to = searchParams.get("to");

  const queryParams = ProductOverviewQuerySchema.safeParse({
    from,
    to
  });

  if (!queryParams.success) {
    return new Response("Invalid query params", { status: 400 });
  }
  
  const transactions = await getProductTransactionsHistory(
    user.id,
    queryParams.data.from,
    queryParams.data.to
  )

  return Response.json(transactions);
  
};

export type getProductTransactionsHistoryResponseType = Awaited<ReturnType<typeof getProductTransactionsHistory>>;


async function getProductTransactionsHistory(userId: string, from: Date, to: Date) {
  const userSettings = await prisma.userSettings.findUnique({
    where: {
      userId
    }
  });
  if (!userSettings) {
    throw new Error("User settings not found");
  }

  const formatter = new Intl.NumberFormat('en-US', {
      style: 'unit',
      unit: 'kilogram',
      // minimumFractionDigits: 2,
      // maximumFractionDigits: 2,
    });

  const transactions = await prisma.productTransaction.findMany({
    where: {
      userId,
      date: {
        gte: from,
        lte: to
      }
    },
    orderBy: {
      date: "desc"
    }
  });

  return transactions.map((transaction) => ({
    ...transaction,
    formattedAmount: formatter.format(transaction.amount)
  }));
}