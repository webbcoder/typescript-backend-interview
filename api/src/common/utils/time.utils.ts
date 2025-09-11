type Interval = { start: number; end: number }

export function parseHmToMinutes(hm: string): number {
  const [h, m] = hm.split(':').map(Number)
  return h * 60 + m
}

export function timeDateToMinutes(date: Date): number {
  return date.getHours() * 60 + date.getMinutes()
}

export function intervalsOverlap(a: Interval, b: Interval) {
  return a.start < b.end && b.start < a.end
}

export function fmt(mins: number) {
  const h = Math.floor(mins / 60)
  const m = mins % 60
  return `${String(h).padStart(2, '0')}:${String(m).padStart(2, '0')}`
}
