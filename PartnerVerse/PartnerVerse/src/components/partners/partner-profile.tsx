'use client';

import type { FC } from 'react';
import Image from 'next/image';
import type { Partner } from '@/lib/types';
import type { Role } from '@/app/page';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Globe, Edit, Users, DollarSign, Calendar, Star, FileText, ShieldCheck, FileWarning, FileX, Briefcase } from 'lucide-react';

interface PartnerProfileProps {
  partner: Partner;
  onBack: () => void;
  userRole: Role;
  onEdit: (partner: Partner) => void;
}

const RatingStars: FC<{ rating: number }> = ({ rating }) => (
    <div className="flex items-center">
        {[...Array(5)].map((_, i) => (
            <Star key={i} className={`h-5 w-5 ${i < rating ? 'text-yellow-400 fill-yellow-400' : 'text-gray-300'}`} />
        ))}
    </div>
);

const ComplianceStatusIcon: FC<{ status: 'Valid' | 'Expiring Soon' | 'Expired' }> = ({ status }) => {
    switch (status) {
        case 'Valid': return <ShieldCheck className="h-5 w-5 text-green-600" />;
        case 'Expiring Soon': return <FileWarning className="h-5 w-5 text-yellow-600" />;
        case 'Expired': return <FileX className="h-5 w-5 text-red-600" />;
    }
}

