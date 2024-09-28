import prisma from "@/lib/prisma";
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

  const quertParams = ProductOverviewQuerySchema.safeParse({ from, to });

  if (!quertParams.success) {
    return new Response("Invalid query params", { status: 400 });
  }

  const productStats = await getProductCategoriesStats(
    user.id,
    quertParams.data.from,
    quertParams.data.to,
  );

  return Response.json(productStats);

}

export type getProductCategoriesStatsResponseType = Awaited<ReturnType<typeof getProductCategoriesStats>>;

async function getProductCategoriesStats(userId: string, from: Date, to: Date) {
  const productStats = await prisma.productTransaction.groupBy({
    by: ["type", "productCategory", "productCategoryIcon"],
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

  return productStats;
}