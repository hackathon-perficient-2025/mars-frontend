import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { ChartContainer, ChartTooltip, ChartTooltipContent } from '@/components/ui/chart';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, ResponsiveContainer } from 'recharts';
import type { ResourceHistory, ResourceType } from '@/types';
import { format } from 'date-fns';

interface ResourceChartProps {
  data: ResourceHistory[];
  resourceType: ResourceType;
  title: string;
}

const chartConfig = {
  level: {
    label: 'Level',
    color: 'hsl(var(--chart-1))',
  },
};

export const ResourceChart = ({ data, resourceType, title }: ResourceChartProps) => {
  const formattedData = data.map(item => ({
    date: format(item.timestamp, 'MMM dd HH:mm'),
    level: item.level,
  }));

  const getColor = () => {
    switch (resourceType) {
      case 'oxygen':
        return 'hsl(var(--chart-1))';
      case 'water':
        return 'hsl(var(--chart-2))';
      case 'food':
        return 'hsl(var(--chart-3))';
      case 'spare_parts':
        return 'hsl(var(--chart-4))';
      default:
        return 'hsl(var(--chart-1))';
    }
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle>{title}</CardTitle>
        <CardDescription>Resource levels over time</CardDescription>
      </CardHeader>
      <CardContent>
        <ChartContainer config={chartConfig} className="h-[300px]">
          <ResponsiveContainer width="100%" height="100%">
            <LineChart data={formattedData}>
              <CartesianGrid strokeDasharray="3 3" className="stroke-muted" />
              <XAxis
                dataKey="date"
                className="text-xs"
                tick={{ fill: 'hsl(var(--muted-foreground))' }}
              />
              <YAxis
                className="text-xs"
                tick={{ fill: 'hsl(var(--muted-foreground))' }}
              />
              <ChartTooltip content={<ChartTooltipContent />} />
              <Line
                type="monotone"
                dataKey="level"
                stroke={getColor()}
                strokeWidth={2}
                dot={false}
              />
            </LineChart>
          </ResponsiveContainer>
        </ChartContainer>
      </CardContent>
    </Card>
  );
};
