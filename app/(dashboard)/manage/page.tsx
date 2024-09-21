'use client';

import { CurrencyComboBox } from '@/components/CurrencyComboBox';
import SkeletonWrapper from '@/components/SkeletonWrapper';
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import { TransactionType } from '@/lib/types';
import { useQuery } from '@tanstack/react-query';
import { Plus, PlusSquare, Trash, TrendingDown, TrendingUp } from 'lucide-react';
import React from 'react';
import CreateCategoryDialog from '../_components/CreateCategoryDialog';
import { Button } from '@/components/ui/button';
import { Separator } from '@/components/ui/separator';
import { cn } from '@/lib/utils';
import { Category } from '@prisma/client';
import DeleteCategoryDialog from '../_components/DeleteCategoryDialog';

function page() {
  return (
    <>
      <div className="bg-card mt-8">
        <div className="flex flex-wrap items-center justify-between px-8 py-8">
          <div className="">
            <p className="text-3xl font-bold dark:text-cyan-500">Manage</p>
            <p className="text-muted-foreground">
              Manage your account settings and categories
            </p>
          </div>
        </div>
      </div>
      <div className="flex flex-col px-4 p-4">
        <Card>
          <CardHeader>
            <CardTitle className="dark:text-amber-500">Currency</CardTitle>
            <CardDescription>
              Set your default currency for your account
            </CardDescription>
          </CardHeader>
          <CardContent>
            <CurrencyComboBox />
          </CardContent>
        </Card>
        <CategoryList type="income" />
        <CategoryList type="expense" />
      </div>
    </>
  );
}

export default page;

function CategoryList({ type }: { type: TransactionType }) {
  const categoriesQuery = useQuery({
    queryKey: ['categories', type],
    queryFn: () =>
      fetch(`/api/categories?type=${type}`).then((res) => res.json()),
  });

  const dataAvailable = categoriesQuery.data && categoriesQuery.data.length > 0;

  return (
    <SkeletonWrapper isLoading={categoriesQuery.isLoading}>
      <Card className="mt-4">
        <CardHeader>
          <CardTitle className="flex items-center justify-between gap-2">
            <div className="flex items-center gap-2">
              {type === 'expense' ? (
                <TrendingDown className="h-12 w-12 items-center rounded-lg bg-rose-400/10 text-rose-500" />
              ) : (
                <TrendingUp className="h-12 w-12 items-center rounded-lg bg-green-400/10 text-green-500" />
              )}
              <div className="p-5 dark:text-amber-500">
                {type === 'income'
                  ? 'Incomes Categories'
                  : 'Expenses Categories'}
                <div className="text-sm text-muted-foreground py-2">
                  Sorted by name
                </div>
              </div>
            </div>
            <CreateCategoryDialog
              type={type}
              successCallback={() => categoriesQuery.refetch()}
              trigger={
                <Button className="gap-2 text-sm" variant={'secondary'}>
                  <Plus className="h-4 w-4" />
                  Create Category
                </Button>
              }
            />
          </CardTitle>
        </CardHeader>
        <Separator />
        {!dataAvailable && (
          <div className="flex h-40 w-full flex-col items-center justify-center">
            <p>
              No{' '}
              <span
                className={cn(
                  'm-1',
                  type === 'income' ? 'text-emerald-500' : 'text-rose-500'
                )}
              >
                {type}
              </span>{' '}
              categories yet
            </p>
            <p className="text-sm text-muted-foreground">
              Create a new category to get started
            </p>
          </div>
        )}
        {dataAvailable && (
          <div className="grid grid-flow-row gap-2 p-2 sm:grid-flow-row sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4">
            {categoriesQuery.data.map((category: Category) => (
              <CategoryCard key={category.name} category={category} />
            ))}
          </div>
        )}
      </Card>
    </SkeletonWrapper>
  );
}

function CategoryCard({ category }: { category: Category }) {
  return (
    <div className="flex border-separate flex-col justify-between rounded-md border shadow-md shadow-black/[0.1] dark:shadow-white/[0.1]">
      <div className="flex flex-col items-center gap-2 p-4">
        <span className="text-3xl" role="img">
          {category.icon}
        </span>
        <span className="">{category.name}</span>
      </div>
      <DeleteCategoryDialog
        category={category}
        trigger={
          <Button
            variant={'secondary'}
            className="flex w-full border-separate items-center gap-2 rounded-t-none text-muted-foreground hover:bg-red-500/40"
          >
            <Trash className="h-4 w-4" /> Remove
          </Button>
        }
      />
    </div>
  );
}
