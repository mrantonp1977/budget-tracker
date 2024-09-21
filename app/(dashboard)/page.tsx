import { Button } from '@/components/ui/button';
import prisma from '@/lib/prisma';
import { currentUser } from '@clerk/nextjs/server';
import { redirect } from 'next/navigation';
import React from 'react';
import CreateTransactionDialog from './_components/CreateTransactionDialog';
import Overview from './_components/Overview';
import History from './_components/History';
import { Separator } from '@/components/ui/separator';


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
        <div className="flex flex-col items-center justify-center mb-5">
          <p className="text-[34px] bg-gradient-to-r from-green-500 via-cyan-500 to-amber-500 bg-clip-text font-bold leading-tight tracking-tighter text-transparent">Simple and Easy Way to Organize Your Finances with My Finances App</p>
          <p className="text-xl font-semibold text-muted-foreground">My-Finances App is a user-friendly application designed to simplify personal finance management.</p>
        </div>
        <Separator className="border-2"/>
        <div className="flex flex-wrap items-center justify-between px-16 py-12">
          <p className="text-3xl font-bold">
            Welcome, <span className="dark:text-amber-500 text-blue-800">{user.firstName} {user.lastName}</span> 👋
          </p>
          <div className="flex items-center gap-6">
            <CreateTransactionDialog
              trigger={
                <Button
                  variant={'outline'}
                  className="border-emerald-500 bg-emerald-900 text-white hover:bg-emerald-700 hover:text-white"
                >
                  New income 😀
                </Button>
              }
              type={'income'}
            />
            <CreateTransactionDialog
              trigger={
                <Button
                  variant={'outline'}
                  className="border-rose-500 bg-rose-900 text-white hover:bg-rose-700 hover:text-white"
                >
                  New expense 😠
                </Button>
              }
              type={'expense'}
            />
          </div>
        </div>
      </div>
      <Overview userSettings={userSettings} />
      <History userSettings={userSettings} />
    </div>
  );
}

export default page;
