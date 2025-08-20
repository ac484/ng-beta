'use client';

import type { FC } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle, CardFooter } from '@/components/ui/card';
import { Bar, BarChart, ResponsiveContainer, XAxis, YAxis, Tooltip } from 'recharts';
import type { Partner } from '@/lib/types';
import { Button } from '../ui/button';
import { ArrowUpRight, Users, CheckCircle, XCircle, Clock } from 'lucide-react';
import Link from 'next/link';

interface DashboardProps {
    partners: Partner[];
    onViewPartners: () => void;
}

export const Dashboard: FC<DashboardProps> = ({ partners, onViewPartners }) => {
    const totalPartners = partners.length;
    const activePartners = partners.filter(p => p.status === 'Active').length;
    const inactivePartners = partners.filter(p => p.status === 'Inactive').length;
    const pendingPartners = partners.filter(p => p.status === 'Pending').length;

    const categoryData = partners.reduce((acc, partner) => {
        const category = partner.category;
        const existing = acc.find(item => item.name === category);
        if (existing) {
            existing.total++;
        } else {
            acc.push({ name: category, total: 1 });
        }
        return acc;
    }, [] as { name: string; total: number }[]);

    const totalTransactions = partners.reduce((sum, p) => sum + p.transactions.length, 0);

  return (
    <div className="grid gap-4 md:grid-cols-2 md:gap-8 lg:grid-cols-4">
        <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Total Partners</CardTitle>
                <Users className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
                <div className="text-2xl font-bold">{totalPartners}</div>
                <p className="text-xs text-muted-foreground">All partners in the system</p>
            </CardContent>
        </Card>
        <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Active Partners</CardTitle>
                <CheckCircle className="h-4 w-4 text-green-500" />
            </CardHeader>
            <CardContent>
                <div className="text-2xl font-bold">{activePartners}</div>
                <p className="text-xs text-muted-foreground">{((activePartners/totalPartners) * 100).toFixed(0)}% of total</p>
            </CardContent>
        </Card>
        <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Pending Partners</CardTitle>
                <Clock className="h-4 w-4 text-yellow-500" />
            </CardHeader>
            <CardContent>
                <div className="text-2xl font-bold">{pendingPartners}</div>
                 <p className="text-xs text-muted-foreground">Awaiting approval</p>
            </CardContent>
        </Card>
         <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Total Transactions</CardTitle>
                <Users className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
                <div className="text-2xl font-bold">{totalTransactions}</div>
                <p className="text-xs text-muted-foreground">Across all partners</p>
            </CardContent>
        </Card>
        <Card className="lg:col-span-2">
            <CardHeader>
                <CardTitle>Partners by Category</CardTitle>
                <CardDescription>Distribution of partners across different categories.</CardDescription>
            </CardHeader>
            <CardContent className="pl-2">
                <ResponsiveContainer width="100%" height={300}>
                    <BarChart data={categoryData}>
                        <XAxis dataKey="name" stroke="#888888" fontSize={12} tickLine={false} axisLine={false} />
                        <YAxis stroke="#888888" fontSize={12} tickLine={false} axisLine={false} tickFormatter={(value) => `${value}`} />
                        <Tooltip
                            contentStyle={{
                                background: "hsl(var(--background))",
                                border: "1px solid hsl(var(--border))",
                                borderRadius: "var(--radius)",
                            }}
                        />
                        <Bar dataKey="total" fill="hsl(var(--primary))" radius={[4, 4, 0, 0]} />
                    </BarChart>
                </ResponsiveContainer>
            </CardContent>
        </Card>
        <Card className="lg:col-span-2">
            <CardHeader>
                <CardTitle>Recent Activity</CardTitle>
                 <CardDescription>A quick look at the latest partner updates.</CardDescription>
            </CardHeader>
            <CardContent>
                <div className="space-y-4">
                    {partners.slice(0, 4).map(partner => (
                        <div key={partner.id} className="flex items-center">
                            <div className="ml-4 space-y-1">
                                <p className="text-sm font-medium leading-none">{partner.name}</p>
                                <p className="text-sm text-muted-foreground">{partner.category}</p>
                            </div>
                            <div className="ml-auto font-medium">{partner.status}</div>
                        </div>
                    ))}
                </div>
            </CardContent>
             <CardFooter>
                <Button className="w-full" onClick={onViewPartners}>
                    View All Partners
                    <ArrowUpRight className="h-4 w-4 ml-2" />
                </Button>
            </CardFooter>
        </Card>
    </div>
  );
};
