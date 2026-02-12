'use client'

import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
} from 'recharts'
import { Card } from '@/components/ui/card'
import { mockBookingData } from '@/lib/mockData'

export function BookingTrendsChart() {
  return (
    <Card className="p-6 border border-border">
      <div className="mb-6">
        <h3 className="text-lg font-semibold text-foreground">7-Day Booking Trends</h3>
        <p className="text-sm text-muted-foreground">Completed vs Confirmed vs No-shows</p>
      </div>
      <ResponsiveContainer width="100%" height={300}>
        <LineChart data={mockBookingData}>
          <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" />
          <XAxis
            dataKey="date"
            stroke="hsl(var(--muted-foreground))"
            style={{ fontSize: '12px' }}
          />
          <YAxis stroke="hsl(var(--muted-foreground))" style={{ fontSize: '12px' }} />
          <Tooltip
            contentStyle={{
              backgroundColor: 'hsl(var(--card))',
              border: `1px solid hsl(var(--border))`,
              borderRadius: '8px',
            }}
            labelStyle={{ color: 'hsl(var(--foreground))' }}
          />
          <Legend />
          <Line
            type="monotone"
            dataKey="completed"
            stroke="hsl(217, 91%, 59.8%)"
            strokeWidth={2}
            dot={{ fill: 'hsl(217, 91%, 59.8%)', r: 4 }}
            name="Completed"
          />
          <Line
            type="monotone"
            dataKey="confirmed"
            stroke="hsl(173, 58%, 39%)"
            strokeWidth={2}
            dot={{ fill: 'hsl(173, 58%, 39%)', r: 4 }}
            name="Confirmed"
          />
          <Line
            type="monotone"
            dataKey="noshow"
            stroke="hsl(0, 84%, 60%)"
            strokeWidth={2}
            dot={{ fill: 'hsl(0, 84%, 60%)', r: 4 }}
            name="No-show"
          />
        </LineChart>
      </ResponsiveContainer>
    </Card>
  )
}
