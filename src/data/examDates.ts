// Official 2026 exam dates for Prøve i Dansk 2 and 3, published by the
// exam administering authority. Used as sensible defaults for the
// Dashboard's countdown/study-plan feature so it works out of the box
// without requiring the user to manually look up and enter their exam
// date — they can still override it in Settings if their own date differs
// (e.g. a different exam period/region).
export const OFFICIAL_EXAM_DATES_2026 = {
  pd2: { written: '2026-11-11', writtenLabel: 'Onsdag den 11. november 2026' },
  pd3: { written: '2026-11-10', writtenLabel: 'Tirsdag den 10. november 2026' },
  oralPeriod: '2.–15. december 2026',
} as const
