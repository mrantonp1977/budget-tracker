'use client';

import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle } from '@/components/ui/alert-dialog';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import React from 'react';
import { toast } from 'sonner';
import { DeleteTransaction } from '../_actions/deleteTransaction';
import { DeleteProductTransaction } from '../_actions/deleteProductTransaction';

interface Props {
  open: boolean;
  setOpen: (open: boolean) => void;
  transactionId: string;
}

function DeleteProductTransactionDialog({
  open,
  setOpen,
  transactionId,
}: Props) {
  const queryClient = useQueryClient();
  const deleteMutation = useMutation({
    mutationFn: DeleteProductTransaction,
    onSuccess: async () => {
      toast.success('Transaction deleted successfully', {
        id: transactionId,
      });

      await queryClient.invalidateQueries({
        queryKey: ['transactions'],
      });
    },
    onError: () => {
      toast.error('Failed to delete transaction', {
        id: transactionId,
      });
    },
  });
  return (
    <div>
      <AlertDialog open={open} onOpenChange={setOpen}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>
              Are you sure you want to delete this transaction?
            </AlertDialogTitle>
            <AlertDialogDescription>
              This action cannot be undone.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter className="gap-4">
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction
              onClick={() => {
                toast.loading('Deleting transaction...', {
                  id: transactionId,
                });
                deleteMutation.mutate(transactionId);
              }}
            >
              Delete
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
}

export default DeleteProductTransactionDialog;
