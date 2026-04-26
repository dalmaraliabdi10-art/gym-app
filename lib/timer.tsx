import * as Haptics from 'expo-haptics';
import { createContext, useContext, useEffect, useState, type ReactNode } from 'react';
import { Platform } from 'react-native';

type TimerCtx = {
  remaining: number;
  duration: number;
  running: boolean;
  justFinished: boolean;
  start: (seconds: number) => void;
  stop: () => void;
};

const Ctx = createContext<TimerCtx | null>(null);

function fireFinishFeedback() {
  if (Platform.OS === 'web') {
    if (typeof navigator !== 'undefined' && 'vibrate' in navigator) {
      navigator.vibrate([200, 100, 200, 100, 400]);
    }
    return;
  }
  Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success).catch(() => {});
}

export function TimerProvider({ children }: { children: ReactNode }) {
  const [duration, setDuration] = useState(0);
  const [remaining, setRemaining] = useState(0);
  const [running, setRunning] = useState(false);
  const [justFinished, setJustFinished] = useState(false);

  useEffect(() => {
    if (!running) return;
    const interval = setInterval(() => {
      setRemaining((prev) => {
        if (prev <= 1) {
          setRunning(false);
          setJustFinished(true);
          fireFinishFeedback();
          return 0;
        }
        return prev - 1;
      });
    }, 1000);
    return () => clearInterval(interval);
  }, [running]);

  // Auto-clear "justFinished" flash after 2.5s
  useEffect(() => {
    if (!justFinished) return;
    const t = setTimeout(() => setJustFinished(false), 2500);
    return () => clearTimeout(t);
  }, [justFinished]);

  const start = (seconds: number) => {
    setDuration(seconds);
    setRemaining(seconds);
    setRunning(true);
    setJustFinished(false);
  };

  const stop = () => {
    setRunning(false);
    setRemaining(0);
    setDuration(0);
    setJustFinished(false);
  };

  return (
    <Ctx.Provider value={{ remaining, duration, running, justFinished, start, stop }}>
      {children}
    </Ctx.Provider>
  );
}

export function useTimer() {
  const ctx = useContext(Ctx);
  if (!ctx) throw new Error('useTimer must be used inside TimerProvider');
  return ctx;
}
