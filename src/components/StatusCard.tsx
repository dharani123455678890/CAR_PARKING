import { motion } from 'framer-motion';
import { LucideIcon } from 'lucide-react';

interface StatusCardProps {
  title: string;
  value: string | number;
  icon: LucideIcon;
  variant?: 'default' | 'success' | 'warning' | 'danger';
}

const variantStyles = {
  default: 'border-border',
  success: 'border-success/30 glow-green',
  warning: 'border-accent/30',
  danger: 'border-destructive/30 glow-red',
};

const iconVariants = {
  default: 'text-primary',
  success: 'text-success',
  warning: 'text-accent',
  danger: 'text-destructive',
};

export function StatusCard({ title, value, icon: Icon, variant = 'default' }: StatusCardProps) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className={`rounded-xl border bg-card p-4 sm:p-5 ${variantStyles[variant]}`}
    >
      <div className="flex items-center justify-between">
        <div>
          <p className="text-xs sm:text-sm text-muted-foreground uppercase tracking-wider font-heading">{title}</p>
          <p className="text-2xl sm:text-3xl font-bold font-heading mt-1 text-card-foreground">{value}</p>
        </div>
        <div className={`p-2.5 sm:p-3 rounded-lg bg-secondary ${iconVariants[variant]}`}>
          <Icon className="w-5 h-5 sm:w-6 sm:h-6" />
        </div>
      </div>
    </motion.div>
  );
}
