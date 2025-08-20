'use client';

import * as React from 'react';
import type { FC } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import type { Partner } from '@/lib/types';
import { Button } from '@/components/ui/button';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter, DialogDescription } from '@/components/ui/dialog';
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Textarea } from '@/components/ui/textarea';

const partnerSchema = z.object({
  name: z.string().min(2, { message: 'Partner name must be at least 2 characters.' }),
  website: z.string().url({ message: 'Please enter a valid URL.' }),
  category: z.enum(['Technology', 'Reseller', 'Service', 'Consulting', 'Subcontractor', 'Supplier', 'Equipment']),
  status: z.enum(['Active', 'Inactive', 'Pending']),
  overview: z.string().min(10, { message: 'Overview must be at least 10 characters.' }),
  joinDate: z.string().optional(),
});

type PartnerFormValues = z.infer<typeof partnerSchema>;

interface PartnerFormProps {
  isOpen: boolean;
  onOpenChange: (isOpen: boolean) => void;
  onSave: (partner: Partner) => void;
  partner: Partner | null;
}

export const PartnerForm: FC<PartnerFormProps> = ({ isOpen, onOpenChange, onSave, partner }) => {
  const form = useForm<PartnerFormValues>({
    resolver: zodResolver(partnerSchema),
    defaultValues: {
      name: '',
      website: '',
      category: 'Subcontractor',
      status: 'Pending',
      overview: '',
    },
  });

  React.useEffect(() => {
    if (partner) {
      form.reset(partner);
    } else {
      form.reset({
        name: '',
        website: 'https://',
        category: 'Subcontractor',
        status: 'Pending',
        overview: '',
      });
    }
  }, [partner, isOpen, form]);

  const onSubmit = (data: PartnerFormValues) => {
    const partnerData: Partner = {
      ...(partner || { id: '', logoUrl: 'https://placehold.co/100x100.png', contacts: [], transactions: [], performanceReviews: [], complianceDocuments: [], contracts: [] }),
      ...data,
      joinDate: partner?.joinDate || new Date().toISOString().split('T')[0],
    };
    onSave(partnerData);
  };

  return (
    <Dialog open={isOpen} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[625px]">
        <DialogHeader>
          <DialogTitle>{partner ? 'Edit Partner' : 'Add New Partner'}</DialogTitle>
          <DialogDescription>
            {partner ? 'Update the details for this partner.' : 'Enter the details for the new partner.'}
          </DialogDescription>
        </DialogHeader>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <FormField
                control={form.control}
                name="name"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Partner Name</FormLabel>
                    <FormControl><Input placeholder="Innovate Inc." {...field} /></FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="website"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Website</FormLabel>
                    <FormControl><Input placeholder="https://innovate.com" {...field} /></FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
               <FormField
                control={form.control}
                name="category"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Category</FormLabel>
                    <Select onValueChange={field.onChange} defaultValue={field.value}>
                      <FormControl><SelectTrigger><SelectValue placeholder="Select a category" /></SelectTrigger></FormControl>
                      <SelectContent>
                        <SelectItem value="Subcontractor">Subcontractor</SelectItem>
                        <SelectItem value="Supplier">Supplier</SelectItem>
                        <SelectItem value="Equipment">Equipment</SelectItem>
                        <SelectItem value="Consulting">Consulting</SelectItem>
                        <SelectItem value="Service">Service</SelectItem>
                        <SelectItem value="Technology">Technology</SelectItem>
                        <SelectItem value="Reseller">Reseller</SelectItem>
                      </SelectContent>
                    </Select>
                    <FormMessage />
                  </FormItem>
                )}
              />
               <FormField
                control={form.control}
                name="status"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Status</FormLabel>
                    <Select onValueChange={field.onChange} defaultValue={field.value}>
                      <FormControl><SelectTrigger><SelectValue placeholder="Select a status" /></SelectTrigger></FormControl>
                      <SelectContent>
                        <SelectItem value="Active">Active</SelectItem>
                        <SelectItem value="Inactive">Inactive</SelectItem>
                        <SelectItem value="Pending">Pending</SelectItem>
                      </SelectContent>
                    </Select>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>
            <FormField
              control={form.control}
              name="overview"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Overview</FormLabel>
                  <FormControl><Textarea placeholder="Describe the partner's business and relationship..." className="resize-none" {...field} /></FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <DialogFooter>
              <Button type="button" variant="outline" onClick={() => onOpenChange(false)}>Cancel</Button>
              <Button type="submit">Save Partner</Button>
            </DialogFooter>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
};
