import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';
import { ParkingFeed } from '@/hooks/useThingSpeak';
import { format } from 'date-fns';

interface VehicleChartProps {
  feeds: ParkingFeed[];
}

export function VehicleChart({ feeds }: VehicleChartProps) {
  const data = feeds
    .filter(f => f.field1 !== null)
    .map(f => ({
      time: format(new Date(f.created_at), 'HH:mm'),
      vehicles: parseInt(f.field1 || '0', 10),
    }));

  return (
    <div className="rounded-xl border border-border bg-card p-4 sm:p-6">
      <h3 className="text-sm font-heading text-muted-foreground uppercase tracking-wider mb-4">
        Vehicle Entry History
      </h3>
      <div className="h-48 sm:h-64">
        <ResponsiveContainer width="100%" height="100%">
          <LineChart data={data}>
            <CartesianGrid strokeDasharray="3 3" stroke="hsl(220 14% 18%)" />
            <XAxis
              dataKey="time"
              tick={{ fill: 'hsl(215 12% 50%)', fontSize: 11, fontFamily: 'JetBrains Mono' }}
              axisLine={{ stroke: 'hsl(220 14% 18%)' }}
              tickLine={false}
            />
            <YAxis
              tick={{ fill: 'hsl(215 12% 50%)', fontSize: 11, fontFamily: 'JetBrains Mono' }}
              axisLine={{ stroke: 'hsl(220 14% 18%)' }}
              tickLine={false}
              allowDecimals={false}
            />
            <Tooltip
              contentStyle={{
                backgroundColor: 'hsl(220 18% 10%)',
                border: '1px solid hsl(220 14% 18%)',
                borderRadius: '8px',
                fontFamily: 'JetBrains Mono',
                fontSize: '12px',
                color: 'hsl(210 20% 92%)',
              }}
            />
            <Line
              type="monotone"
              dataKey="vehicles"
              stroke="hsl(160 84% 44%)"
              strokeWidth={2}
              dot={{ fill: 'hsl(160 84% 44%)', r: 3 }}
              activeDot={{ r: 5, fill: 'hsl(160 84% 44%)' }}
            />
          </LineChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
}
