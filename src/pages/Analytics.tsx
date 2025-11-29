import { useState } from "react";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { ChartContainer } from "@/components/ui/chart";
import {
  XAxis,
  YAxis,
  CartesianGrid,
  ResponsiveContainer,
  BarChart,
  Bar,
  Area,
  AreaChart,
  Tooltip,
  Legend,
} from "recharts";
import { useAnalytics } from "@/hooks";
import type { TimeRange, ResourceType } from "@/types";
import { format } from "date-fns";
import {
  TrendingUp,
  TrendingDown,
  AlertTriangle,
  Activity,
  RefreshCw,
  Zap,
  BarChart3,
  LineChart as LineChartIcon,
} from "lucide-react";

const chartConfig = {
  level: {
    label: "Actual Level",
    color: "hsl(var(--chart-1))",
  },
  predicted: {
    label: "Predicted Level",
    color: "hsl(var(--chart-2))",
  },
  anomaly: {
    label: "Anomaly",
    color: "hsl(var(--destructive))",
  },
};

const resourceTypeOptions: ResourceType[] = [
  "oxygen",
  "water",
  "spare_parts",
  "food",
  "trees",
  "solar_robots",
  "energy_storage",
  "medical_supplies",
  "sewage_capacity",
  "arable_land",
  "pollinators",
  "freshwater_aquifer",
  "batteries",
  "population",
];

const getSeverityColor = (severity: string) => {
  switch (severity) {
    case "critical":
      return "destructive";
    case "high":
      return "default";
    case "medium":
      return "secondary";
    case "low":
      return "outline";
    default:
      return "outline";
  }
};

const getAnomalyIcon = (type: string) => {
  switch (type) {
    case "spike":
      return <TrendingUp className="h-4 w-4" />;
    case "drop":
      return <TrendingDown className="h-4 w-4" />;
    case "leak_detected":
      return <AlertTriangle className="h-4 w-4" />;
    case "unusual_pattern":
      return <Activity className="h-4 w-4" />;
    default:
      return <Zap className="h-4 w-4" />;
  }
};

