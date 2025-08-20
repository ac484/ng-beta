'use client';

import { useState, useMemo, type FC } from 'react';
import Image from 'next/image';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import type { Partner } from '@/lib/types';
import type { Role } from '@/app/page';
import { Button } from '../ui/button';
import { ListFilter, Plus } from 'lucide-react';
import { DropdownMenu, DropdownMenuCheckboxItem, DropdownMenuContent, DropdownMenuLabel, DropdownMenuSeparator, DropdownMenuTrigger } from '../ui/dropdown-menu';

interface PartnerListProps {
  partners: Partner[];
  onSelectPartner: (partner: Partner) => void;
  userRole: Role;
  onAddPartner: () => void;
}

export const PartnerList: FC<PartnerListProps> = ({ partners, onSelectPartner, userRole, onAddPartner }) => {
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState('All');
  const [categoryFilter, setCategoryFilter] = useState('All');

  const filteredPartners = useMemo(() => {
    return partners.filter(partner => {
      const searchMatch = partner.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                          partner.overview.toLowerCase().includes(searchTerm.toLowerCase());
      const statusMatch = statusFilter === 'All' || partner.status === statusFilter;
      const categoryMatch = categoryFilter === 'All' || partner.category === categoryFilter;
      return searchMatch && statusMatch && categoryMatch;
    });
  }, [partners, searchTerm, statusFilter, categoryFilter]);
  
  const statusBadgeVariant = (status: Partner['status']) => {
    switch (status) {
      case 'Active': return 'default';
      case 'Inactive': return 'secondary';
      case 'Pending': return 'outline';
      default: return 'default';
    }
  };


  return (
    <div className="space-y-6">
       <div className="flex items-center">
            <div className="flex-1">
                <h2 className="text-3xl font-bold tracking-tight">Partners</h2>
                <p className="text-muted-foreground">View and manage your business relationships.</p>
            </div>
            <div className="ml-auto flex items-center gap-2">
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button variant="outline" size="sm" className="h-8 gap-1">
                    <ListFilter className="h-3.5 w-3.5" />
                    <span className="sr-only sm:not-sr-only sm:whitespace-nowrap">
                      Filter
                    </span>
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end">
                  <DropdownMenuLabel>Filter by</DropdownMenuLabel>
                  <DropdownMenuSeparator />
                   <DropdownMenuCheckboxItem checked>
                    Status
                  </DropdownMenuCheckboxItem>
                  <DropdownMenuCheckboxItem>Category</DropdownMenuCheckboxItem>
                </DropdownMenuContent>
              </DropdownMenu>
              {userRole === 'Admin' && (
                <Button size="sm" className="h-8 gap-1" onClick={onAddPartner}>
                  <Plus className="h-3.5 w-3.5" />
                  <span className="sr-only sm:not-sr-only sm:whitespace-nowrap">
                    Add Partner
                  </span>
                </Button>
              )}
            </div>
          </div>


      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {filteredPartners.map(partner => (
          <Card 
            key={partner.id} 
            onClick={() => onSelectPartner(partner)} 
            className="cursor-pointer hover:shadow-lg hover:border-primary/50 transition-all duration-200 flex flex-col"
          >
            <CardHeader className="flex-grow">
              <div className="flex justify-between items-start">
                  <div className='flex items-center gap-4'>
                    <Image src={partner.logoUrl} alt={`${partner.name} logo`} width={48} height={48} className="rounded-md border" data-ai-hint="logo company" />
                    <div>
                        <CardTitle className="text-xl">{partner.name}</CardTitle>
                        <CardDescription>{partner.category}</CardDescription>
                    </div>
                  </div>
                <Badge variant={statusBadgeVariant(partner.status)}>{partner.status}</Badge>
              </div>
            </CardHeader>
            <CardContent>
              <p className="text-sm text-muted-foreground line-clamp-3 h-[60px]">{partner.overview}</p>
            </CardContent>
          </Card>
        ))}
      </div>
       {filteredPartners.length === 0 && (
          <div className="text-center col-span-full py-16">
            <p className="text-muted-foreground">No partners found. Try adjusting your filters.</p>
          </div>
        )}
    </div>
  );
};
