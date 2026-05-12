const STORAGE_KEY = "klarhilfe_analyses_v1";
const FREE_LIMIT = 5;

export type UsageRecord = {
  year: number;
  month: number; // 0-11
  count: number;
};

function currentYm(): { year: number; month: number } {
  const d = new Date();
  return { year: d.getFullYear(), month: d.getMonth() };
}

export function getUsage(): UsageRecord {
  if (typeof window === "undefined") {
    return { ...currentYm(), count: 0 };
  }
  try {
    const raw = window.localStorage.getItem(STORAGE_KEY);
    const { year, month } = currentYm();
    if (!raw) return { year, month, count: 0 };
    const parsed = JSON.parse(raw) as UsageRecord;
    if (parsed.year !== year || parsed.month !== month) {
      return { year, month, count: 0 };
    }
    return {
      year: parsed.year,
      month: parsed.month,
      count: Math.max(0, Number(parsed.count) || 0),
    };
  } catch {
    return { ...currentYm(), count: 0 };
  }
}

export function getFreeRemaining(): number {
  const u = getUsage();
  return Math.max(0, FREE_LIMIT - u.count);
}

export function canAnalyzeFree(): boolean {
  return getFreeRemaining() > 0;
}

export function incrementUsage(): UsageRecord {
  const { year, month } = currentYm();
  const prev = getUsage();
  const count = prev.year === year && prev.month === month ? prev.count + 1 : 1;
  const next: UsageRecord = { year, month, count };
  if (typeof window !== "undefined") {
    window.localStorage.setItem(STORAGE_KEY, JSON.stringify(next));
  }
  return next;
}

export { FREE_LIMIT };
