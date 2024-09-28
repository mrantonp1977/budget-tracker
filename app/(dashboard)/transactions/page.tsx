'use client';

import { DateRangePicker } from '@/components/ui/date-range-picker';
import { MAX_DATE_RANGE_DAYS } from '@/lib/constants';
import { differenceInDays, startOfMonth } from 'date-fns';
import React, { useState } from 'react';
import { toast } from 'sonner';
import TransactionTable from './_components/TransactionTable';
import ProductsTransactionTable from './_components/ProductsTransactionTable';

function TransactionsPage() {
  const [dateRange, setDateRange] = useState<{ from: Date; to: Date }>({
    from: startOfMonth(new Date()),
    to: new Date(),
  });
  return (
    <>
      <div className="bg-card mt-8">
        <div className="flex flex-wrap items-center justify-between px-8 py-8">
          <div className="">
            <p className="text-3xl font-bold dark:text-cyan-500">
              Finanses & Products Transactions History
            </p>
            <p className="text-muted-foreground text-lg">
              Here, you can view all financial transactions and the products you
              have added. Additionally, filters are available to help refine
              your search.
            </p>
          </div>
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
      <div className="flex flex-wrap items-center justify-between px-8 py-8">
        <h1 className="text-3xl font-bold dark:text-blue-300 mb-4">
          Products History
        </h1>
        <ProductsTransactionTable from={dateRange.from} to={dateRange.to} />
        <h1 className="text-3xl font-bold dark:text-blue-300 mb-4">
          Finanses History
        </h1>
        <TransactionTable from={dateRange.from} to={dateRange.to} />
      </div>
    </>
  );
}

export default TransactionsPage;
