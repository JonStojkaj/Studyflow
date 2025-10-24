import { useState } from "react";
import { Card } from "./ui/card";
import { Button } from "./ui/button";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "./ui/select";
import { Checkbox } from "./ui/checkbox";
import { Label } from "./ui/label";
import { Input } from "./ui/input";
import {
  BarChart,
  Bar,
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
} from "recharts";

// Custom Y-Axis Tick Component
const CustomYAxisTick = ({ x, y, payload }: any) => {
  return (
    <g transform={`translate(${x},${y})`}>
      <text x={0} y={0} dy={0} textAnchor="end" fill="#666" fontSize={12}>
        <tspan x={0} dy={-2}>{payload.value}</tspan>
        <tspan x={0} dy={14} fontSize={10}>min</tspan>
      </text>
    </g>
  );
};

// Mock data
const generateMockData = (days: number) => {
  const data = [];
  const dayNames = ["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"];
  
  for (let i = days - 1; i >= 0; i--) {
    const date = new Date();
    date.setDate(date.getDate() - i);
    const dayName = dayNames[date.getDay() === 0 ? 6 : date.getDay() - 1];
    
    data.push({
      date: date.toISOString().split("T")[0],
      day: dayName,
      minutes: Math.floor(Math.random() * 180) + 30,
      dayOfWeek: date.getDay(),
    });
  }
  
  return data;
};

export function StatsTab() {
  const [timeframe, setTimeframe] = useState("7");
  const [customDays, setCustomDays] = useState("");
  const [excludedDays, setExcludedDays] = useState<number[]>([]);

  const displayDays = timeframe === "custom" && customDays ? parseInt(customDays) : parseInt(timeframe);
  const allData = generateMockData(displayDays);

  const toggleDay = (day: number) => {
    setExcludedDays(prev =>
      prev.includes(day) ? prev.filter(d => d !== day) : [...prev, day]
    );
  };

  const filteredData = allData.filter((item) => {
    return !excludedDays.includes(item.dayOfWeek);
  });

  const averageMinutes =
    filteredData.length > 0
      ? Math.round(
          filteredData.reduce((sum, item) => sum + item.minutes, 0) /
            filteredData.length
        )
      : 0;

  const dayButtons = [
    { label: 'M', value: 1, name: 'Monday' },
    { label: 'T', value: 2, name: 'Tuesday' },
    { label: 'W', value: 3, name: 'Wednesday' },
    { label: 'T', value: 4, name: 'Thursday' },
    { label: 'F', value: 5, name: 'Friday' },
    { label: 'S', value: 6, name: 'Saturday' },
    { label: 'S', value: 0, name: 'Sunday' },
  ];

  return (
    <div className="space-y-6">
      {/* Controls */}
      <Card className="p-6">
        <div className="space-y-4">
          <div>
            <Label>Timeframe</Label>
            <Select value={timeframe} onValueChange={setTimeframe}>
              <SelectTrigger className="w-full mt-2">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="7">Last 7 Days</SelectItem>
                <SelectItem value="14">Last 14 Days</SelectItem>
                <SelectItem value="30">Last 30 Days</SelectItem>
                <SelectItem value="90">Last 90 Days</SelectItem>
                <SelectItem value="custom">Custom</SelectItem>
              </SelectContent>
            </Select>
          </div>

          {timeframe === "custom" && (
            <div>
              <Label>Number of Days</Label>
              <Input
                type="number"
                min="1"
                max="365"
                placeholder="Enter number of days"
                value={customDays}
                onChange={(e) => setCustomDays(e.target.value)}
                className="mt-2"
              />
            </div>
          )}

          <div className="space-y-3">
            <Label>Exclude Days</Label>
            <div className="flex gap-1.5">
              {dayButtons.map((day) => (
                <Button
                  key={`${day.label}-${day.value}`}
                  variant={excludedDays.includes(day.value) ? "outline" : "default"}
                  size="sm"
                  onClick={() => toggleDay(day.value)}
                  className="flex-1 min-w-0 px-2"
                  title={day.name}
                >
                  {day.label}
                </Button>
              ))}
            </div>
          </div>
        </div>
      </Card>

      {/* Average Study Time */}
      <Card className="p-6 bg-gradient-to-r from-blue-500 to-purple-500 text-white border-0">
        <div className="text-center">
          <div className="text-sm opacity-90 mb-2">Average Study Time</div>
          <div className="text-5xl">{averageMinutes}</div>
          <div className="text-sm opacity-90 mt-1">minutes per day</div>
        </div>
      </Card>

      {/* Average Line Chart */}
      <Card className="p-6">
        <h3 className="mb-4">Study Time Trend</h3>
        <ResponsiveContainer width="100%" height={350}>
          <LineChart data={filteredData} margin={{ top: 20, right: 10, left: -10, bottom: 5 }}>
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis dataKey="day" />
            <YAxis 
              tick={<CustomYAxisTick />}
              width={55}
            />
            <Tooltip
              formatter={(value) => [`${value} min`, "Study Time"]}
              labelFormatter={(label) => `Day: ${label}`}
            />
            <Line
              type="monotone"
              dataKey="minutes"
              stroke="#8b5cf6"
              strokeWidth={3}
              dot={{ fill: "#8b5cf6", r: 5 }}
            />
          </LineChart>
        </ResponsiveContainer>
      </Card>

      {/* Daily Bar Chart */}
      <Card className="p-6">
        <h3 className="mb-4">Daily Study Time</h3>
        <ResponsiveContainer width="100%" height={350}>
          <BarChart data={filteredData} margin={{ top: 20, right: 10, left: -10, bottom: 5 }}>
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis dataKey="day" />
            <YAxis 
              tick={<CustomYAxisTick />}
              width={55}
            />
            <Tooltip
              formatter={(value) => [`${value} min`, "Study Time"]}
              labelFormatter={(label) => `Day: ${label}`}
            />
            <Bar dataKey="minutes" fill="#8b5cf6" radius={[8, 8, 0, 0]} />
          </BarChart>
        </ResponsiveContainer>
      </Card>
    </div>
  );
}