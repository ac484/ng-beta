'use client';

import * as React from 'react';
import type { Contract } from '@/types';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { Download, MoreHorizontal, Eye } from 'lucide-react';
import { ContractDetailsSheet } from './contract-details-sheet';
import { formatDate } from '@/lib/utils';

interface ContractsTableProps {
  contracts: Contract[];
}

export function ContractsTable({ contracts: initialContracts }: ContractsTableProps) {
  const [contracts] = React.useState<Contract[]>(initialContracts);
  const [selectedContract, setSelectedContract] = React.useState<Contract | null>(null);
  const [isSheetOpen, setSheetOpen] = React.useState(false);

  const handleViewDetails = (contract: Contract) => {
    setSelectedContract(contract);
    setSheetOpen(true);
  };
  
  const handleSheetOpenChange = (open: boolean) => {
    setSheetOpen(open);
    if (!open) {
      setSelectedContract(null);
    }
  }

  const handleExport = () => {
    const headers = ['ID', 'Name', 'Contractor', 'Client', 'Start Date', 'End Date', 'Total Value', 'Status'];
    const rows = contracts.map(c => [
      c.id,
      `"${c.name.replace(/"/g, '""')}"`,
      `"${c.contractor.replace(/"/g, '""')}"`,
      `"${c.client.replace(/"/g, '""')}"`,
      c.startDate.toISOString().split('T')[0],
      c.endDate.toISOString().split('T')[0],
      c.totalValue,
      c.status,
    ].join(','));

    const csvContent = [headers.join(','), ...rows].join('\n');
    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    const link = document.createElement('a');
    const url = URL.createObjectURL(blob);
    link.setAttribute('href', url);
    link.setAttribute('download', 'contracts_export.csv');
    link.style.visibility = 'hidden';
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  const getStatusVariant = (status: Contract['status']): 'default' | 'secondary' | 'outline' | 'destructive' => {
    switch (status) {
      case 'Active':
        return 'default';
      case 'Completed':
        return 'secondary';
      case 'On Hold':
        return 'outline';
      case 'Terminated':
        return 'destructive';
      default:
        return 'default';
    }
  }

  return (
    <>
      <Card>
        <CardHeader className="flex flex-row items-center justify-between">
          <div>
            <CardTitle>Contracts</CardTitle>
            <CardDescription>An overview of all ongoing and completed construction contracts.</CardDescription>
          </div>
          <Button variant="outline" size="sm" onClick={handleExport}>
            <Download className="mr-2 h-4 w-4" />
            Export CSV
          </Button>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Contract Name</TableHead>
                <TableHead className="hidden md:table-cell">Contractor</TableHead>
                <TableHead className="hidden lg:table-cell">End Date</TableHead>
                <TableHead>Value</TableHead>
                <TableHead>Status</TableHead>
                <TableHead><span className="sr-only">Actions</span></TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {contracts.map((contract) => (
                <TableRow key={contract.id} className="cursor-pointer" onClick={() => handleViewDetails(contract)}>
                  <TableCell className="font-medium">{contract.name}</TableCell>
                  <TableCell className="hidden md:table-cell">{contract.contractor}</TableCell>
                  <TableCell className="hidden lg:table-cell">
                    {formatDate(contract.endDate)}
                  </TableCell>
                  <TableCell>
                    ${contract.totalValue.toLocaleString()}
                  </TableCell>
                  <TableCell>
                    <Badge variant={getStatusVariant(contract.status)}>{contract.status}</Badge>
                  </TableCell>
                  <TableCell>
                    <DropdownMenu>
                      <DropdownMenuTrigger asChild>
                        <Button aria-haspopup="true" size="icon" variant="ghost">
                          <MoreHorizontal className="h-4 w-4" />
                          <span className="sr-only">Toggle menu</span>
                        </Button>
                      </DropdownMenuTrigger>
                      <DropdownMenuContent align="end" onClick={(e) => e.stopPropagation()}>
                        <DropdownMenuItem onSelect={() => handleViewDetails(contract)}>
                          <Eye className="mr-2 h-4 w-4" />
                          View Details
                        </DropdownMenuItem>
                      </DropdownMenuContent>
                    </DropdownMenu>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </CardContent>
      </Card>
      {selectedContract && (
         <ContractDetailsSheet contract={selectedContract} isOpen={isSheetOpen} onOpenChange={handleSheetOpenChange} />
      )}
    </>
  );
}
