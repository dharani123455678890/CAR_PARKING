import { useState, useEffect, useCallback } from 'react';

const THINGSPEAK_CHANNEL_ID = '2961498';
const THINGSPEAK_API_KEY = 'FWSMGQL41CVA21TK';
const POLL_INTERVAL = 15000;

export interface ParkingFeed {
  created_at: string;
  entry_id: number;
  field1: string | null; // Total Vehicles
  field2: string | null; // Slot 1
  field3: string | null; // Slot 2
}

export interface ParkingData {
  totalVehicles: number;
  slot1Occupied: boolean;
  slot2Occupied: boolean;
  totalSpaces: number;
  availableSpaces: number;
  occupancyPercent: number;
  feeds: ParkingFeed[];
  lastUpdated: Date | null;
  isLoading: boolean;
  error: string | null;
}

export function useThingSpeak(): ParkingData {
  const [feeds, setFeeds] = useState<ParkingFeed[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [lastUpdated, setLastUpdated] = useState<Date | null>(null);

  const fetchData = useCallback(async () => {
    try {
      const res = await fetch(
        `https://api.thingspeak.com/channels/${THINGSPEAK_CHANNEL_ID}/feeds.json?api_key=${THINGSPEAK_API_KEY}&results=50`
      );
      if (!res.ok) throw new Error(`HTTP ${res.status}`);
      const data = await res.json();
      setFeeds(data.feeds || []);
      setLastUpdated(new Date());
      setError(null);
    } catch (e: any) {
      setError(e.message);
    } finally {
      setIsLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchData();
    const interval = setInterval(fetchData, POLL_INTERVAL);
    return () => clearInterval(interval);
  }, [fetchData]);

  const latest = feeds.length > 0 ? feeds[feeds.length - 1] : null;
  const totalVehicles = latest ? parseInt(latest.field1 || '0', 10) : 0;
  const slot1Occupied = latest ? latest.field2 === '1' : false;
  const slot2Occupied = latest ? latest.field3 === '1' : false;
  const totalSpaces = 2;
  const occupied = (slot1Occupied ? 1 : 0) + (slot2Occupied ? 1 : 0);
  const availableSpaces = totalSpaces - occupied;
  const occupancyPercent = Math.round((occupied / totalSpaces) * 100);

  return {
    totalVehicles,
    slot1Occupied,
    slot2Occupied,
    totalSpaces,
    availableSpaces,
    occupancyPercent,
    feeds,
    lastUpdated,
    isLoading,
    error,
  };
}
