'use client';

import { Badge } from '@/components/ui/badge';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { GetFormatterForCurrency } from '@/lib/helpers';
import { Period, Timeframe } from '@/lib/types';
import { UserSettings } from '@prisma/client';
import {
  Bar,
  BarChart,
  CartesianGrid,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from 'recharts';
import React, { useCallback, useMemo, useState } from 'react';
import { useQuery } from '@tanstack/react-query';
import SkeletonWrapper from '@/components/SkeletonWrapper';
import { cn } from '@/lib/utils';
import CountUp from 'react-countup';
import ProductHistoryPeriodSelector from './ProductHistoryPeriodSelector';

function ProductHistory({ userSettings }: { userSettings: UserSettings }) {
  const [timeFrame, setTimeFrame] = useState<Timeframe>('month');
  const [period, setPeriod] = useState<Period>({
    year: new Date().getFullYear(),
    month: new Date().getMonth(),
  });

  const formatter = useMemo(() => {
    return GetFormatterForCurrency(userSettings.currency);
  }, [userSettings.currency]);

  const kiloFormatter = useMemo(() => {
    return new Intl.NumberFormat('en-US', {
      style: 'unit',
      unit: 'kilogram',
    });
  }, []);

  const productHistoryDataQuery = useQuery({
    queryKey: ['productOverview', 'productHistory', timeFrame, period],
    queryFn: () =>
      fetch(
        `/api/product-history-data?timeframe=${timeFrame}&month=${period.month}&year=${period.year}`
      ).then((res) => res.json()),
  });

  const dataAvailable =
    productHistoryDataQuery.data && productHistoryDataQuery.data.length > 0;

  return (
    <div className="flex flex-wrap items-end justify-between px-7 py-8">
      <h2 className="mt-8 mb-8 text-3xl font-bold dark:text-cyan-500">
        Products History
      </h2>
      <Card className="col-span-12 mt-2 w-full">
        <CardHeader className="gap-2">
          <CardTitle className="grid grid-flow-row justify-between gap-2 md:grid-flow-col">
            <ProductHistoryPeriodSelector
              period={period}
              setPeriod={setPeriod}
              timeFrame={timeFrame}
              setTimeFrame={setTimeFrame}
            />
            <div className="flex h-10 gap-2">
              <Badge
                variant={'outline'}
                className="flex items-center gap-2 text-md"
              >
                <div className="h-4 w-4 rounded-full bg-orange-500"></div>
                Chestnuts
              </Badge>
              <Badge
                variant={'outline'}
                className="flex items-center gap-2 text-md"
              >
                <div className="h-4 w-4 rounded-full bg-purple-500"></div>
                Cherries
              </Badge>
              <Badge
                variant={'outline'}
                className="flex items-center gap-2 text-md"
              >
                <div className="h-4 w-4 rounded-full bg-blue-500"></div>
                Total Kilos
              </Badge>
            </div>
          </CardTitle>
        </CardHeader>
        <CardContent>
          <SkeletonWrapper isLoading={productHistoryDataQuery.isFetching}>
            {dataAvailable && (
              <ResponsiveContainer width={'100%'} height={300}>
                <BarChart
                  height={300}
                  data={productHistoryDataQuery.data}
                  barCategoryGap={5}
                >
                  <defs>
                    <linearGradient
                      id="chestnutsBar"
                      x1="0"
                      y1="0"
                      x2="0"
                      y2="1"
                    >
                      <stop
                        offset={'0'}
                        stopColor="#f97316"
                        stopOpacity={'1'}
                      />
                      <stop
                        offset={'1'}
                        stopColor="#f97316"
                        stopOpacity={'0'}
                      />
                    </linearGradient>
                    <linearGradient
                      id="cherriesBar"
                      x1="0"
                      y1="0"
                      x2="0"
                      y2="1"
                    >
                      <stop
                        offset={'0'}
                        stopColor="#a855f7"
                        stopOpacity={'1'}
                      />
                      <stop
                        offset={'1'}
                        stopColor="#a855f7"
                        stopOpacity={'0'}
                      />
                    </linearGradient>
                  </defs>

                  <CartesianGrid
                    strokeDasharray="5 5"
                    strokeOpacity={'0.2'}
                    vertical={false}
                  />
                  <XAxis
                    stroke="#888888"
                    fontSize={12}
                    tickLine={false}
                    axisLine={false}
                    padding={{ left: 5, right: 5 }}
                    dataKey={(data) => {
                      const { year, month, day } = data;
                      const date = new Date(year, month, day || 1);
                      if (timeFrame === 'year') {
                        return date.toLocaleString('en', { month: 'long' });
                      }
                      return date.toLocaleString('en', { day: '2-digit' });
                    }}
                  />
                  <YAxis
                    stroke="#888888"
                    fontSize={12}
                    tickLine={false}
                    axisLine={false}
                  />
                  <Bar
                    dataKey={'chestnuts'}
                    label="Chestnuts"
                    fill="url(#chestnutsBar)"
                    radius={4}
                    className="cursor-pointer"
                  />
                  <Bar
                    dataKey={'cherries'}
                    label="Cherries"
                    fill="url(#cherriesBar)"
                    radius={4}
                    className="cursor-pointer"
                  />
                  <Tooltip
                    cursor={{ opacity: '0.1' }}
                    content={(props) => (
                      <CustomTooltip formatter={kiloFormatter} {...props} />
                    )}
                  />
                </BarChart>
              </ResponsiveContainer>
            )}
            {!dataAvailable && (
              <Card className="flex h-[300px] flex-col items-center justify-center bg-background">
                No data available for the selected period
                <p className="text-md text-muted-foreground">
                  Try selecting a different period or add some transactions
                </p>
              </Card>
            )}
          </SkeletonWrapper>
        </CardContent>
      </Card>
    </div>
  );
}

export default ProductHistory;

function CustomTooltip({ active, payload, kiloFormatter }: any) {
  if (!active || !payload || payload.length === 0) return null;

  const data = payload[0].payload;
  const { chestnuts, cherries } = data;

  return (
    <div className="min-w-[300px] rounded border bg-background p-4">
      <TooltipRow
        formatter={kiloFormatter}
        label="Cherries"
        value={cherries}
        bgColor="bg-purple-500"
        textColor="text-purple-500"
      />
      <TooltipRow
        formatter={kiloFormatter}
        label="Chestnuts"
        value={chestnuts}
        bgColor="bg-orange-500"
        textColor="text-orange-500"
      />
      <TooltipRow
        formatter={kiloFormatter}
        label="Total Kilos"
        value={chestnuts + cherries}
        bgColor="bg-blue-500"
        textColor="text-forground"
      />
    </div>
  );
}

function TooltipRow({
  label,
  value,
  bgColor,
  textColor,
  formatter,
}: {
  label: string;
  value: number;
  bgColor: string;
  textColor: string;
  formatter: Intl.NumberFormat;
}) {
  // const formattingFn = useCallback((value: number) => {return formatter.format(value)}, [formatter]);
  return (
    <div className="flex items-center gap-2">
      <div className={cn('h-4 w-4 rounded-full', bgColor)} />
      <div className="flex w-full justify-between">
        <p className="text-sm text-muted-foreground">{label}</p>
        <div className={cn('text-sm font-bold', textColor)}>
          <CountUp
            duration={0.5}
            preserveValue
            end={value}
            decimal="0"
            // formattingFn={formattingFn}
            className="text-sm"
          />
        </div>
      </div>
    </div>
  );
}
