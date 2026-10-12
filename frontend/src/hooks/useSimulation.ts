import { useState, useEffect, useRef, useCallback } from "react";
import type { SimulationStep } from "../lib/crypto";

export interface UseSimulationReturn {
  steps: SimulationStep[];
  currentStepIndex: number;
  currentStep: SimulationStep | null;
  isPlaying: boolean;
  playbackSpeed: number;
  isAtStart: boolean;
  isAtEnd: boolean;
  progressPercent: number;
  play: () => void;
  pause: () => void;
  togglePlay: () => void;
  next: () => void;
  prev: () => void;
  jumpToStep: (stepNumber: number) => void;
  reset: () => void;
  setSpeed: (speed: number) => void;
}

export function useSimulation(
  steps: SimulationStep[],
  baseDurationMs: number = 2400
): UseSimulationReturn {
  const [currentStepIndex, setCurrentStepIndex] = useState<number>(0);
  const [isPlaying, setIsPlaying] = useState<boolean>(false);
  const [playbackSpeed, setPlaybackSpeed] = useState<number>(1);
  const timerRef = useRef<ReturnType<typeof setInterval> | null>(null);

  const totalSteps = steps.length;
  const isAtStart = currentStepIndex === 0;
  const isAtEnd = totalSteps > 0 && currentStepIndex >= totalSteps - 1;
  const currentStep = totalSteps > 0 && currentStepIndex < totalSteps ? steps[currentStepIndex] : null;
  const progressPercent = totalSteps > 1 ? (currentStepIndex / (totalSteps - 1)) * 100 : 0;

  // Stop playback when steps change or reset
  useEffect(() => {
    setCurrentStepIndex(0);
    setIsPlaying(false);
  }, [steps]);

  const pause = useCallback(() => {
    setIsPlaying(false);
  }, []);

  const play = useCallback(() => {
    if (steps.length === 0) return;
    if (currentStepIndex >= steps.length - 1) {
      setCurrentStepIndex(0);
    }
    setIsPlaying(true);
  }, [steps.length, currentStepIndex]);

  const togglePlay = useCallback(() => {
    if (isPlaying) {
      pause();
    } else {
      play();
    }
  }, [isPlaying, pause, play]);

  const next = useCallback(() => {
    setCurrentStepIndex((prev) => {
      if (prev < steps.length - 1) {
        return prev + 1;
      }
      setIsPlaying(false);
      return prev;
    });
  }, [steps.length]);

  const prev = useCallback(() => {
    setCurrentStepIndex((prev) => {
      if (prev > 0) {
        return prev - 1;
      }
      return 0;
    });
  }, []);

  const jumpToStep = useCallback(
    (stepNumber: number) => {
      const targetIndex = stepNumber - 1;
      if (targetIndex >= 0 && targetIndex < steps.length) {
        setCurrentStepIndex(targetIndex);
      }
    },
    [steps.length]
  );

  const reset = useCallback(() => {
    pause();
    setCurrentStepIndex(0);
  }, [pause]);

  const setSpeed = useCallback((speed: number) => {
    setPlaybackSpeed(speed);
  }, []);

  // Interval loop for playback
  useEffect(() => {
    if (!isPlaying) {
      if (timerRef.current) clearInterval(timerRef.current);
      return;
    }

    const interval = Math.max(400, Math.floor(baseDurationMs / playbackSpeed));
    timerRef.current = setInterval(() => {
      setCurrentStepIndex((prev) => {
        if (prev >= steps.length - 1) {
          setIsPlaying(false);
          return prev;
        }
        return prev + 1;
      });
    }, interval);

    return () => {
      if (timerRef.current) clearInterval(timerRef.current);
    };
  }, [isPlaying, playbackSpeed, steps.length, baseDurationMs]);

  return {
    steps,
    currentStepIndex,
    currentStep,
    isPlaying,
    playbackSpeed,
    isAtStart,
    isAtEnd,
    progressPercent,
    play,
    pause,
    togglePlay,
    next,
    prev,
    jumpToStep,
    reset,
    setSpeed,
  };
}
