'use client';

import { getTotalStatsResponseType } from '@/app/api/products-stats/total/route';
import SkeletonWrapper from '@/components/SkeletonWrapper';
import { Card } from '@/components/ui/card';
import { DateToUTCDate, GetFormatterForCurrency } from '@/lib/helpers';
import { UserSettings } from '@prisma/client';
import { useQuery } from '@tanstack/react-query';
import { CalculatorIcon, Cherry, TreeDeciduous } from 'lucide-react';
import React, { useCallback, useMemo } from 'react';
import CountUp from 'react-countup';

interface Props {
  userSettings: UserSettings;
  from: Date;
  to: Date;
}

function ProductStatsCards({ userSettings, from, to }: Props) {
  const productStatsQuery = useQuery<getTotalStatsResponseType>({
    queryKey: ['overview', 'productStats', from, to],
    queryFn: () =>
      fetch(
        `/api/products-stats/total?from=${DateToUTCDate(from)}&to=${DateToUTCDate(to)}`
      ).then((res) => res.json()),
  });

  // const formatter = useMemo(() => {
  //   return GetFormatterForCurrency(userSettings.currency);
  // }, [userSettings.currency]);

  const kiloFormatter = useMemo(() => {
    return new Intl.NumberFormat('en-US', {
      style: 'unit',
      unit: 'kilogram',
      // minimumFractionDigits: 2,
      // maximumFractionDigits: 2,
    });
  }, []);

  const chestnuts = productStatsQuery.data?.chestnuts || 0;
  const cherries = productStatsQuery.data?.cherries || 0;

  const total = chestnuts + cherries;

  return (
    <div className="relative flex w-full flex-wrap gap-4 md:flex-nowrap items-center justify-center">
      <SkeletonWrapper isLoading={productStatsQuery.isFetching}>
        <ProductStatsCard
          title="Chestnuts"
          value={chestnuts}
          formatter={kiloFormatter}
          icon={
            <TreeDeciduous className="h-12 w-12 items-center rounded-lg p-2 text-amber-500 bg-amber-400/10" />
          }
        />
      </SkeletonWrapper>
      <SkeletonWrapper isLoading={productStatsQuery.isFetching}>
        <ProductStatsCard
          title="Cherries"
          value={cherries}
          formatter={kiloFormatter}
          icon={
            <Cherry className="h-12 w-12 items-center rounded-lg p-2 text-purple-500 bg-purple-400/10" />
          }
        />
      </SkeletonWrapper>
      <SkeletonWrapper isLoading={productStatsQuery.isFetching}>
        <ProductStatsCard
          title="Total Kilos"
          value={total}
          formatter={kiloFormatter}
          icon={
            <CalculatorIcon className="h-12 w-12 items-center rounded-lg p-2 text-blue-500 bg-blue-400/10" />
          }
        />
      </SkeletonWrapper>
    </div>
  );
}

export default ProductStatsCards;

function ProductStatsCard({
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
