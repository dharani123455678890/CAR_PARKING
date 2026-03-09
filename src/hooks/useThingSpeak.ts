import { useState, useEffect, useCallback } from 'react';

const THINGSPEAK_CHANNEL_ID = '2961498';
const THINGSPEAK_API_KEY = 'FWSMGQL41CVA21TK';
const POLL_INTERVAL = 15000;

export interface ParkingFeed {
  created_at: string;
  entry_id: number;
  field1: string | null;
  field2: string | null;
  field3: string | null;
  field4: string | null;
  field5: string | null;
}

export interface ParkingData {
  totalVehicles: number;
  slots: { occupied: boolean; blocked: boolean }[];
  totalSpaces: number;
  availableSpaces: number;
  occupancyPercent: number;
  feeds: ParkingFeed[];
  lastUpdated: Date | null;
  isLoading: boolean;
  error: string | null;
}

const BLOCKED_SLOTS = [2]; // slot 3 (0-indexed = 2) is always blocked/allocated

function generateDemoFeeds(): ParkingFeed[] {
  const feeds: ParkingFeed[] = [];
  const now = Date.now();
  for (let i = 0; i < 30; i++) {
    const t = new Date(now - (30 - i) * 60000);
    const v = Math.floor(Math.random() * 4);
    feeds.push({
      created_at: t.toISOString(),
      entry_id: i + 1,
      field1: String(v),
      field2: String(Math.random() > 0.5 ? 1 : 0),
      field3: String(Math.random() > 0.5 ? 1 : 0),
      field4: String(Math.random() > 0.6 ? 1 : 0),
      field5: String(Math.random() > 0.6 ? 1 : 0),
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
        `https://api.thingspeak.com/channels/${THINGSPEAK_CHANNEL_ID}/feeds.json?api_key=${THINGSPEAK_API_KEY}&results=50`
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
  const totalVehicles = latest ? parseInt(latest.field1 || '0', 10) : 0;

  const slotFields = [latest?.field2, latest?.field3, latest?.field4, latest?.field5, null];
  const slots = Array.from({ length: 5 }, (_, i) => {
    const isBlocked = BLOCKED_SLOTS.includes(i);
    const occupied = isBlocked ? true : slotFields[i] === '1';
    return { occupied, blocked: isBlocked };
  });

  const totalSpaces = 5;
  const blockedCount = BLOCKED_SLOTS.length;
  const occupiedNonBlocked = slots.filter((s, i) => s.occupied && !BLOCKED_SLOTS.includes(i)).length;
  const usableSpaces = totalSpaces - blockedCount;
  const availableSpaces = usableSpaces - occupiedNonBlocked;
  const occupancyPercent = usableSpaces > 0 ? Math.round(((occupiedNonBlocked + blockedCount) / totalSpaces) * 100) : 0;

  return {
    totalVehicles,
    slots,
    totalSpaces,
    availableSpaces,
    occupancyPercent,
    feeds,
    lastUpdated,
    isLoading,
    error,
  };
}
