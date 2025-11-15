import { memo } from 'react'
import { Card } from '@/components/ui/card'
import { cn } from '@/lib/utils'
import { motion } from 'framer-motion'

interface MetricCardProps {
  label: string
  value: string | number
  icon: React.ReactNode
  suffix?: string
  className?: string
}

export const MetricCard = memo(({ label, value, icon, suffix = '', className }: MetricCardProps) => {
  return (
    <Card className={cn('p-4 flex items-center gap-4', className)}>
      <div className="text-accent">{icon}</div>
      <div className="flex-1">
        <div className="text-xs uppercase tracking-wide text-muted-foreground font-medium">
          {label}
        </div>
        <motion.div 
          key={value}
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.3 }}
          className="text-3xl font-bold text-foreground"
        >
          {value}{suffix}
        </motion.div>
      </div>
    </Card>
  )
})

MetricCard.displayName = 'MetricCard'
