'use client';

import { getProductHistoryPeriodsResponseType } from '@/app/api/product-history-periods/route';
import SkeletonWrapper from '@/components/SkeletonWrapper';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { Tabs, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Period, Timeframe } from '@/lib/types';
import { useQuery } from '@tanstack/react-query';
import React from 'react';

interface Props {
  period: Period;
  setPeriod: (period: Period) => void;
  timeFrame: Timeframe;
  setTimeFrame: (timeFrame: Timeframe) => void;
}

function ProductHistoryPeriodSelector({
  period,
  setPeriod,
  timeFrame,
  setTimeFrame,
}: Props) {
  const productHistoryPeriods = useQuery<getProductHistoryPeriodsResponseType>({
    queryKey: ['productOverview', 'productHistory', 'periods'],
    queryFn: () => fetch('/api/product-history-periods').then((res) => res.json()),
  });



  return (
    <div className="flex flex-wrap items-center gap-4">
      <SkeletonWrapper isLoading={productHistoryPeriods.isFetching} fullWidth={false}>
        <Tabs
          value={timeFrame}
          onValueChange={(value) => setTimeFrame(value as Timeframe)}
        >
          <TabsList>
            <TabsTrigger value="year">Year</TabsTrigger>
            <TabsTrigger value="month">Month</TabsTrigger>
          </TabsList>
        </Tabs>
      </SkeletonWrapper>
      <div className="flex flex-wrap items-center gap-2">
        <SkeletonWrapper isLoading={productHistoryPeriods.isFetching}>
          <ProductYearSelector
            period={period}
            setPeriod={setPeriod}
            years={productHistoryPeriods.data || []}
          />
        </SkeletonWrapper>
        {timeFrame === 'month' && (
          <SkeletonWrapper isLoading={productHistoryPeriods.isFetching} fullWidth={false}>
            <ProductMonthSelector 
              period={period} 
              setPeriod={setPeriod}
            />
          </SkeletonWrapper>
        )}
      </div>
    </div>
  );
}

export default ProductHistoryPeriodSelector;

function ProductYearSelector({
  period,
  setPeriod,
  years,
}: {
  period: Period;
  setPeriod: (period: Period) => void;
  years: getProductHistoryPeriodsResponseType;
}) {
  return (
    <Select
      value={period.year.toString()}
      onValueChange={(value) => {
        setPeriod({
          month: period.month,
          year: parseInt(value),
        });
      }}
    >
      <SelectTrigger className="w-[180px]">
        <SelectValue />
      </SelectTrigger>
      <SelectContent>
        {years.map((year) => (
          <SelectItem key={year} value={year.toString()}>
            {year}
          </SelectItem>
        ))}
      </SelectContent>
    </Select>
  );
}


function ProductMonthSelector({
  period,
  setPeriod,
}: {
  period: Period;
  setPeriod: (period: Period) => void;
}) {
  return (
    <Select
      value={period.month.toString()}
      onValueChange={(value) => {
        setPeriod({
          year: period.year,
          month: parseInt(value),
        });
      }}
    >
      <SelectTrigger className="w-[180px]">
        <SelectValue />
      </SelectTrigger>
      <SelectContent>
        {[0,1,2,3,4,5,6,7,8,9,10,11].map((month) => {
          const monthStr = new Date(period.year, month, 1).toLocaleString('en-US', { month: 'long' });
          return (
          <SelectItem key={month} value={month.toString()}>
            {monthStr}
          </SelectItem>
          )
        })}
      </SelectContent>
    </Select>
  );
}