'use client';

import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog';
import { ProductType, TransactionType } from '@/lib/types';
import { cn } from '@/lib/utils';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import React, { useCallback } from 'react';
import { format } from 'date-fns';
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from '@/components/ui/popover';
import { Button } from '@/components/ui/button';
import { CalendarIcon } from 'lucide-react';
import { Calendar } from '@/components/ui/calendar';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { toast } from 'sonner';
import { DateToUTCDate } from '@/lib/helpers';
import { CreateProductTransactionSchema, CreateProductTransactionSchemaType } from '@/schema/productTransaction';
import ProductCategoryPicker from './ProductCategoryPicker';
import { CreateProductTransaction } from '../_actions/productTransactions';


interface Props {
  trigger: React.ReactNode;
  type: ProductType;
}

function CreateProductTransactionDialog({ trigger, type }: Props) {
  const form = useForm<CreateProductTransactionSchemaType>({
    resolver: zodResolver(CreateProductTransactionSchema),
    defaultValues: {
      type,
      date: new Date(),
    },
  });

  const [open, setOpen] = React.useState(false);
  
  const handleProductCategoryChange = useCallback(
    (value: string) => {
      form.setValue('productCategory', value);
    },
    [form]
  );

  const queryClient = useQueryClient();

  const { mutate, isPending } = useMutation({
    mutationFn: CreateProductTransaction,
    onSuccess: () => {
      toast.success('Product Transaction created successfully', {
        id: 'product-create-transaction',
      });

      form.reset({
        type,
        description: '',
        amount: 0,
        date: new Date(),
        productCategory: undefined,
      });

      queryClient.invalidateQueries({
        queryKey: ['overview'],
      });

      setOpen((prev) => !prev);
    },
  });

  const onSubmit = useCallback(
    async (values: CreateProductTransactionSchemaType) => {
      toast.loading('Creating product transaction...', {
        id: 'product-create-transaction',
      });
      mutate({
        ...values,
        date: DateToUTCDate(values.date),
      });
    },
    [mutate]
  );

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>{trigger}</DialogTrigger>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>
            Create a new{' '}
            <span
              className={cn(
                'm-1',
                type === 'chestnuts' ? 'text-amber-500' : 'text-purple-500'
              )}
            >
              {type}
            </span>{' '}
            transaction
          </DialogTitle>
        </DialogHeader>
        <Form {...form}>
          <form className="space-y-4" onSubmit={form.handleSubmit(onSubmit)}>
            <FormField
              control={form.control}
              name="description"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Description</FormLabel>
                  <FormControl>
                    <Input defaultValue={''} {...field} />
                  </FormControl>
                  <FormDescription>
                    Transaction description (optional)
                  </FormDescription>
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="amount"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Amount</FormLabel>
                  <FormControl>
                    <Input defaultValue={0} type="number" {...field} />
                  </FormControl>
                  <FormDescription>
                    Transaction amount (required)
                  </FormDescription>
                </FormItem>
              )}
            />
            <div className="flex items-center justify-between gap-2">
              <FormField
                control={form.control}
                name="productCategory"
                render={({ field }) => (
                  <FormItem className="flex flex-col">
                    <FormLabel>Category</FormLabel>
                    <FormControl>
                      <ProductCategoryPicker
                        type={type}
                        onChange={handleProductCategoryChange}
                      />
                    </FormControl>
                    <FormDescription>
                      Select a category for this transaction
                    </FormDescription>
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="date"
                render={({ field }) => (
                  <FormItem className="flex flex-col">
                    <FormLabel>Transaction Date</FormLabel>
                    <Popover>
                      <PopoverTrigger asChild>
                        <FormControl>
                          <Button
                            variant={'outline'}
                            className={cn(
                              'w-[200px] pl-3 text-left font-normal',
                              !field.value && 'text-muted-foreground'
                            )}
                          >
                            {field.value
                              ? format(field.value, 'PPP')
                              : 'Select a date'}
                            <CalendarIcon className="w-4 h-4 ml-auto opacity-50" />
                          </Button>
                        </FormControl>
                      </PopoverTrigger>
                      <PopoverContent className="w-auto p-0">
                        <Calendar
                          mode="single"
                          selected={field.value}
                          onSelect={value => {
                            if (!value) return;
                            field.onChange(value);
                          }}
                          initialFocus
                        />
                      </PopoverContent>
                    </Popover>
                    <FormDescription>
                      Select a date for this transaction
                    </FormDescription>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>
          </form>
          <DialogFooter>
            <DialogClose asChild>
              <>
                <Button
                  type="button"
                  variant={'secondary'}
                  onClick={() => setOpen((prev) => !prev)}
                  className="mr-4"
                >
                  Cancel
                </Button>
                <Button
                  type="button"
                  onClick={form.handleSubmit(onSubmit)}
                  disabled={isPending}
                >
                  {isPending ? 'Creating...' : 'Create'}
                </Button>
              </>
            </DialogClose>
          </DialogFooter>
        </Form>
      </DialogContent>
    </Dialog>
  );
}

export default CreateProductTransactionDialog;
