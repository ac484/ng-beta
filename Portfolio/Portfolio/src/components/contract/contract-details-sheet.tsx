'use client';

import type { Contract, Payment, ChangeOrder, ContractVersion } from '@/types';
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetDescription,
} from '@/components/ui/sheet';
import {
  Tabs,
  TabsContent,
  TabsList,
  TabsTrigger,
} from '@/components/ui/tabs';
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  CardDescription
} from '@/components/ui/card';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import { Separator } from '@/components/ui/separator';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { ScrollArea } from '@/components/ui/scroll-area';
import { formatDate } from '@/lib/utils';

interface ContractDetailsSheetProps {
  contract: Contract;
  isOpen: boolean;
  onOpenChange: (isOpen: boolean) => void;
}

export function ContractDetailsSheet({ contract, isOpen, onOpenChange }: ContractDetailsSheetProps) {
  const totalPaid = contract.payments
    .filter((p) => p.status === 'Paid')
    .reduce((acc, p) => acc + p.amount, 0);
  const paymentProgress = (totalPaid / contract.totalValue) * 100;

  const getStatusVariant = (status: Payment['status'] | ChangeOrder['status']): 'default' | 'secondary' | 'outline' | 'destructive' => {
     switch (status) {
      case 'Paid':
      case 'Approved':
        return 'default';
      case 'Pending':
        return 'outline';
      case 'Overdue':
      case 'Rejected':
        return 'destructive';
      default:
        return 'secondary';
    }
  }

  return (
    <Sheet open={isOpen} onOpenChange={onOpenChange}>
      <SheetContent className="w-full sm:max-w-3xl">
        <ScrollArea className="h-full pr-6">
          <SheetHeader className="mb-4">
            <SheetTitle>{contract.name}</SheetTitle>
            <SheetDescription>
              {contract.id} - {contract.client}
            </SheetDescription>
          </SheetHeader>
          <Tabs defaultValue="details">
            <TabsList className="grid w-full grid-cols-4">
              <TabsTrigger value="details">Details</TabsTrigger>
              <TabsTrigger value="payments">Payments</TabsTrigger>
              <TabsTrigger value="changes">Changes</TabsTrigger>
              <TabsTrigger value="history">History</TabsTrigger>
            </TabsList>
            <TabsContent value="details" className="mt-4">
              <Card>
                <CardContent className="pt-6 space-y-4">
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <h3 className="text-sm font-medium text-muted-foreground">Contractor</h3>
                      <p className="font-semibold">{contract.contractor}</p>
                    </div>
                     <div>
                      <h3 className="text-sm font-medium text-muted-foreground">Client</h3>
                      <p className="font-semibold">{contract.client}</p>
                    </div>
                    <div>
                      <h3 className="text-sm font-medium text-muted-foreground">Start Date</h3>
                      <p className="font-semibold">{formatDate(contract.startDate)}</p>
                    </div>
                    <div>
                      <h3 className="text-sm font-medium text-muted-foreground">End Date</h3>
                      <p className="font-semibold">{formatDate(contract.endDate)}</p>
                    </div>
                    <div>
                      <h3 className="text-sm font-medium text-muted-foreground">Total Value</h3>
                      <p className="font-semibold">${contract.totalValue.toLocaleString()}</p>
                    </div>
                     <div>
                      <h3 className="text-sm font-medium text-muted-foreground">Status</h3>
                      <Badge>{contract.status}</Badge>
                    </div>
                  </div>
                  <Separator />
                   <div>
                      <h3 className="text-sm font-medium text-muted-foreground">Scope of Work</h3>
                      <p className="text-sm mt-1">{contract.scope}</p>
                    </div>
                </CardContent>
              </Card>
            </TabsContent>
            <TabsContent value="payments" className="mt-4">
              <Card>
                <CardHeader>
                  <CardTitle>Payment Tracking</CardTitle>
                  <CardDescription>Log of all payment requests and their status.</CardDescription>
                  <div className="pt-2">
                    <div className="flex justify-between mb-1">
                      <span className="text-sm font-medium">Total Paid: ${totalPaid.toLocaleString()}</span>
                       <span className="text-sm font-medium">${contract.totalValue.toLocaleString()}</span>
                    </div>
                    <Progress value={paymentProgress} aria-label={`${paymentProgress.toFixed(0)}% paid`} />
                  </div>
                </CardHeader>
                <CardContent>
                  <Table>
                    <TableHeader>
                      <TableRow>
                        <TableHead>Amount</TableHead>
                        <TableHead>Request Date</TableHead>
                         <TableHead>Status</TableHead>
                        <TableHead>Paid Date</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {contract.payments.map((payment) => (
                        <TableRow key={payment.id}>
                          <TableCell>${payment.amount.toLocaleString()}</TableCell>
                          <TableCell>{formatDate(payment.requestDate)}</TableCell>
                          <TableCell><Badge variant={getStatusVariant(payment.status)}>{payment.status}</Badge></TableCell>
                          <TableCell>{payment.paidDate ? formatDate(payment.paidDate) : 'N/A'}</TableCell>
                        </TableRow>
                      ))}
                    </TableBody>
                  </Table>
                </CardContent>
              </Card>
            </TabsContent>
            <TabsContent value="changes" className="mt-4">
               <Card>
                <CardHeader>
                  <CardTitle>Change Orders</CardTitle>
                  <CardDescription>Management of contract modifications and revisions.</CardDescription>
                </CardHeader>
                <CardContent>
                  <Table>
                    <TableHeader>
                      <TableRow>
                        <TableHead>Title</TableHead>
                        <TableHead>Date</TableHead>
                        <TableHead>Status</TableHead>
                         <TableHead>Cost Impact</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {contract.changeOrders.map((order) => (
                        <TableRow key={order.id}>
                          <TableCell className="font-medium">{order.title}</TableCell>
                           <TableCell>{formatDate(order.date)}</TableCell>
                           <TableCell><Badge variant={getStatusVariant(order.status)}>{order.status}</Badge></TableCell>
                          <TableCell>${order.impact.cost.toLocaleString()}</TableCell>
                        </TableRow>
                      ))}
                    </TableBody>
                  </Table>
                </CardContent>
              </Card>
            </TabsContent>
            <TabsContent value="history" className="mt-4">
              <Card>
                <CardHeader>
                  <CardTitle>Version History</CardTitle>
                  <CardDescription>Chronological record of contract versions.</CardDescription>
                </CardHeader>
                <CardContent>
                   <div className="space-y-4">
                    {contract.versions.map((version, index) => (
                      <div key={version.version} className="grid grid-cols-[auto_1fr] items-start gap-4">
                        <div className="flex flex-col items-center">
                          <div className="flex h-8 w-8 items-center justify-center rounded-full bg-primary text-primary-foreground">
                            {version.version}
                          </div>
                          {index < contract.versions.length - 1 && <div className="h-10 w-px bg-border" />}
                        </div>
                        <div>
                          <p className="font-semibold">{formatDate(version.date)}</p>
                          <p className="text-sm text-muted-foreground">{version.changeSummary}</p>
                        </div>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            </TabsContent>
          </Tabs>
        </ScrollArea>
      </SheetContent>
    </Sheet>
  );
}
