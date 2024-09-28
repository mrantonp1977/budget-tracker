import { Button } from '@/components/ui/button';
import prisma from '@/lib/prisma';
import { currentUser } from '@clerk/nextjs/server';
import { redirect } from 'next/navigation';
import React from 'react';
import CreateProductTransactionDialog from '../_components/CreateProductTransactionDialog';
import ProductOverview from '../_components/ProductOverview';
import ProductHistory from '../_components/ProductHistory';





async function page() {
  const user = await currentUser();
  if (!user) {
    redirect('/sign-in');
  }

  const userSettings = await prisma.userSettings.findUnique({
    where: {
      userId: user.id,
    },
  });

  if (!userSettings) {
    return redirect('/wizard');
  }

  return (
    <div className="h-full mt-8">
      <div className="bg-card">
        <div className="flex flex-wrap items-center justify-between px-16 py-8">
          <p className="text-3xl font-bold">
            Welcome, <span className="dark:text-amber-500 text-blue-800">{user.firstName} {user.lastName}</span> 👋
          </p>
          <div className="flex items-center gap-8">           
            <CreateProductTransactionDialog
              trigger={
                <Button
                  variant={'outline'}
                  className="border-amber-300 bg-amber-600 text-white hover:bg-amber-500 hover:text-white w-[190px]"
                >
                  New Chestnuts amount 🌰
                </Button>
              }
              type={'chestnuts'}
            />
            <CreateProductTransactionDialog
              trigger={
                <Button
                  variant={'outline'}
                  className="border-purple-500 bg-purple-900 text-white hover:bg-purple-700 hover:text-white w-[190px]"
                >
                  New Cherries amount 🍒
                </Button>
              }
              type={'cherries'}
            />
          </div>
        </div>
      </div>
      <ProductOverview userSettings={userSettings} />
      <ProductHistory userSettings={userSettings} />
    </div>
  );
}

export default page;
