import { ResourceCard, AlertPanel, QuickActions } from '@/components/dashboard';
import Mars3D from '@/components/dashboard/Mars3D';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription, DialogFooter } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import type { Resource } from '@/types';
import { RoverScene } from '@/components/rover';
import { useResources, useAlerts, useResupply } from '@/hooks';
import { LoadingSpinner } from '@/components/common';
import { toast } from 'sonner';

export const Dashboard = () => {
  const navigate = useNavigate();
  const { resources, isLoading, refreshResources } = useResources();
  const { alerts, acknowledgeAlert } = useAlerts();
  const { createRequest } = useResupply();
  const [selectedResource, setSelectedResource] = useState<Resource | null>(null);

  const RESOURCES_PER_PAGE = 6;
  const initialResources = resources.slice(0, RESOURCES_PER_PAGE);
  const remainingResources = resources.slice(RESOURCES_PER_PAGE);
  const hasMoreResources = remainingResources.length > 0;

  const handleUrgentResupply = async () => {
    const criticalResources = resources.filter(r => {
      const percentage = (r.currentLevel / r.maxCapacity) * 100;
      return percentage <= r.criticalThreshold;
    });

    if (criticalResources.length === 0) {
      toast.info('No critical resources detected', {
        description: 'All resources are at acceptable levels',
      });
      return;
    }

    try {
      for (const resource of criticalResources) {
        await createRequest({
          resourceType: resource.type,
          quantity: Math.floor(resource.maxCapacity * 0.5),
          priority: 'urgent',
          requestedBy: 'Emergency System',
          notes: `Auto-generated urgent resupply request for ${resource.name}`,
        });
      }

      toast.success('Emergency resupply requested', {
        description: `Created ${criticalResources.length} urgent resupply request(s)`,
      });
    } catch (error) {
      toast.error('Failed to create resupply request', {
        description: error instanceof Error ? error.message : 'Unknown error',
      });
    }
  };

  const handleRefresh = () => {
    refreshResources();
    toast.success('Data refreshed', {
      description: 'Resource levels updated successfully',
    });
  };

  if (isLoading && resources.length === 0) {
    return (
      <div className="flex h-[calc(100vh-8rem)] items-center justify-center">
        <LoadingSpinner size={48} text="Loading dashboard..." />
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold tracking-tight">Mission Control Dashboard</h1>
        <p className="text-muted-foreground">
          Real-time monitoring of Mars Base critical resources
        </p>
      </div>

      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        <div className="md:col-span-2 lg:col-span-2">
          <Mars3D onPinClick={(type) => {
            const res = resources.find(r => r.type === type);
            setSelectedResource(res ?? null);
          }} />
        </div>

        {initialResources.map((resource) => (
          <ResourceCard key={resource.id} resource={resource} initialCollapsed={false} />
        ))}
        
        {hasMoreResources && (
          <Button 
            variant="outline" 
            className="md:col-span-2 lg:col-span-2 h-32 text-lg font-semibold"
            onClick={() => navigate('/inventory')}
          >
            See more resources ({remainingResources.length} more)
          </Button>
        )}
      </div>

      <div className="grid gap-6">
        <RoverScene />
      </div>

      <div className="grid gap-6 md:grid-cols-3">
        <div className="md:col-span-2">
          <AlertPanel alerts={alerts} onAcknowledge={acknowledgeAlert} />
        </div>

        <div>
          <QuickActions
            onUrgentResupply={handleUrgentResupply}
            onRefresh={handleRefresh}
          />
        </div>
      </div>

      {/* Dialog to show resource details when a planet-button is clicked */}
      <Dialog open={!!selectedResource} onOpenChange={(open) => { if (!open) setSelectedResource(null); }}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>{selectedResource?.name ?? 'Resource'}</DialogTitle>
            <DialogDescription>
              Detailed resource information
            </DialogDescription>
          </DialogHeader>
          {selectedResource && (
            <div className="py-2">
              <ResourceCard resource={selectedResource} collapsible={false} initialCollapsed={false} />
            </div>
          )}
          <DialogFooter>
            <Button onClick={() => setSelectedResource(null)}>Close</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

    </div>
  );
};
