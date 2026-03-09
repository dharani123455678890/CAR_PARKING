import { useThingSpeak } from '@/hooks/useThingSpeak';
import { StatusCard } from '@/components/StatusCard';
import { ParkingSlot } from '@/components/ParkingSlot';
import { VehicleChart } from '@/components/VehicleChart';
import { Car, ParkingCircle, Activity, Wifi, WifiOff, AlertTriangle } from 'lucide-react';
import { motion } from 'framer-motion';

const Index = () => {
  const data = useThingSpeak();

  return (
    <div className="min-h-screen bg-background px-4 py-6 sm:px-6 lg:px-8 max-w-3xl mx-auto">
      {/* Header */}
      <motion.header
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        className="flex items-center justify-between mb-6"
      >
        <div>
          <h1 className="text-xl sm:text-2xl font-heading font-bold text-foreground tracking-tight">
            Smart Parking
          </h1>
          <p className="text-xs text-muted-foreground mt-0.5">IoT Dashboard • 5 Slots</p>
        </div>
        <div className="flex items-center gap-2">
          {data.error ? (
            <div className="flex items-center gap-1.5 text-accent text-xs font-heading">
              <AlertTriangle className="w-3.5 h-3.5" />
              <span>Demo</span>
            </div>
          ) : (
            <div className="flex items-center gap-1.5 text-success text-xs font-heading">
              <Wifi className="w-3.5 h-3.5" />
              <span>Live</span>
              <motion.div
                className="w-2 h-2 rounded-full bg-success"
                animate={{ opacity: [1, 0.3, 1] }}
                transition={{ duration: 1.5, repeat: Infinity }}
              />
            </div>
          )}
        </div>
      </motion.header>

      {data.isLoading ? (
        <div className="flex items-center justify-center h-64">
          <motion.div
            animate={{ rotate: 360 }}
            transition={{ duration: 1, repeat: Infinity, ease: 'linear' }}
            className="w-8 h-8 border-2 border-primary border-t-transparent rounded-full"
          />
        </div>
      ) : (
        <div className="space-y-5">
          {/* Stats */}
          <div className="grid grid-cols-3 gap-3">
            <StatusCard title="Total" value={data.totalSpaces} icon={ParkingCircle} />
            <StatusCard title="Free" value={data.availableSpaces} icon={ParkingCircle} variant="success" />
            <StatusCard title="Cars" value={data.totalVehicles} icon={Car} variant={data.availableSpaces === 0 ? 'danger' : 'warning'} />
          </div>

          {/* Occupancy Bar */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="rounded-xl border border-border bg-card p-4"
          >
            <div className="flex items-center justify-between mb-2">
              <span className="text-xs font-heading text-muted-foreground uppercase tracking-wider">Occupancy</span>
              <span className="text-sm font-heading font-bold text-foreground">{data.occupancyPercent}%</span>
            </div>
            <div className="h-2.5 bg-secondary rounded-full overflow-hidden">
              <motion.div
                className={`h-full rounded-full ${
                  data.occupancyPercent >= 80 ? 'bg-destructive' : data.occupancyPercent >= 50 ? 'bg-accent' : 'bg-success'
                }`}
                initial={{ width: 0 }}
                animate={{ width: `${data.occupancyPercent}%` }}
                transition={{ duration: 1, ease: 'easeOut' }}
              />
            </div>
          </motion.div>

          {/* Parking Map */}
          <div>
            <h2 className="text-xs font-heading text-muted-foreground uppercase tracking-wider mb-3 flex items-center gap-2">
              <Activity className="w-3.5 h-3.5" /> Live Parking Map
            </h2>
            <div className="grid grid-cols-3 gap-3">
              {data.slots.map((slot, i) => (
                <ParkingSlot key={i} slotNumber={i + 1} isOccupied={slot.occupied} isBlocked={slot.blocked} />
              ))}
            </div>
          </div>

          {/* Chart */}
          <VehicleChart feeds={data.feeds} />

          {/* Footer */}
          {data.lastUpdated && (
            <p className="text-center text-[10px] text-muted-foreground font-heading pb-4">
              Last updated: {data.lastUpdated.toLocaleTimeString()} • Auto-refresh: 15s
            </p>
          )}
        </div>
      )}
    </div>
  );
};

export default Index;
