'use client';

import { DateRangePicker } from '@/components/ui/date-range-picker';
import { MAX_DATE_RANGE_DAYS } from '@/lib/constants';
import { UserSettings } from '@prisma/client';
import { differenceInDays, startOfMonth } from 'date-fns';
import React, { useState } from 'react';
import { toast } from 'sonner';
import ProductStatsCards from './ProductStatsCards';
import ProductCategoriesStats from './ProductCategoriesStats';


function ProductOverview({ userSettings }: { userSettings: UserSettings }) {
  const [dateRange, setDateRange] = useState<{ from: Date; to: Date }>({
    from: startOfMonth(new Date()),
    to: new Date(),
  });
  return (
    <>
      <div className="flex flex-wrap items-end justify-between px-7 py-8">
        <h2 className="text-3xl font-bold dark:text-cyan-500">Products Overview</h2>
        <div className="flex items-center gap-3">
          <DateRangePicker
            initialDateFrom={dateRange.from}
            initialDateTo={dateRange.to}
            showCompare={false}
            onUpdate={(values) => {
              const { from, to } = values.range;
              if (!from || !to) return;
              if (differenceInDays(to, from) > MAX_DATE_RANGE_DAYS) {
                toast.error(
                  `Date range cannot exceed ${MAX_DATE_RANGE_DAYS} days`
                );
                return;
              }
              setDateRange({ from, to });
            }}
          />
        </div>
      </div>
      <div className="flex w-full flex-col px-8 py-4">
        <ProductStatsCards
          userSettings={userSettings}
          from={dateRange.from}
          to={dateRange.to}
        />
        <div className="pt-5">
        <ProductCategoriesStats 
          userSettings={userSettings}
          from={dateRange.from}
          to={dateRange.to}
        />
        </div>
      </div>
    </>
  );
}

export default ProductOverview;
