import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Progress } from '@/components/ui/progress';
import { StatusBadge } from '@/components/common';
import type { Resource } from '@/types';
import { formatResourceLevel, formatPercentage, formatDaysRemaining, getResourceIcon } from '@/utils';
import { 
  Wind, Droplet, UtensilsCrossed, Wrench, TrendingUp, TrendingDown, Minus, ChevronDown, ChevronUp,
  TreePine, Bot, Battery, Heart, Pipette, Sprout, Bug, Waves, BatteryCharging, Users
} from 'lucide-react';
import { getResourceStatus } from '@/mocks';
import { useState } from 'react';

interface ResourceCardProps {
  resource: Resource;
  initialCollapsed: boolean;
  collapsible?: boolean;
}

const iconMap = {
  Wind,
  Droplet,
  UtensilsCrossed,
  Wrench,
  TreePine,
  Bot,
  Battery,
  Heart,
  Pipette,
  Sprout,
  Bug,
  Waves,
  BatteryCharging,
  Users,
  TrendingUp,
  TrendingDown,
  Minus,
  ChevronDown,
  ChevronUp,
};

export const ResourceCard = ({ resource, initialCollapsed, collapsible = true }: ResourceCardProps) => {
  const [collapsed, setCollapsed] = useState(initialCollapsed);

  const status = getResourceStatus(resource);
  const percentage = (resource.currentLevel / resource.maxCapacity) * 100;

  const iconName = getResourceIcon(resource.type);
  const ResourceIcon = iconMap[iconName as keyof typeof iconMap] || iconMap.Wrench;

  const TrendIcon = resource.trend === 'increasing' ? iconMap.TrendingUp
    : resource.trend === 'decreasing' ? iconMap.TrendingDown
      : iconMap.Minus;

  const CollapseIcon = collapsed ? iconMap.ChevronDown : iconMap.ChevronUp;

  const getProgressColor = () => {
    if (status === 'critical') return 'bg-red-500';
    if (status === 'warning') return 'bg-yellow-500';
    if (status === 'optimal') return 'bg-green-500';
    return 'bg-blue-500';
  };

  return (
    <Card className="transition-all hover:shadow-lg">
      <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
        <div className='flex flex-row items-center gap-x-2'>
          <CardTitle className="text-sm font-medium">{resource.name}</CardTitle>
          <ResourceIcon className="h-5 w-5 text-muted-foreground" />
        </div>
        {collapsible && <button onClick={() => setCollapsed(!collapsed)}>
          <CollapseIcon />
        </button>}
      </CardHeader>
      {!collapsed ? <CardContent>
        <div className="space-y-3">
          <div className="flex items-end justify-between">
            <div>
              <div className="text-2xl font-bold">
                {formatResourceLevel(resource.currentLevel, resource.unit)}
              </div>
              <p className="text-xs text-muted-foreground">
                of {formatResourceLevel(resource.maxCapacity, resource.unit)}
              </p>
            </div>
            <StatusBadge status={status} />
          </div>

          <div className="space-y-1">
            <div className="flex items-center justify-between text-xs">
              <span className="text-muted-foreground">Level</span>
              <span className="font-medium">{formatPercentage(resource.currentLevel, resource.maxCapacity)}</span>
            </div>
            <Progress value={percentage} className={`h-2 ${getProgressColor()}`} />
          </div>

          <div className="flex items-center justify-between text-xs">
            <div className="flex items-center gap-1 text-muted-foreground">
              <TrendIcon className="h-3 w-3" />
              <span>{resource.trend || 'stable'}</span>
            </div>
            <div className="text-muted-foreground">
              {formatDaysRemaining(resource.estimatedDaysRemaining)} remaining
            </div>
          </div>
        </div>
      </CardContent>
        : <div className='text-2xl font-bold px-6'>{
          formatResourceLevel(resource.currentLevel, resource.unit)
        }</div>}
    </Card>
  );
};
