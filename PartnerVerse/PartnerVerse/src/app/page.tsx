'use client';

import { useState, useEffect, type FC } from 'react';
import { Toaster } from '@/components/ui/toaster';
import { Header } from '@/components/layout/header';
import { PartnerList } from '@/components/partners/partner-list';
import { PartnerProfile } from '@/components/partners/partner-profile';
import { WorkflowBuilder } from '@/components/workflows/workflow-builder';
import { PartnerForm } from '@/components/partners/partner-form';
import type { Partner } from '@/lib/types';
import { useToast } from "@/hooks/use-toast";
import { Dashboard } from '@/components/dashboard/dashboard';
import { AppSidebar } from '@/components/layout/sidebar';
import { db } from '@/lib/firebase';
import { collection, getDocs, addDoc, doc, setDoc } from 'firebase/firestore';
import { Skeleton } from '@/components/ui/skeleton';


export type View = 'dashboard' | 'partners' | 'workflows';
export type Role = 'Admin' | 'Manager' | 'Viewer';

const HomePage: FC = () => {
  const [view, setView] = useState<View>('dashboard');
  const [partners, setPartners] = useState<Partner[]>([]);
  const [selectedPartner, setSelectedPartner] = useState<Partner | null>(null);
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [partnerToEdit, setPartnerToEdit] = useState<Partner | null>(null);
  const [userRole, setUserRole] = useState<Role>('Admin');
  const [isLoading, setIsLoading] = useState(true);
  const { toast } = useToast();

  useEffect(() => {
    const fetchPartners = async () => {
      setIsLoading(true);
      const partnersCollection = collection(db, 'partners');
      const partnerSnapshot = await getDocs(partnersCollection);
      const partnerList = partnerSnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() })) as Partner[];
      setPartners(partnerList);
      setIsLoading(false);
    };

    fetchPartners();
  }, []);

  const handleSelectPartner = (partner: Partner) => {
    setSelectedPartner(partner);
  };
  
  const handleBackToList = () => {
    setSelectedPartner(null);
  };

  const handleAddPartner = () => {
    setPartnerToEdit(null);
    setIsFormOpen(true);
  };
  
  const handleEditPartner = (partner: Partner) => {
    setPartnerToEdit(partner);
    setIsFormOpen(true);
  }

  const handleSavePartner = async (partnerToSave: Omit<Partner, 'id'>) => {
    try {
      if (partnerToEdit && partnerToEdit.id) {
        const partnerRef = doc(db, 'partners', partnerToEdit.id);
        await setDoc(partnerRef, partnerToSave, { merge: true });
        const updatedPartners = partners.map(p => p.id === partnerToEdit.id ? { ...partnerToSave, id: partnerToEdit.id } : p);
        setPartners(updatedPartners);
        if(selectedPartner?.id === partnerToEdit.id) {
            setSelectedPartner({ ...partnerToSave, id: partnerToEdit.id });
        }
        toast({ title: "Partner Updated", description: `${partnerToSave.name} has been successfully updated.` });
      } else {
        const docRef = await addDoc(collection(db, 'partners'), partnerToSave);
        const newPartner = { ...partnerToSave, id: docRef.id };
        setPartners([newPartner, ...partners]);
        toast({ title: "Partner Added", description: `${newPartner.name} has been successfully added.` });
      }
    } catch (error) {
       console.error("Error saving partner: ", error);
       toast({
        title: "Error",
        description: "Failed to save partner. Please try again.",
        variant: "destructive",
      });
    } finally {
      setIsFormOpen(false);
      setPartnerToEdit(null);
    }
  };

  const handleNavigate = (newView: View) => {
    setView(newView);
    setSelectedPartner(null);
  }

  const renderView = () => {
    if (isLoading) {
      return (
        <div className="grid gap-4 md:grid-cols-2 md:gap-8 lg:grid-cols-4">
          <Skeleton className="h-[125px] w-full" />
          <Skeleton className="h-[125px] w-full" />
          <Skeleton className="h-[125px] w-full" />
          <Skeleton className="h-[125px] w-full" />
          <Skeleton className="h-[400px] w-full lg:col-span-2" />
          <Skeleton className="h-[400px] w-full lg:col-span-2" />
        </div>
      );
    }
    if (selectedPartner) {
        return <PartnerProfile partner={selectedPartner} onBack={handleBackToList} userRole={userRole} onEdit={handleEditPartner} />;
    }
    
    switch (view) {
      case 'dashboard':
        return <Dashboard partners={partners} onViewPartners={() => handleNavigate('partners')} />;
      case 'workflows':
        return <WorkflowBuilder partners={partners} />;
      case 'partners':
      default:
        return <PartnerList partners={partners} onSelectPartner={handleSelectPartner} userRole={userRole} onAddPartner={handleAddPartner} />;
    }
  };

  return (
    <div className="flex min-h-screen w-full flex-col bg-muted/40">
      <AppSidebar currentView={view} onNavigate={handleNavigate} />
      <div className="flex flex-col sm:gap-4 sm:py-4 sm:pl-14">
        <Header
          userRole={userRole}
          onRoleChange={setUserRole}
          onAddPartner={handleAddPartner}
        />
        <main className="grid flex-1 items-start gap-4 p-4 sm:px-6 sm:py-0 md:gap-8">
            {renderView()}
        </main>
      </div>
      <PartnerForm
        isOpen={isFormOpen}
        onOpenChange={setIsFormOpen}
        onSave={handleSavePartner as any}
        partner={partnerToEdit}
      />
      <Toaster />
    </div>
  );
}

export default HomePage;
