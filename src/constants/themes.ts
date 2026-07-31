import { AppTheme } from '@/types/budget';

export interface ThemeDefinition {
  id: AppTheme;
  name: string;
  icon: string;
  bgGradient: string;
  cardBg: string;
  borderColor: string;
  primaryColor: string;
  accentColor: string;
  textColor: string;
  mutedTextColor: string;
}

export const THEMES: Record<AppTheme, ThemeDefinition> = {
  dark: {
    id: 'dark',
    name: 'Classic Dark',
    icon: 'fa-moon',
    bgGradient: 'from-slate-950 via-slate-900 to-slate-950',
    cardBg: 'bg-slate-900/80',
    borderColor: 'border-slate-800',
    primaryColor: '#6366f1',
    accentColor: '#3b82f6',
    textColor: '#f8fafc',
    mutedTextColor: '#94a3b8',
  },
  light: {
    id: 'light',
    name: 'Clean Light',
    icon: 'fa-sun',
    bgGradient: 'from-slate-100 via-slate-50 to-slate-200',
    cardBg: 'bg-white/90',
    borderColor: 'border-slate-200',
    primaryColor: '#4f46e5',
    accentColor: '#2563eb',
    textColor: '#0f172a',
    mutedTextColor: '#64748b',
  },
  cyberpunk: {
    id: 'cyberpunk',
    name: 'Cyberpunk Neon',
    icon: 'fa-bolt',
    bgGradient: 'from-zinc-950 via-purple-950 to-zinc-950',
    cardBg: 'bg-zinc-900/90',
    borderColor: 'border-pink-500/30',
    primaryColor: '#ec4899',
    accentColor: '#06b6d4',
    textColor: '#f472b6',
    mutedTextColor: '#a855f7',
  },
  emerald: {
    id: 'emerald',
    name: 'Emerald Forest',
    icon: 'fa-tree',
    bgGradient: 'from-emerald-950 via-slate-950 to-teal-950',
    cardBg: 'bg-emerald-950/70',
    borderColor: 'border-emerald-800/50',
    primaryColor: '#10b981',
    accentColor: '#14b8a6',
    textColor: '#ecfdf5',
    mutedTextColor: '#6ee7b7',
  },
  sunset: {
    id: 'sunset',
    name: 'Sunset Gold',
    icon: 'fa-fire',
    bgGradient: 'from-amber-950 via-stone-950 to-orange-950',
    cardBg: 'bg-stone-900/80',
    borderColor: 'border-amber-800/50',
    primaryColor: '#f59e0b',
    accentColor: '#f97316',
    textColor: '#fffbeb',
    mutedTextColor: '#fcd34d',
  },
  midnight: {
    id: 'midnight',
    name: 'Midnight Purple',
    icon: 'fa-star',
    bgGradient: 'from-indigo-950 via-purple-950 to-slate-950',
    cardBg: 'bg-indigo-950/70',
    borderColor: 'border-indigo-800/50',
    primaryColor: '#8b5cf6',
    accentColor: '#6366f1',
    textColor: '#f5f3ff',
    mutedTextColor: '#c4b5fd',
  },
  ocean: {
    id: 'ocean',
    name: 'Ocean Breeze',
    icon: 'fa-water',
    bgGradient: 'from-sky-950 via-slate-950 to-cyan-950',
    cardBg: 'bg-sky-950/70',
    borderColor: 'border-sky-800/50',
    primaryColor: '#0284c7',
    accentColor: '#06b6d4',
    textColor: '#f0f9ff',
    mutedTextColor: '#7dd3fc',
  },
};
