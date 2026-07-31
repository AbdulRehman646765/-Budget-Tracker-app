import { useState, useCallback } from 'react';
import { UndoAction } from '@/types/budget';

export function useUndo() {
  const [undoStack, setUndoStack] = useState<UndoAction[]>([]);
  const [latestUndo, setLatestUndo] = useState<UndoAction | null>(null);

  const pushUndo = useCallback((action: Omit<UndoAction, 'id' | 'timestamp'>) => {
    const fullAction: UndoAction = {
      ...action,
      id: Math.random().toString(36).substring(2, 9),
      timestamp: Date.now(),
    };
    setUndoStack((prev) => [fullAction, ...prev].slice(0, 10)); // Keep max 10 actions
    setLatestUndo(fullAction);
  }, []);

  const popUndo = useCallback((): UndoAction | null => {
    if (undoStack.length === 0) return null;
    const [action, ...remaining] = undoStack;
    setUndoStack(remaining);
    setLatestUndo(remaining[0] || null);
    return action;
  }, [undoStack]);

  const dismissLatestUndo = useCallback(() => {
    setLatestUndo(null);
  }, []);

  return {
    undoStack,
    latestUndo,
    pushUndo,
    popUndo,
    dismissLatestUndo,
  };
}
