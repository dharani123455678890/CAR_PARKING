import { motion } from 'framer-motion';
import { Car } from 'lucide-react';

interface ParkingSlotProps {
  slotNumber: number;
  isOccupied: boolean;
}

export function ParkingSlot({ slotNumber, isOccupied }: ParkingSlotProps) {
  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.9 }}
      animate={{ opacity: 1, scale: 1 }}
      transition={{ delay: slotNumber * 0.1 }}
      className={`relative rounded-xl border-2 p-6 sm:p-8 flex flex-col items-center justify-center gap-3 transition-all duration-500 ${
        isOccupied
          ? 'border-destructive/50 bg-destructive/10 glow-red'
          : 'border-success/50 bg-success/10 glow-green'
      }`}
    >
      <div className="text-xs font-heading text-muted-foreground uppercase tracking-widest">
        Slot {slotNumber}
      </div>

      {isOccupied ? (
        <motion.div
          key="occupied"
          initial={{ scale: 0 }}
          animate={{ scale: 1 }}
          className="flex flex-col items-center gap-2"
        >
          <Car className="w-10 h-10 sm:w-12 sm:h-12 text-destructive" />
          <span className="text-sm font-heading font-semibold text-destructive">Occupied</span>
        </motion.div>
      ) : (
        <motion.div
          key="free"
          initial={{ scale: 0 }}
          animate={{ scale: 1 }}
          className="flex flex-col items-center gap-2"
        >
          <div className="w-10 h-10 sm:w-12 sm:h-12 rounded-full border-2 border-dashed border-success/50 flex items-center justify-center">
            <span className="text-success text-lg font-bold">P</span>
          </div>
          <span className="text-sm font-heading font-semibold text-success">Available</span>
        </motion.div>
      )}

      <motion.div
        className={`absolute top-3 right-3 w-2.5 h-2.5 rounded-full ${
          isOccupied ? 'bg-destructive' : 'bg-success'
        }`}
        animate={{ opacity: [1, 0.3, 1] }}
        transition={{ duration: 2, repeat: Infinity }}
      />
    </motion.div>
  );
}
