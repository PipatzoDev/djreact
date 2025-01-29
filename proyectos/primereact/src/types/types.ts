// src/types.ts
export interface Task {
    id: string; // Ensure it's always a string
    title: string; // Make title required
    description?: string;
    dateNow?: string;
    created_at?: string;
    creator?: string;
    done?: boolean;
    archivo?: string;
    portada?: string;
  }
  