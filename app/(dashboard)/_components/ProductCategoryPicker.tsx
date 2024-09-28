'use client';

import { Button } from '@/components/ui/button';
import {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
} from '@/components/ui/command';
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from '@/components/ui/popover';
import { ProductType } from '@/lib/types';
import { cn } from '@/lib/utils';
import { ProductCategory } from '@prisma/client';
import { useQuery } from '@tanstack/react-query';
import React, { useCallback, useEffect } from 'react';
import { Check, ChevronsUpDownIcon } from 'lucide-react';
import CreateProductCategoryDialog from './CreateProductCategoryDialog';


interface Props {
  type: ProductType;
  onChange: (value: string) => void;
}

function ProductCategoryPicker({ type, onChange }: Props) {
  const [open, setOpen] = React.useState(false);
  const [value, setValue] = React.useState('');


  useEffect(() => {
    if (!value) return;
    onChange(value);
  }, [onChange, value]);


  const productCategoriesQuery = useQuery({
    queryKey: ['productCategories', { type }],
    queryFn: () =>
      fetch(`/api/productCategories?type=${type}`).then((res) => res.json()),
  });

  const productSelectedCategory = productCategoriesQuery.data?.find(
    (productCategory: ProductCategory) => productCategory.name === value
  );

  const successCallback = useCallback((productCategory: ProductCategory) => {
    setValue(productCategory.name);
    setOpen((prev) => !prev);
  }, [setValue, setOpen]);

  return (
    <Popover open={open} onOpenChange={setOpen}>
      <PopoverTrigger asChild>
        <Button
          variant={'outline'}
          role="combobox"
          aria-expanded={open}
          className="w-[200px] justify-between"
        >
          {productSelectedCategory ? (
            <ProductCategoryRow productCategory={productSelectedCategory} />
          ) : (
            'Select a category'
          )}
          <ChevronsUpDownIcon className="ml-2 h-4 w-4 shrink-0 opacity-50"/>
        </Button>
      </PopoverTrigger>
      <PopoverContent className="w-[200px] p-0">
        <Command
          onSubmit={(e) => {
            e.preventDefault();
          }}
        >
          <CommandInput placeholder="Search category..." />
          <CreateProductCategoryDialog type={type} successCallback={successCallback}/>
          <CommandEmpty>
            <p className="text-xs text-muted-foreground">
              No categories found. Create a new one.
            </p>
          </CommandEmpty>
          <CommandGroup>
            <CommandList>
              {productCategoriesQuery.data &&
                productCategoriesQuery.data.map((productCategory: ProductCategory) => (
                  <CommandItem
                    key={productCategory.name}
                    onSelect={() => {
                      setValue(productCategory.name);
                      setOpen((prev) => !prev);
                    }}
                  >
                    <ProductCategoryRow productCategory={productCategory} />
                    <Check
                      className={cn(
                        'ml-2 w-4 h-4 opacity-0',
                        value === productCategory.name && 'opacity-100'
                      )}
                    />
                  </CommandItem>
                ))}
            </CommandList>
          </CommandGroup>
        </Command>
      </PopoverContent>
    </Popover>
  );
}

export default ProductCategoryPicker;

function ProductCategoryRow({ productCategory }: { productCategory: ProductCategory }) {
  return (
    <div className="flex items-center gap-2">
      <span role="img">{productCategory.icon}</span>
      <span>{productCategory.name}</span>
    </div>
  );
}
