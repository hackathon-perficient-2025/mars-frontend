import type { ReactNode } from 'react';
import { Header } from './Header';
import { Sidebar } from './Sidebar';
import { useSocket } from '@/hooks';
import { Wifi, WifiOff } from 'lucide-react';
import { cn } from '@/lib/utils';

interface MainLayoutProps {
  children: ReactNode;
  isConnected?: boolean;
}

export const MainLayout = ({ children, isConnected }: MainLayoutProps) => {
  const { isConnected: wsConnected } = useSocket();

  return (
    <div className="min-h-screen bg-background">
      <Header isConnected={isConnected} />
      <div className="flex">
        <Sidebar />
        <main className="ml-64 w-[calc(100%-16rem)] p-6">
          {children}
        </main>
      </div>

      {/* WebSocket Status Indicator */}
      <div className="fixed bottom-4 right-4 z-50">
        <div className={cn(
          "flex items-center gap-2 px-3 py-2 rounded-lg text-xs font-medium transition-all",
          wsConnected
            ? "bg-green-500/10 text-green-600 dark:text-green-400 border border-green-500/20"
            : "bg-red-500/10 text-red-600 dark:text-red-400 border border-red-500/20"
        )}>
          {wsConnected ? (
            <>
              <Wifi className="h-3 w-3" />
              <span>Real-time Connected</span>
            </>
          ) : (
            <>
              <WifiOff className="h-3 w-3" />
              <span>Offline Mode</span>
            </>
          )}
        </div>
      </div>
    </div>
  );
};
