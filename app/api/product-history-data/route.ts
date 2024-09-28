import prisma from "@/lib/prisma";
import { Period, Timeframe } from "@/lib/types";
import { currentUser } from "@clerk/nextjs/server";
import { getDaysInMonth } from "date-fns";
import { redirect } from "next/navigation";
import { z } from "zod";

const getProductHistoryDataSchema = z.object({
  timeframe: z.enum(["month", "year"]),
  month: z.coerce.number().min(0).max(11).default(0),
  year: z.coerce.number().min(2000).max(2100)
});


export async function GET(request: Request) {
  const user = await currentUser();

  if (!user) {
    redirect("/sign-in");
  }

  const { searchParams } = new URL(request.url);
  const timeframe = searchParams.get("timeframe");
  const year = searchParams.get("year");
  const month = searchParams.get("month");

  const queryParams = getProductHistoryDataSchema.safeParse({
    timeframe,
    month,
    year,
  });
  if (!queryParams.success) {
    return new Response("Invalid query params", { status: 400 });
  }
  
  const data = await getProductHistoryData(user.id, queryParams.data.timeframe, {
    month: queryParams.data.month,
    year: queryParams.data.year,
  });
  
  return Response.json(data);

}

export type getProductHistoryDataResponseType = Awaited<ReturnType<typeof getProductHistoryData>>;

async function getProductHistoryData(userId: string, timeframe: Timeframe, period: Period) {
  switch (timeframe) {
    case "year":
      return await getProductYearHistoryData(userId, period.year)
    case "month":
      return await getProductMonthHistoryData(userId, period.year, period.month)
  }
}

type ProductHistoryData = {
  month: number;
  year: number;
  chestnuts: number;
  cherries: number;
  day?: number;
}

async function getProductYearHistoryData(userId: string, year: number) {
  const result = await prisma.productYearHistory.groupBy({
    by: ["month"],
    where: {
      userId,
      year,
    },
    _sum: {
      cherries: true,
      chestnuts: true,
    },
    orderBy: [
      {
        month: "asc",
      },
    ],
  });

  if (!result || result.length === 0) {
    return [];
  }

  const history:ProductHistoryData[] = [];

  for (let i = 0; i < 12; i++) {
    let cherries = 0;
    let chestnuts = 0;

    const month = result.find((r) => r.month === i);
    if (month) {
      cherries = month._sum.cherries || 0;
      chestnuts = month._sum.chestnuts || 0;
    }

    history.push({
      year,
      month: i,
      cherries,
      chestnuts,
    });
  }

  return history;
    
}

async function getProductMonthHistoryData(userId: string, year: number, month: number) {
  const result = await prisma.productMonthHistory.groupBy({
    by: ["day"],
    where: {
      userId,
      year,
      month
    },
    _sum: {
      cherries: true,
      chestnuts: true,
    },
    orderBy: [
      {
        day: "asc",
      },
    ],
  });

  if (!result || result.length === 0) {
    return [];
  }

  const history:ProductHistoryData[] = [];
  const daysInMonth = getDaysInMonth(new Date(year, month));

  for (let i = 1; i <= daysInMonth; i++) {
    let cherries = 0;
    let chestnuts = 0;

    const day = result.find((r) => r.day === i);
    if (day) {
      cherries = day._sum.cherries || 0;
      chestnuts = day._sum.chestnuts || 0;
    }

    history.push({
      year,
      month,
      day: i,
      cherries,
      chestnuts,
    });
  }

  return history;


};