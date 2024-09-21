'use client';

import { getBalanceStatsResponseType } from '@/app/api/stats/balance/route';
import SkeletonWrapper from '@/components/SkeletonWrapper';
import { Card } from '@/components/ui/card';
import { DateToUTCDate, GetFormatterForCurrency } from '@/lib/helpers';
import { UserSettings } from '@prisma/client';
import { useQuery } from '@tanstack/react-query';
import { TrendingDown, TrendingUp, Wallet } from 'lucide-react';
import React, { useCallback, useMemo } from 'react';
import CountUp from 'react-countup';

interface Props {
  userSettings: UserSettings;
  from: Date;
  to: Date;
}

function StatsCards({ userSettings, from, to }: Props) {
  const statsQuery = useQuery<getBalanceStatsResponseType>({
    queryKey: ['overview', 'stats', from, to],
    queryFn: () =>
      fetch(
        `/api/stats/balance?from=${DateToUTCDate(from)}&to=${DateToUTCDate(to)}`
      ).then((res) => res.json()),
  });

  const formatter = useMemo(() => {
    return GetFormatterForCurrency(userSettings.currency);
  }, [userSettings.currency]);

  const income = statsQuery.data?.income || 0;
  const expense = statsQuery.data?.expense || 0;

  const balance = income - expense;

  return (
    <div className="relative flex w-full flex-wrap gap-4 md:flex-nowrap items-center justify-center">
      <SkeletonWrapper isLoading={statsQuery.isFetching}>
        <StatsCard
          title="Incomes"
          value={income}
          formatter={formatter}
          icon={
            <TrendingUp className="h-12 w-12 items-center rounded-lg p-2 text-green-500 bg-green-400/10" />
          }
        />
      </SkeletonWrapper>
      <SkeletonWrapper isLoading={statsQuery.isFetching}>
        <StatsCard
          title="Expenses"
          value={expense}
          formatter={formatter}
          icon={
            <TrendingDown className="h-12 w-12 items-center rounded-lg p-2 text-rose-500 bg-rose-400/10" />
          }
        />
      </SkeletonWrapper>
      <SkeletonWrapper isLoading={statsQuery.isFetching}>
        <StatsCard
          title="Balance"
          value={balance}
          formatter={formatter}
          icon={
            <Wallet className="h-12 w-12 items-center rounded-lg p-2 text-blue-500 bg-blue-400/10" />
          }
        />
      </SkeletonWrapper>
    </div>
  );
}

export default StatsCards;

function StatsCard({
  title,
  value,
  formatter,
  icon,
}: {
  title: string;
  value: number;
  formatter: Intl.NumberFormat;
  icon: React.ReactNode;
}) {
  const formatFn = useCallback(
    (value: number) => {
      return formatter.format(value);
    },
    [formatter]
  );

  return (
    <Card className="flex h-24 w-full items-center gap-12 p-6">
      {icon}
      <div className="flex flex-col items-start gap-0">
        <p className="dark:text-amber-500 font-semibold text-xl">
          {title}
        </p>
        <CountUp 
        preserveValue
        redraw={false}
        end={value}
        decimals={2}
        formattingFn={formatFn}
        className="text-2xl font-bold"
        />
      </div>
    </Card>
  )
}
