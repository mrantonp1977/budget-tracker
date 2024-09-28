'use client';

import { ProductCategory } from '@prisma/client';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import React from 'react';
import { toast } from 'sonner';
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from '@/components/ui/alert-dialog';
import { ProductType } from '@/lib/types';
import { DeleteProductCategory } from '../_actions/productCategories';

interface Props {
  trigger: React.ReactNode;
  productCategory: ProductCategory;
}

function DeleteProductCategoryDialog({
  trigger,
  productCategory,
}: Props) {
  const categoryIdentifier = `${productCategory.name}-${productCategory.type}`;
  const queryClient = useQueryClient();
  const deleteMutation = useMutation({
    mutationFn: DeleteProductCategory,
    onSuccess: async () => {
      toast.success('Category deleted successfully', {
        id: categoryIdentifier,
      });

      await queryClient.invalidateQueries({
        queryKey: ['productCategories'],
      });
    },
    onError: (error) => {
      toast.error('Failed to delete category', {
        id: categoryIdentifier,
      });
    },
  });
  return (
    <div>
      <AlertDialog>
        <AlertDialogTrigger asChild>{trigger}</AlertDialogTrigger>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>
              Are you sure you want to delete this category?
            </AlertDialogTitle>
            <AlertDialogDescription>
              This action cannot be undone. This will also delete all
              transactions associated with this category.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction
              onClick={() => {
                toast.loading('Deleting category...', {
                  id: categoryIdentifier,
                });
                deleteMutation.mutate({ name: productCategory.name, type: productCategory.type as ProductType });
              }}
            >
              Continue
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
}

export default DeleteProductCategoryDialog;
