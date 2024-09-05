import React from 'react';

import { zodResolver } from '@hookform/resolvers/zod';
import { useForm } from 'react-hook-form';
import { z } from 'zod';

import { Button } from '@/components/ui/button';
import { Form, FormControl, FormDescription, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { useGeneratorStore } from '@/stores/generatorStore';
import { useGenerateKeys } from '@/hooks/useGenerateKeys';
import LoadingSpinnerModal from '../LoadingSpinnerModal';
import useGlobalStore from '@/stores/globalStore';

const formSchema = z.object({
  validators: z
    .string()
    .refine((val) => !Number.isNaN(parseInt(val, 10)), {
      message: 'Expected number, received a string'
    })
    .refine((val) => parseInt(val, 10) > 0, {
      message: 'Must be greater than 0'
    }),
  ownerAddress: z
    .string()
    .min(42, {
      message: 'Not a valid address'
    })
    .max(42, {
      message: 'Not a valid address'
    })
    .regex(/^0x[a-fA-F0-9]{40}$/, {
      message: 'Not a valid address'
    }),
  withdrawalAddress: z
    .string()
    .min(42, {
      message: 'Not a valid address'
    })
    .max(42, {
      message: 'Not a valid address'
    })
    .regex(/^0x[a-fA-F0-9]{40}$/, {
      message: 'Not a valid address'
    }),
  // expiry time for the generated files in minutes
  expiryTime: z
    .string()
    .refine((val) => !Number.isNaN(parseInt(val, 10)), {
      message: 'Expected number, received a string'
    })
    .refine((val) => parseInt(val, 10) > 0, {
      message: 'Must be greater than 0'
    })
});

export function GenerateKeysForm() {
  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      validators: '1',
      ownerAddress: '',
      withdrawalAddress: '',
      expiryTime: '10'
    }
  });
  const setFormData = useGeneratorStore((state) => state.setFormData);
  const setError = useGlobalStore((state) => state.setError);
  const { generateKeys, isLoading } = useGenerateKeys();

  const onSubmit = (data: z.infer<typeof formSchema>) => {
    setFormData({
      validators: Number(data.validators),
      ownerAddress: data.ownerAddress,
      withdrawalAddress: data.withdrawalAddress
    });
    generateKeys({
      validators: Number(data.validators),
      ownerAddress: data.ownerAddress,
      withdrawalAddress: data.withdrawalAddress,
      expiryTime: Number(data.expiryTime)
    });
  };
  if (isLoading) {
    return <LoadingSpinnerModal message="Running Ceremony ......" />;
  }

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8 w-3/5">
        <FormField
          control={form.control}
          name="validators"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Validators</FormLabel>
              <FormControl>
                <Input type="number" placeholder="Enter number of validators" {...field} />
              </FormControl>
              <FormDescription>This is the number of validators to generate keys for.</FormDescription>
              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name="ownerAddress"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Your Address</FormLabel>
              <FormControl>
                <Input placeholder="0x..." {...field} />
              </FormControl>
              <FormDescription>Address that owns the cluster (probably you).</FormDescription>
              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name="withdrawalAddress"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Withdrawal Address</FormLabel>
              <FormControl>
                <Input placeholder="0x..." {...field} />
              </FormControl>
              <FormDescription>This is the address where funds will be withdrawn.</FormDescription>
              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name="expiryTime"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Expiry Time</FormLabel>
              <FormControl>
                <Input type="number" placeholder="1" {...field} />
              </FormControl>
              <FormDescription>This is the time in minutes before the generated files expire.</FormDescription>
              <FormMessage />
            </FormItem>
          )}
        />

        <div className="flex justify-center">
          <Button type="submit" className="w-full font-bold text-lg">
            Run a Ceremony
          </Button>
        </div>
      </form>
    </Form>
  );
}
