import prisma from "@/lib/prisma";
import { currentUser } from "@clerk/nextjs/server";
import { redirect } from "next/navigation";




export async function GET(request: Request) {
  const user = await currentUser();

  if (!user) {
    redirect("/sign-in");
  }

  const periods = await getProductHistoryPeriods(user.id);
  return Response.json(periods);

}

export type getProductHistoryPeriodsResponseType = Awaited<ReturnType<typeof getProductHistoryPeriods>>;

async function getProductHistoryPeriods(userId: string) {
  const results = await prisma.productMonthHistory.findMany({
    where: {
      userId,
    },
    select: {
      year: true,
    },
    distinct: ["year"],
    orderBy: [
      {
        year: "asc",   
      },
    ],
  });

  const years = results.map(el => el.year);

  if (years.length === 0) {
    return [new Date().getFullYear()];
  }

  return years;
}
