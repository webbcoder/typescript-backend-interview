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