export const PartnerProfile: FC<PartnerProfileProps> = ({ partner, userRole, onEdit }) => {
    const statusBadgeVariant = (status: Partner['status']) => {
        switch (status) {
        case 'Active': return 'default';
        case 'Inactive': return 'secondary';
        case 'Pending': return 'outline';
        default: return 'default';
        }
    };
    
    const transactionStatusColor = (status: 'Completed' | 'Pending' | 'Failed') => {
        switch (status) {
            case 'Completed': return 'text-green-600';
            case 'Pending': return 'text-yellow-600';
            case 'Failed': return 'text-red-600';
        }
    }

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader className="flex flex-col md:flex-row gap-6 items-start">
            <Image src={partner.logoUrl} alt={`${partner.name} logo`} width={80} height={80} className="rounded-lg border" data-ai-hint="logo company" />
            <div className='flex-1'>
                <div className='flex justify-between items-start'>
                    <CardTitle className="text-3xl font-bold">{partner.name}</CardTitle>
                    {userRole !== 'Viewer' && <Button variant="outline" onClick={() => onEdit(partner)}><Edit className="mr-2 h-4 w-4" /> Edit Partner</Button>}
                </div>
                <div className="flex items-center flex-wrap gap-x-4 gap-y-2 mt-2 text-muted-foreground text-sm">
                    <Badge variant={statusBadgeVariant(partner.status)} className="text-sm">{partner.status}</Badge>
                    <span className="hidden md:inline">|</span>
                    <span>{partner.category}</span>
                     <span className="hidden md:inline">|</span>
                    <a href={`https://${partner.website}`} target="_blank" rel="noopener noreferrer" className="flex items-center gap-1 hover:text-primary">
                        <Globe className="h-4 w-4" /> {partner.website}
                    </a>
                     <span className="hidden md:inline">|</span>
                     <span className="flex items-center gap-1">
                        <Calendar className="h-4 w-4" /> Joined on {new Date(partner.joinDate).toLocaleDateString()}
                    </span>
                </div>
            </div>
        </CardHeader>
      </Card>
      
      <Tabs defaultValue="overview">
        <TabsList className="flex flex-wrap h-auto">
          <TabsTrigger value="overview">Overview</TabsTrigger>
          <TabsTrigger value="performance"><Star className="mr-2 h-4 w-4" />Performance</TabsTrigger>
          <TabsTrigger value="compliance"><FileText className="mr-2 h-4 w-4" />Compliance</TabsTrigger>
          <TabsTrigger value="contracts"><Briefcase className="mr-2 h-4 w-4" />Contracts</TabsTrigger>
          <TabsTrigger value="contacts"><Users className="mr-2 h-4 w-4" />Contacts</TabsTrigger>
          <TabsTrigger value="transactions"><DollarSign className="mr-2 h-4 w-4" />Transactions</TabsTrigger>
        </TabsList>
        <TabsContent value="overview">
          <Card>
            <CardContent className="p-6">
                <p className='text-foreground'>{partner.overview}</p>
            </CardContent>
          </Card>
        </TabsContent>
        <TabsContent value="performance">
          <Card>
            <CardHeader>
              <CardTitle>Performance Reviews</CardTitle>
              <CardDescription>Performance history and notes for {partner.name}.</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              {partner.performanceReviews.length > 0 ? partner.performanceReviews.map(review => (
                <div key={review.id} className="border-b pb-4 last:border-b-0">
                  <div className="flex justify-between items-center mb-2">
                    <RatingStars rating={review.rating} />
                    <span className="text-sm text-muted-foreground">{new Date(review.date).toLocaleDateString()} by {review.reviewer}</span>
                  </div>
                  <p className="text-muted-foreground">{review.notes}</p>
                </div>
              )) : (
                 <div className="text-center text-muted-foreground py-8">No performance reviews found.</div>
              )}
            </CardContent>
          </Card>
        </TabsContent>
        <TabsContent value="compliance">
          <Card>
            <CardHeader>
              <CardTitle>Compliance Documents</CardTitle>
              <CardDescription>Track required licenses and certifications for {partner.name}.</CardDescription>
            </CardHeader>
            <CardContent>
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Document</TableHead>
                    <TableHead>Status</TableHead>
                    <TableHead>Expiry Date</TableHead>
                    <TableHead>Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {partner.complianceDocuments.length > 0 ? partner.complianceDocuments.map(doc => (
                    <TableRow key={doc.id}>
                      <TableCell className="font-medium">{doc.name}</TableCell>
                      <TableCell className="flex items-center gap-2">
                          <ComplianceStatusIcon status={doc.status} /> {doc.status}
                      </TableCell>
                      <TableCell>{new Date(doc.expiryDate).toLocaleDateString()}</TableCell>
                      <TableCell>
                          <Button variant="link" size="sm" asChild><a href={doc.fileUrl} target="_blank">View</a></Button>
                      </TableCell>
                    </TableRow>
                  )) : (
                    <TableRow>
                      <TableCell colSpan={4} className="text-center h-24">No compliance documents found.</TableCell>
                    </TableRow>
                  )}
                </TableBody>
              </Table>
            </CardContent>
          </Card>
        </TabsContent>
         <TabsContent value="contracts">
          <Card>
            <CardHeader>
              <CardTitle>Contracts</CardTitle>
              <CardDescription>Contracts associated with {partner.name}.</CardDescription>
            </CardHeader>
            <CardContent>
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Title</TableHead>
                    <TableHead>Status</TableHead>
                    <TableHead>Start Date</TableHead>
                    <TableHead>End Date</TableHead>
                    <TableHead>Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {partner.contracts.length > 0 ? partner.contracts.map(contract => (
                    <TableRow key={contract.id}>
                      <TableCell className="font-medium">{contract.title}</TableCell>
                      <TableCell>
                          <Badge variant={contract.status === 'Active' ? 'default' : 'secondary'}>{contract.status}</Badge>
                      </TableCell>
                      <TableCell>{new Date(contract.startDate).toLocaleDateString()}</TableCell>
                      <TableCell>{new Date(contract.endDate).toLocaleDateString()}</TableCell>
                      <TableCell>
                        <Button variant="link" size="sm" asChild><a href={contract.fileUrl} target="_blank">View</a></Button>
                      </TableCell>
                    </TableRow>
                  )) : (
                    <TableRow>
                      <TableCell colSpan={5} className="text-center h-24">No contracts found.</TableCell>
                    </TableRow>
                  )}
                </TableBody>
              </Table>
            </CardContent>
          </Card>
        </TabsContent>
        <TabsContent value="contacts">
          <Card>
            <CardHeader>
              <CardTitle>Associated Contacts</CardTitle>
              <CardDescription>Key points of contact for {partner.name}.</CardDescription>
            </CardHeader>
            <CardContent>
                <Table>
                    <TableHeader>
                        <TableRow>
                            <TableHead>Name</TableHead>
                            <TableHead>Role</TableHead>
                            <TableHead>Email</TableHead>
                            <TableHead>Phone</TableHead>
                        </TableRow>
                    </TableHeader>
                    <TableBody>
                        {partner.contacts.map(contact => (
                            <TableRow key={contact.id}>
                                <TableCell className="font-medium">{contact.name}</TableCell>
                                <TableCell>{contact.role}</TableCell>
                                <TableCell><a href={`mailto:${contact.email}`} className="text-primary hover:underline">{contact.email}</a></TableCell>
                                <TableCell>{contact.phone}</TableCell>
                            </TableRow>
                        ))}
                    </TableBody>
                </Table>
            </CardContent>
          </Card>
        </TabsContent>
        <TabsContent value="transactions">
           <Card>
            <CardHeader>
              <CardTitle>Transaction History</CardTitle>
              <CardDescription>Financial records associated with {partner.name}.</CardDescription>
            </CardHeader>
            <CardContent>
                <Table>
                    <TableHeader>
                        <TableRow>
                            <TableHead>Date</TableHead>
                            <TableHead>Description</TableHead>
                            <TableHead>Status</TableHead>
                            <TableHead className="text-right">Amount</TableHead>
                        </TableRow>
                    </TableHeader>
                    <TableBody>
                        {partner.transactions.map(tx => (
                            <TableRow key={tx.id}>
                                <TableCell>{new Date(tx.date).toLocaleDateString()}</TableCell>
                                <TableCell className="font-medium">{tx.description}</TableCell>
                                <TableCell className={transactionStatusColor(tx.status)}>{tx.status}</TableCell>
                                <TableCell className="text-right">${tx.amount.toLocaleString()}</TableCell>
                            </TableRow>
                        ))}
                         {partner.transactions.length === 0 && (
                            <TableRow>
                                <TableCell colSpan={4} className="text-center h-24">No transactions found.</TableCell>
                            </TableRow>
                        )}
                    </TableBody>
                </Table>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
};
