import prisma from "@/lib/prisma";
import { OverviewQuerySchema } from "@/schema/overview";
import { ProductOverviewQuerySchema } from "@/schema/product-overview";
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

  const queryParams = ProductOverviewQuerySchema.safeParse({ from, to });

  if (!queryParams.success) {
    return new Response("Invalid query params", { status: 400 });
  }

  const productStats = await getTotalStats(
    user.id,
    queryParams.data.from,
    queryParams.data.to,
  );

  return Response.json(productStats);

}

export type getTotalStatsResponseType = Awaited<ReturnType<typeof getTotalStats>>;

async function getTotalStats(userId: string, from: Date, to: Date) {
  const totalsProduct = await prisma.productTransaction.groupBy({
    by: ["type"],
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
  });

  return {
    chestnuts: totalsProduct.find((t) => t.type === "chestnuts")?._sum.amount || 0,
    cherries: totalsProduct.find((t) => t.type === "cherries")?._sum.amount || 0,
  }
}