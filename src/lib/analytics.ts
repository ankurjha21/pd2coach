// Thin wrapper around GoatCounter's SPA pageview tracking (see the script
// tag in index.html). Safe no-op if the script hasn't loaded yet (e.g.
// ad-blockers, or the GoatCounter account not created yet).
import { useEffect } from 'react'
import { useLocation } from 'react-router-dom'

declare global {
  interface Window {
    goatcounter?: {
      count: (vars?: { path?: string; title?: string; event?: boolean }) => void
    }
  }
}

export function usePageviewTracking() {
  const location = useLocation()

  useEffect(() => {
    // The initial load is already counted by the static script tag; only
    // track subsequent in-app (hash) route changes here.
    if (window.goatcounter?.count) {
      window.goatcounter.count({
        path: location.pathname + location.hash,
        title: document.title,
      })
    }
  }, [location.pathname, location.hash])
}
