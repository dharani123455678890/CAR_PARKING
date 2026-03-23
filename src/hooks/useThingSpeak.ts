import { useState, useEffect, useCallback } from 'react';

const THINGSPEAK_CHANNEL_ID = '3308638';
const THINGSPEAK_READ_API_KEY = 'ZYPQRF2MS2WEBFKK';
const POLL_INTERVAL = 2000;

export interface ParkingFeed {
  created_at: string;
  entry_id: number;
  field1: string | null;
  field2: string | null;
  field3: string | null;
}

export interface SlotData {
  occupied: boolean;
  blocked: boolean;
}

export interface ParkingData {
  totalVehicles: number;
  slots: SlotData[];
  totalSpaces: number;
  allocatedSpaces: number;
  freeSpaces: number;
  feeds: ParkingFeed[];
  lastUpdated: Date | null;
  isLoading: boolean;
  error: string | null;
}

// Slots 3,4,5,6 (indexes 2-5) are always allocated
const BLOCKED_INDEXES = [2, 3, 4, 5];
const TOTAL_SLOTS = 6;

function generateDemoFeeds(): ParkingFeed[] {
  const feeds: ParkingFeed[] = [];
  const now = Date.now();
  for (let i = 0; i < 30; i++) {
    const t = new Date(now - (30 - i) * 60000);
    const s1 = Math.random() > 0.5 ? '1' : '0';
    const s2 = Math.random() > 0.5 ? '1' : '0';
    feeds.push({
      created_at: t.toISOString(),
      entry_id: i + 1,
      field1: s1,
      field2: s2,
      field3: null,
    });
  }
  return feeds;
}

export function useThingSpeak(): ParkingData {
  const [feeds, setFeeds] = useState<ParkingFeed[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [lastUpdated, setLastUpdated] = useState<Date | null>(null);
  const [useDemoData, setUseDemoData] = useState(false);

  const fetchData = useCallback(async () => {
    try {
      const res = await fetch(
        `https://api.thingspeak.com/channels/${THINGSPEAK_CHANNEL_ID}/feeds.json?api_key=${THINGSPEAK_READ_API_KEY}&results=50`
      );
      if (!res.ok) throw new Error(`HTTP ${res.status}`);
      const data = await res.json();
      if (data.feeds && data.feeds.length > 0) {
        setFeeds(data.feeds);
        setUseDemoData(false);
      } else {
        throw new Error('No feeds');
      }
      setError(null);
    } catch {
      if (!useDemoData) {
        setFeeds(generateDemoFeeds());
        setUseDemoData(true);
      }
      setError('Using demo data — ThingSpeak unavailable');
    } finally {
      setLastUpdated(new Date());
      setIsLoading(false);
    }
  }, [useDemoData]);

  useEffect(() => {
    fetchData();
    const interval = setInterval(fetchData, POLL_INTERVAL);
    return () => clearInterval(interval);
  }, [fetchData]);

  const latest = feeds.length > 0 ? feeds[feeds.length - 1] : null;

  // Slot 1 = field1 (0=free, 1=occupied), Slot 2 = field2 (0=free, 1=occupied), Slots 3-6 = always occupied
  const slot1Occupied = latest?.field1 === '1';
  const slot2Occupied = latest?.field2 === '1';
  const totalVehicles = (slot1Occupied ? 1 : 0) + (slot2Occupied ? 1 : 0);

  const slots: SlotData[] = Array.from({ length: TOTAL_SLOTS }, (_, i) => {
    if (BLOCKED_INDEXES.includes(i)) {
      return { occupied: true, blocked: true };
    }
    // i=0 → slot1, i=1 → slot2
    const occupied = i === 0 ? slot1Occupied : slot2Occupied;
    return { occupied, blocked: false };
  });

  // Allocated = blocked slots + occupied demo slots
  const occupiedDemoSlots = (slot1Occupied ? 1 : 0) + (slot2Occupied ? 1 : 0);
  const allocatedSpaces = BLOCKED_INDEXES.length + occupiedDemoSlots;
  const freeSpaces = TOTAL_SLOTS - allocatedSpaces;

  return {
    totalVehicles,
    slots,
    totalSpaces: TOTAL_SLOTS,
    allocatedSpaces,
    freeSpaces,
    feeds,
    lastUpdated,
    isLoading,
    error,
  };
}
