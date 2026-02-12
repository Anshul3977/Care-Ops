'use client'

import {
  PieChart,
  Pie,
  Cell,
  Legend,
  Tooltip,
  ResponsiveContainer,
} from 'recharts'
import { Card } from '@/components/ui/card'
import { mockLeadSourceData } from '@/lib/mockData'

export function LeadSourcesChart() {
  return (
    <Card className="p-6 border border-border">
      <div className="mb-6">
        <h3 className="text-lg font-semibold text-foreground">Lead Sources</h3>
        <p className="text-sm text-muted-foreground">Distribution by channel</p>
      </div>
      <ResponsiveContainer width="100%" height={300}>
        <PieChart>
          <Pie
            data={mockLeadSourceData}
            cx="50%"
            cy="50%"
            labelLine={false}
            label={({ name, value }) => `${name}: ${value}%`}
            outerRadius={80}
            fill="#8884d8"
            dataKey="value"
          >
            {mockLeadSourceData.map((entry, index) => (
              <Cell key={`cell-${index}`} fill={entry.fill} />
            ))}
          </Pie>
          <Tooltip
            contentStyle={{
              backgroundColor: 'hsl(var(--card))',
              border: `1px solid hsl(var(--border))`,
              borderRadius: '8px',
            }}
            labelStyle={{ color: 'hsl(var(--foreground))' }}
            formatter={(value) => `${value}%`}
          />
          <Legend />
        </PieChart>
      </ResponsiveContainer>
    </Card>
  )
}