export const Analytics = () => {
  const [selectedResource, setSelectedResource] =
    useState<ResourceType>("oxygen");
  const [timeRange, setTimeRange] = useState<TimeRange>("7d");

  const { trends, stats, anomalies, isLoading, refresh } = useAnalytics({
    resourceType: selectedResource,
    timeRange,
  });

  const currentTrend = trends.find((t) => t.resourceType === selectedResource);
  const currentStats = stats.find((s) => s.resourceType === selectedResource);
  const currentAnomalies = anomalies.filter(
    (a) => a.resourceType === selectedResource
  );

  const formatChartData = () => {
    if (!currentTrend) return [];

    return currentTrend.data.map((d) => ({
      timestamp: format(
        new Date(d.timestamp),
        timeRange === "24h" ? "HH:mm" : "MMM dd"
      ),
      level: d.level,
      predicted: d.predictedLevel,
    }));
  };

  const statsCards = currentStats
    ? [
        {
          title: "Average Level",
          value: currentStats.average.toFixed(1),
          icon: Activity,
          description: `Min: ${currentStats.min.toFixed(
            1
          )} | Max: ${currentStats.max.toFixed(1)}`,
        },
        {
          title: "Std Deviation",
          value: currentStats.stdDeviation.toFixed(2),
          icon: BarChart3,
          description: `Median: ${currentStats.median.toFixed(1)}`,
        },
        {
          title: "Total Consumption",
          value: currentStats.totalConsumption.toFixed(1),
          icon: TrendingDown,
          description: `Over ${timeRange}`,
        },
        {
          title: "Peak Usage Events",
          value: currentStats.peakUsageTimes.length.toString(),
          icon: Zap,
          description: `Identified peaks`,
        },
      ]
    : [];

  const peakUsageData = currentStats?.peakUsageTimes.map((p) => ({
    timestamp: format(
      new Date(p.timestamp),
      timeRange === "24h" ? "HH:mm" : "MMM dd HH:mm"
    ),
    level: p.level,
  }));

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold tracking-tight textgradientmars">
            Analytics Dashboard
          </h1>
          <p className="text-muted-foreground">
            Real-time insights, predictions, and anomaly detection
          </p>
        </div>
        <div className="flex gap-2 items-center">
          <Select
            value={selectedResource}
            onValueChange={(v: ResourceType) => setSelectedResource(v)}
          >
            <SelectTrigger className="w-[200px]">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              {resourceTypeOptions.map((type) => (
                <SelectItem key={type} value={type}>
                  {type
                    .replace(/_/g, " ")
                    .replace(/\b\w/g, (l) => l.toUpperCase())}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
          <Select
            value={timeRange}
            onValueChange={(v: TimeRange) => setTimeRange(v)}
          >
            <SelectTrigger className="w-[150px]">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="24h">Last 24 Hours</SelectItem>
              <SelectItem value="7d">Last 7 Days</SelectItem>
              <SelectItem value="30d">Last 30 Days</SelectItem>
              <SelectItem value="90d">Last 90 Days</SelectItem>
            </SelectContent>
          </Select>
          <Button
            onClick={refresh}
            size="icon"
            variant="outline"
            disabled={isLoading}
          >
            <RefreshCw
              className={`h-4 w-4 ${isLoading ? "animate-spin" : ""}`}
            />
          </Button>
        </div>
      </div>

      {/* Trend Overview Card */}
      {currentTrend && (
        <Card className="border-primary/20">
          <CardHeader>
            <div className="flex items-center justify-between">
              <div>
                <CardTitle className="flex items-center gap-2">
                  {currentTrend.trend === "increasing" && (
                    <TrendingUp className="h-5 w-5 text-green-500" />
                  )}
                  {currentTrend.trend === "decreasing" && (
                    <TrendingDown className="h-5 w-5 text-destructive" />
                  )}
                  {currentTrend.trend === "stable" && (
                    <Activity className="h-5 w-5 text-blue-500" />
                  )}
                  Trend: {currentTrend.trend.toUpperCase()}
                </CardTitle>
                <CardDescription>
                  Change: {currentTrend.changePercentage > 0 ? "+" : ""}
                  {currentTrend.changePercentage.toFixed(2)}% | Avg Consumption:{" "}
                  {currentTrend.averageConsumption.toFixed(2)}/period
                </CardDescription>
              </div>
              <Badge
                variant={
                  currentTrend.trend === "decreasing"
                    ? "destructive"
                    : "default"
                }
              >
                {selectedResource.replace(/_/g, " ").toUpperCase()}
              </Badge>
            </div>
          </CardHeader>
        </Card>
      )}

      {/* Statistics Cards */}
      {currentStats && (
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
          {statsCards.map((card, idx) => (
            <Card key={idx}>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">
                  {card.title}
                </CardTitle>
                <card.icon className="h-4 w-4 text-primary" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold textgradientmars">
                  {card.value}
                </div>
                <p className="text-xs text-muted-foreground">
                  {card.description}
                </p>
              </CardContent>
            </Card>
          ))}
        </div>
      )}

      {/* Tabs for Different Views */}
      <Tabs defaultValue="trends" className="space-y-4">
        <TabsList className="grid w-full grid-cols-4">
          <TabsTrigger value="trends" className="flex items-center gap-2">
            <LineChartIcon className="h-4 w-4" />
            Trends & Predictions
          </TabsTrigger>
          <TabsTrigger value="peaks" className="flex items-center gap-2">
            <Zap className="h-4 w-4" />
            Peak Usage
          </TabsTrigger>
          <TabsTrigger value="anomalies" className="flex items-center gap-2">
            <AlertTriangle className="h-4 w-4" />
            Anomalies ({currentAnomalies.length})
          </TabsTrigger>
          <TabsTrigger value="stats" className="flex items-center gap-2">
            <BarChart3 className="h-4 w-4" />
            Statistics
          </TabsTrigger>
        </TabsList>

        {/* Trends with Predictions */}
        <TabsContent value="trends" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Resource Level History with Predictions</CardTitle>
              <CardDescription>
                Linear regression predictions based on historical consumption
                patterns
              </CardDescription>
            </CardHeader>
            <CardContent>
              {isLoading ? (
                <div className="h-[400px] flex items-center justify-center">
                  <RefreshCw className="h-8 w-8 animate-spin text-primary" />
                </div>
              ) : (
                <ChartContainer config={chartConfig} className="h-[400px]">
                  <ResponsiveContainer width="100%" height="100%">
                    <AreaChart data={formatChartData()}>
                      <defs>
                        <linearGradient
                          id="colorLevel"
                          x1="0"
                          y1="0"
                          x2="0"
                          y2="1"
                        >
                          <stop
                            offset="5%"
                            stopColor="hsl(var(--chart-1))"
                            stopOpacity={0.3}
                          />
                          <stop
                            offset="95%"
                            stopColor="hsl(var(--chart-1))"
                            stopOpacity={0}
                          />
                        </linearGradient>
                        <linearGradient
                          id="colorPredicted"
                          x1="0"
                          y1="0"
                          x2="0"
                          y2="1"
                        >
                          <stop
                            offset="5%"
                            stopColor="hsl(var(--chart-2))"
                            stopOpacity={0.3}
                          />
                          <stop
                            offset="95%"
                            stopColor="hsl(var(--chart-2))"
                            stopOpacity={0}
                          />
                        </linearGradient>
                      </defs>
                      <CartesianGrid
                        strokeDasharray="3 3"
                        className="stroke-border"
                        opacity={0.3}
                      />
                      <XAxis
                        dataKey="timestamp"
                        className="text-xs"
                        tick={{ fill: "hsl(var(--muted-foreground))" }}
                        stroke="hsl(var(--border))"
                      />
                      <YAxis
                        className="text-xs"
                        tick={{ fill: "hsl(var(--muted-foreground))" }}
                        stroke="hsl(var(--border))"
                      />
                      <Tooltip
                        contentStyle={{
                          backgroundColor: "hsl(var(--card))",
                          border: "1px solid hsl(var(--border))",
                          borderRadius: "0.75rem",
                        }}
                      />
                      <Legend />
                      <Area
                        type="monotone"
                        dataKey="level"
                        stroke="hsl(var(--chart-1))"
                        fill="url(#colorLevel)"
                        strokeWidth={3}
                        name="Actual Level"
                      />
                      <Area
                        type="monotone"
                        dataKey="predicted"
                        stroke="hsl(var(--chart-2))"
                        fill="url(#colorPredicted)"
                        strokeWidth={2}
                        strokeDasharray="5 5"
                        name="Predicted Level"
                      />
                    </AreaChart>
                  </ResponsiveContainer>
                </ChartContainer>
              )}
            </CardContent>
          </Card>
        </TabsContent>

        {/* Peak Usage Times */}
        <TabsContent value="peaks" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Peak Usage Events</CardTitle>
              <CardDescription>
                Times when resource consumption was highest
              </CardDescription>
            </CardHeader>
            <CardContent>
              {isLoading ? (
                <div className="h-[400px] flex items-center justify-center">
                  <RefreshCw className="h-8 w-8 animate-spin text-primary" />
                </div>
              ) : peakUsageData && peakUsageData.length > 0 ? (
                <ChartContainer config={chartConfig} className="h-[400px]">
                  <ResponsiveContainer width="100%" height="100%">
                    <BarChart data={peakUsageData}>
                      <CartesianGrid
                        strokeDasharray="3 3"
                        className="stroke-border"
                        opacity={0.3}
                      />
                      <XAxis
                        dataKey="timestamp"
                        className="text-xs"
                        tick={{ fill: "hsl(var(--muted-foreground))" }}
                        stroke="hsl(var(--border))"
                      />
                      <YAxis
                        className="text-xs"
                        tick={{ fill: "hsl(var(--muted-foreground))" }}
                        stroke="hsl(var(--border))"
                      />
                      <Tooltip
                        contentStyle={{
                          backgroundColor: "hsl(var(--card))",
                          border: "1px solid hsl(var(--border))",
                          borderRadius: "0.75rem",
                        }}
                      />
                      <Bar
                        dataKey="level"
                        fill="hsl(var(--chart-1))"
                        radius={[8, 8, 0, 0]}
                      />
                    </BarChart>
                  </ResponsiveContainer>
                </ChartContainer>
              ) : (
                <div className="h-[400px] flex items-center justify-center text-muted-foreground">
                  No peak usage data available for this time range
                </div>
              )}
            </CardContent>
          </Card>
        </TabsContent>

        {/* Anomalies Detection */}
        <TabsContent value="anomalies" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Detected Anomalies</CardTitle>
              <CardDescription>
                Unusual patterns detected using z-score analysis and leak
                detection algorithms
              </CardDescription>
            </CardHeader>
            <CardContent>
              {isLoading ? (
                <div className="h-[400px] flex items-center justify-center">
                  <RefreshCw className="h-8 w-8 animate-spin text-primary" />
                </div>
              ) : currentAnomalies.length > 0 ? (
                <div className="space-y-4">
                  {currentAnomalies.map((anomaly) => (
                    <Card key={anomaly.id} className="border-destructive/20">
                      <CardHeader className="pb-3">
                        <div className="flex items-start justify-between">
                          <div className="flex items-center gap-2">
                            {getAnomalyIcon(anomaly.type)}
                            <CardTitle className="text-base">
                              {anomaly.type
                                .replace(/_/g, " ")
                                .replace(/\b\w/g, (l) => l.toUpperCase())}
                            </CardTitle>
                          </div>
                          <Badge variant={getSeverityColor(anomaly.severity)}>
                            {anomaly.severity.toUpperCase()}
                          </Badge>
                        </div>
                        <CardDescription className="text-xs">
                          {format(new Date(anomaly.timestamp), "PPpp")}
                        </CardDescription>
                      </CardHeader>
                      <CardContent className="space-y-2">
                        <p className="text-sm">{anomaly.description}</p>
                        <div className="grid grid-cols-3 gap-4 text-xs">
                          <div className="glasscard p-3 rounded-lg">
                            <p className="text-muted-foreground">Expected</p>
                            <p className="font-semibold">
                              {anomaly.expectedValue.toFixed(2)}
                            </p>
                          </div>
                          <div className="glasscard p-3 rounded-lg">
                            <p className="text-muted-foreground">Actual</p>
                            <p className="font-semibold text-destructive">
                              {anomaly.actualValue.toFixed(2)}
                            </p>
                          </div>
                          <div className="glasscard p-3 rounded-lg">
                            <p className="text-muted-foreground">Deviation</p>
                            <p className="font-semibold">
                              {anomaly.deviation.toFixed(2)}σ
                            </p>
                          </div>
                        </div>
                      </CardContent>
                    </Card>
                  ))}
                </div>
              ) : (
                <div className="h-[400px] flex items-center justify-center text-muted-foreground">
                  <div className="text-center">
                    <Activity className="h-12 w-12 mx-auto mb-4 opacity-50" />
                    <p>
                      No anomalies detected for this resource in the selected
                      time range
                    </p>
                    <p className="text-xs mt-2">This is good news!</p>
                  </div>
                </div>
              )}
            </CardContent>
          </Card>
        </TabsContent>

        {/* Detailed Statistics */}
        <TabsContent value="stats" className="space-y-4">
          {currentStats ? (
            <div className="grid gap-4 md:grid-cols-2">
              <Card>
                <CardHeader>
                  <CardTitle>Distribution Statistics</CardTitle>
                  <CardDescription>
                    Statistical analysis of resource levels
                  </CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="space-y-2">
                    <div className="flex justify-between items-center">
                      <span className="text-sm text-muted-foreground">
                        Minimum
                      </span>
                      <span className="font-semibold">
                        {currentStats.min.toFixed(2)}
                      </span>
                    </div>
                    <div className="flex justify-between items-center">
                      <span className="text-sm text-muted-foreground">
                        Maximum
                      </span>
                      <span className="font-semibold">
                        {currentStats.max.toFixed(2)}
                      </span>
                    </div>
                    <div className="flex justify-between items-center">
                      <span className="text-sm text-muted-foreground">
                        Average
                      </span>
                      <span className="font-semibold textgradientmars">
                        {currentStats.average.toFixed(2)}
                      </span>
                    </div>
                    <div className="flex justify-between items-center">
                      <span className="text-sm text-muted-foreground">
                        Median
                      </span>
                      <span className="font-semibold">
                        {currentStats.median.toFixed(2)}
                      </span>
                    </div>
                    <div className="flex justify-between items-center">
                      <span className="text-sm text-muted-foreground">
                        Standard Deviation
                      </span>
                      <span className="font-semibold">
                        {currentStats.stdDeviation.toFixed(2)}
                      </span>
                    </div>
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle>Consumption Analysis</CardTitle>
                  <CardDescription>
                    Total consumption over {timeRange}
                  </CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="space-y-2">
                    <div className="flex justify-between items-center">
                      <span className="text-sm text-muted-foreground">
                        Total Consumption
                      </span>
                      <span className="font-semibold textgradientmars">
                        {currentStats.totalConsumption.toFixed(2)}
                      </span>
                    </div>
                    <div className="flex justify-between items-center">
                      <span className="text-sm text-muted-foreground">
                        Peak Events Count
                      </span>
                      <span className="font-semibold">
                        {currentStats.peakUsageTimes.length}
                      </span>
                    </div>
                    <div className="flex justify-between items-center">
                      <span className="text-sm text-muted-foreground">
                        Resource Type
                      </span>
                      <Badge>
                        {currentStats.resourceType.replace(/_/g, " ")}
                      </Badge>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>
          ) : (
            <Card>
              <CardContent className="h-[400px] flex items-center justify-center">
                <div className="text-center text-muted-foreground">
                  <BarChart3 className="h-12 w-12 mx-auto mb-4 opacity-50" />
                  <p>No statistics available for this resource</p>
                </div>
              </CardContent>
            </Card>
          )}
        </TabsContent>
      </Tabs>
    </div>
  );
};
