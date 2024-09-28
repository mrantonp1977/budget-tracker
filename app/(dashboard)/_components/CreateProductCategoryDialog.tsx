'use client';

import { Button } from '@/components/ui/button';
import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog';
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
} from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from '@/components/ui/popover';
import { ProductType } from '@/lib/types';
import { cn } from '@/lib/utils';
import { zodResolver } from '@hookform/resolvers/zod';
import { CircleOff, PlusSquareIcon } from 'lucide-react';
import React, { useCallback } from 'react';
import { useForm } from 'react-hook-form';
import Picker from '@emoji-mart/react';
import data from '@emoji-mart/data';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { ProductCategory } from '@prisma/client';
import { toast } from 'sonner';
import { CreateProductCategorySchema, CreateProductCategorySchemaType } from '@/schema/productCategories';
import { CreateProductCategory } from '../_actions/productCategories';

interface Props {
  type: ProductType;
  successCallback: (productCategory: ProductCategory) => void;
  trigger?: React.ReactNode;
}

function CreateProductCategoryDialog({ type, successCallback, trigger }: Props) {
  const [open, setOpen] = React.useState(false);
  const form = useForm<CreateProductCategorySchemaType>({
    resolver: zodResolver(CreateProductCategorySchema),
    defaultValues: {
      type,
    },
  });

  const queryClient = useQueryClient();

  const { mutate, isPending } = useMutation({
    mutationFn: CreateProductCategory,
    onSuccess: async (data: ProductCategory) => {
      form.reset({
        name: '',
        icon: '',
        type,
      });

      toast.success('Category created successfully', {
        id: "product-create-category",
      });

      successCallback(data);

      await queryClient.invalidateQueries({
        queryKey: ['productCategories', { type }],
      });

      setOpen((prev) => !prev);
    },

    onError: (error) => {
      toast.error("Something went wrong", {
        id: "product-create-category",
      });
    },
  });

  const onSubmit = useCallback((values: CreateProductCategorySchemaType) => {
    toast.loading('Creating category...', {
      id: "product-create-category",
    });
    mutate(values);
  }, [mutate]);




  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        { trigger ? trigger : <Button
          variant={'ghost'}
          className="flex border-separate items-center justify-start rounded-none border-b px-3 py-3 text-muted-foreground"
        >
          <PlusSquareIcon className="w-4 h-4 mr-2" />
          Create new
        </Button>}
      </DialogTrigger>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>
            Create {' '}
            <span
              className={cn(
                'm-1',
                type === 'chestnuts' ? 'text-amber-500' : 'text-purple-500'
              )}
            >
              {type}
            </span> {' '}
            category
          </DialogTitle>
          <DialogDescription>
            Categories help you organize your transactions. You can create a
            category for each type of transaction.
          </DialogDescription>
        </DialogHeader>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
            <FormField
              control={form.control}
              name="name"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Name</FormLabel>
                  <FormControl>
                    <Input placeholder='Category' {...field} />
                  </FormControl>
                  <FormDescription>
                    The name of the category. This will be displayed in the
                    category picker.
                  </FormDescription>
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="icon"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Icon</FormLabel>
                  <FormControl>
                    <Popover>
                      <PopoverTrigger asChild>
                        <Button
                          variant={'outline'}
                          className="h-[100px] w-full"
                        >
                          {form.watch('icon') ? (
                            <div className="flex flex-col items-center gap-2">
                              <span className="text-5xl" role="img">
                                {field.value}
                              </span>
                              <p className="text-xs text-muted-foreground">
                                Click to change an icon
                              </p>
                            </div>
                          ) : (
                            <div className="flex flex-col items-center gap-2">
                              <CircleOff className="w-12 h-12" />
                              <p className="text-xs text-muted-foreground">
                                Click to select an icon
                              </p>
                            </div>
                          )}
                        </Button>
                      </PopoverTrigger>
                      <PopoverContent className="w-full">
                        <Picker
                          data={data}
                          title="Pick an icon"
                          onEmojiSelect={(emoji: { native: string }) => {
                            field.onChange(emoji.native);
                          }}
                        />
                      </PopoverContent>
                    </Popover>
                  </FormControl>
                  <FormDescription>
                    This is how the category will be displayed in the app
                  </FormDescription>
                </FormItem>
              )}
            />
          </form>
        </Form>
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
      </DialogContent>
    </Dialog>
  );
}

export default CreateProductCategoryDialog;
