import prisma from "@/lib/prisma";
import { OverviewQuerySchema } from "@/schema/overview";
import { currentUser } from "@clerk/nextjs/server";
import { redirect } from "next/navigation";




export async function GET(request: Request) {
  const user = await currentUser();

  if (!user) {
    redirect("/sign-in");
  }

  const { searchParams} = new URL(request.url);
  const from = searchParams.get("from");
  const to = searchParams.get("to");

  const quertParams = OverviewQuerySchema.safeParse({ from, to });

  if (!quertParams.success) {
    return new Response("Invalid query params", { status: 400 });
  }

  const stats = await getCategoriesStats(
    user.id,
    quertParams.data.from,
    quertParams.data.to,
  );

  return Response.json(stats);

}

export type getCategoriesStatsResponseType = Awaited<ReturnType<typeof getCategoriesStats>>;

async function getCategoriesStats(userId: string, from: Date, to: Date) {
  const stats = await prisma.transaction.groupBy({
    by: ["type", "category", "categoryIcon"],
    where: {
      userId,
      date: {
        gte: from,
        lte: to,
      },
      },
      _sum: {
        amount: true,
      },
      orderBy: {
        _sum: {
          amount: "desc",
        }
      }
  });

  return stats;
}