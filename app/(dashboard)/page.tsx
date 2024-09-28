import { Button } from '@/components/ui/button';
import prisma from '@/lib/prisma';
import { currentUser } from '@clerk/nextjs/server';
import { redirect } from 'next/navigation';
import React from 'react';
import { Mail, Phone } from 'lucide-react'; // Mail icon is imported here
import Link from 'next/link';
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
    <div className="h-full flex flex-col justify-between relative">
      <div className="top-4 px-8 mt-10 mb-16">
        <p className="text-3xl font-bold">
          Welcome,{' '}
          <span className="dark:text-amber-500 text-blue-800">
            {user.firstName} {user.lastName}
          </span>{' '}
          👋
        </p>
      </div>
      <Separator className="border-2 dark:border-slate-800"/>
      <div className="flex flex-col items-center justify-center text-center flex-grow mt-36">
        <p className="text-[44px] bg-gradient-to-r from-green-500 via-cyan-500 to-amber-500 bg-clip-text font-bold leading-tight tracking-tighter text-transparent max-w-3xl">
          Simple and Easy Way to Organize Your Finanses with Agro Finanses App
        </p>
        <p className="text-xl font-semibold text-muted-foreground mt-4 max-w-2xl">
          Agro Finanses is a comprehensive financial management application
          tailored for individuals and businesses in the agricultural sector.
          With its user-friendly interface and industry-specific features, Agro
          Finanses helps users make informed financial decisions, optimize
          resources, and achieve long-term financial stability.
        </p>
        <div className="flex justify-center gap-10 mt-10 mb-16">
          <Link href="/finansesTransactions">
            <Button variant={'home'} className="px-6 py-6 font-semibold text-md">
              Finanses Overview
            </Button>
          </Link>
          <Link href="/productsTransactions">
            <Button variant={'home'} className="px-6 py-6 font-semibold text-md">
              Products Overview
            </Button>
          </Link>
        </div>
        <div className="mt-36 flex gap-5 items-center">
          <Mail className="w-5 h-5 stroke-amber-500" />
          <p className="dark:text-cyan-200">
            papaioannoudev@gmail.com
          </p>
          <Phone className="w-5 h-5 stroke-amber-500" />
          <p className="dark:text-cyan-200">+30 6908450868</p>
        </div>
        <div className="mt-4 flex gap-4">
          <p className="text-muted-foreground opacity-65">
            copyright © 2024 Agro Finanses.
          </p>
          <p className="text-muted-foreground opacity-65">
            All rights reserved.
          </p>
        </div>
      </div>
    </div>
  );
}

export default page;
