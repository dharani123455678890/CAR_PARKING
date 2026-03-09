import { motion } from 'framer-motion';
import { Car, Lock } from 'lucide-react';

interface ParkingSlotProps {
  slotNumber: number;
  isOccupied: boolean;
  isBlocked: boolean;
}

export function ParkingSlot({ slotNumber, isOccupied, isBlocked }: ParkingSlotProps) {
  if (isBlocked) {
    return (
      <motion.div
        initial={{ opacity: 0, scale: 0.9 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ delay: slotNumber * 0.08 }}
        className="relative rounded-xl border-2 border-accent/40 bg-accent/5 p-4 sm:p-6 flex flex-col items-center justify-center gap-2"
      >
        <div className="text-[10px] font-heading text-muted-foreground uppercase tracking-widest">
          Slot {slotNumber}
        </div>
        <Lock className="w-8 h-8 sm:w-10 sm:h-10 text-accent" />
        <span className="text-xs font-heading font-semibold text-accent">Allocated</span>
        <motion.div
          className="absolute top-2 right-2 w-2 h-2 rounded-full bg-accent"
          animate={{ opacity: [1, 0.4, 1] }}
          transition={{ duration: 2, repeat: Infinity }}
        />
      </motion.div>
    );
  }

  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.9 }}
      animate={{ opacity: 1, scale: 1 }}
      transition={{ delay: slotNumber * 0.08 }}
      className={`relative rounded-xl border-2 p-4 sm:p-6 flex flex-col items-center justify-center gap-2 transition-all duration-500 ${
        isOccupied
          ? 'border-destructive/50 bg-destructive/10 glow-red'
          : 'border-success/50 bg-success/10 glow-green'
      }`}
    >
      <div className="text-[10px] font-heading text-muted-foreground uppercase tracking-widest">
        Slot {slotNumber}
      </div>

      {isOccupied ? (
        <motion.div key="occupied" initial={{ scale: 0 }} animate={{ scale: 1 }} className="flex flex-col items-center gap-1.5">
          <Car className="w-8 h-8 sm:w-10 sm:h-10 text-destructive" />
          <span className="text-xs font-heading font-semibold text-destructive">Occupied</span>
        </motion.div>
      ) : (
        <motion.div key="free" initial={{ scale: 0 }} animate={{ scale: 1 }} className="flex flex-col items-center gap-1.5">
          <div className="w-8 h-8 sm:w-10 sm:h-10 rounded-full border-2 border-dashed border-success/50 flex items-center justify-center">
            <span className="text-success text-sm font-bold">P</span>
          </div>
          <span className="text-xs font-heading font-semibold text-success">Available</span>
        </motion.div>
      )}

      <motion.div
        className={`absolute top-2 right-2 w-2 h-2 rounded-full ${isOccupied ? 'bg-destructive' : 'bg-success'}`}
        animate={{ opacity: [1, 0.3, 1] }}
        transition={{ duration: 2, repeat: Infinity }}
      />
    </motion.div>
  );
}
