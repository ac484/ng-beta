import { contracts } from '@/lib/data';
import { DashboardStats } from '@/components/contract/dashboard-stats';
import { ContractsTable } from '@/components/contract/contracts-table';
import { AiSummarizerDialog } from '@/components/contract/ai-summarizer-dialog';
import { Logo } from '@/components/contract/logo';
import { Button } from '@/components/ui/button';
import { PlusCircle } from 'lucide-react';

export default function Home() {
  const stats = {
    totalContracts: contracts.length,
    active: contracts.filter(c => c.status === 'Active').length,
    completed: contracts.filter(c => c.status === 'Completed').length,
    totalValue: contracts.reduce((acc, c) => acc + c.totalValue, 0),
  };

  return (
    <div className="flex min-h-screen w-full flex-col bg-background">
      <header className="sticky top-0 z-30 flex h-16 items-center gap-4 border-b bg-background/95 px-4 backdrop-blur sm:px-6">
        <Logo />
        <div className="ml-auto flex items-center gap-2">
          <AiSummarizerDialog />
          <Button>
            <PlusCircle className="mr-2 h-4 w-4" />
            New Contract
          </Button>
        </div>
      </header>
      <main className="flex flex-1 flex-col gap-4 p-4 sm:px-6 sm:py-8 md:gap-8">
        <DashboardStats stats={stats} />
        <ContractsTable contracts={contracts} />
      </main>
    </div>
  );
}
