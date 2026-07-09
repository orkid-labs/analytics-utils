/**
 * Analytics utilities for Keen.io integration with UTM tracking and event collection
 */

export type AnalyticsEventParams = Record<string, any>

const UTM_KEYS = ['utm_source', 'utm_medium', 'utm_campaign', 'utm_term', 'utm_content'] as const
export type UtmMap = Partial<Record<typeof UTM_KEYS[number], string | undefined>>

/**
 * Get UTM parameters from current URL
 */
export function getUrlUtm(): UtmMap {
  if (typeof window === 'undefined') return {}
  try {
    const url = new URL(window.location.href)
    const get = (k: string) => url.searchParams.get(k) || undefined
    return {
      utm_source: get('utm_source'),
      utm_medium: get('utm_medium'),
      utm_campaign: get('utm_campaign'),
      utm_term: get('utm_term'),
      utm_content: get('utm_content'),
    }
  } catch { return {} }
}

/**
 * Get stored first-touch UTM parameters from localStorage
 */
export function getStoredFirstTouchUtm(): UtmMap {
  if (typeof window === 'undefined') return {}
  try {
    const raw = window.localStorage.getItem('first_touch_utm')
    if (!raw) return {}
    return JSON.parse(raw) as UtmMap
  } catch { return {} }
}

/**
 * Store first-touch UTM parameters in localStorage
 */
export function setStoredFirstTouchUtm(utm: UtmMap): void {
  if (typeof window === 'undefined') return
  try { 
    window.localStorage.setItem('first_touch_utm', JSON.stringify(utm)) 
  } catch {}
}

/**
 * Ensure first-touch UTM is set if URL has UTM parameters
 */
export function ensureFirstTouchUtm(): void {
  if (typeof window === 'undefined') return
  const current = getUrlUtm()
  const hasUtm = UTM_KEYS.some(k => !!(current as any)[k])
  if (!hasUtm) return
  const existing = getStoredFirstTouchUtm()
  if (Object.keys(existing).length === 0) setStoredFirstTouchUtm(current)
}

/**
 * Collect UTM parameters (prefers stored first-touch, falls back to current URL)
 */
export function collectUtm(): UtmMap {
  const stored = getStoredFirstTouchUtm()
  const urlUtm = getUrlUtm()
  const merged: UtmMap = { ...urlUtm, ...stored }
  UTM_KEYS.forEach(k => { 
    if (stored[k]) merged[k] = stored[k] 
  })
  return merged
}

/**
 * Track a pageview event
 */
export function trackPageview(
  path: string, 
  extra?: AnalyticsEventParams,
  apiEndpoint?: string
): void {
  try { 
    ensureFirstTouchUtm() 
  } catch {}

  try {
    if (typeof window === 'undefined' || typeof fetch === 'undefined') return
    
    const endpoint = apiEndpoint || '/api/analytics'
    fetch(endpoint, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      keepalive: true,
      body: JSON.stringify({
        collection: 'pageviews',
        event: {
          path,
          href: window.location.href,
          referrer: document.referrer,
          ts: Date.now(),
          ...collectUtm(),
          ...extra,
        },
      }),
    }).catch(() => {})
  } catch {}
}

/**
 * Track a custom event
 */
export function trackEvent(
  name: string, 
  params?: AnalyticsEventParams,
  apiEndpoint?: string
): void {
  try {
    if (typeof window === 'undefined' || typeof fetch === 'undefined') return
    
    const endpoint = apiEndpoint || '/api/analytics'
    fetch(endpoint, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      keepalive: true,
      body: JSON.stringify({
        collection: name,
        event: {
          ts: Date.now(),
          ...collectUtm(),
          ...params,
        },
      }),
    }).catch(() => {})
  } catch {}
}

/**
 * Keen.io query parameters
 */
export interface KeenQueryParams {
  projectId: string
  readKey: string
  analysisType: 'count' | 'count_unique' | 'sum' | 'average' | 'minimum' | 'maximum' | 'median' | 'percentile'
  eventCollection: string
  timeframe?: string
  interval?: string
  targetProperty?: string
  filters?: any[]
  groupBy?: string | string[]
  timezone?: string
}

/**
 * Execute a Keen.io query
 */
export async function executeKeenQuery<T = any>(params: KeenQueryParams): Promise<T> {
  const url = new URL(`https://api.keen.io/3.0/projects/${params.projectId}/queries/${params.analysisType}`)
  url.searchParams.set('event_collection', params.eventCollection)
  if (params.timeframe) url.searchParams.set('timeframe', params.timeframe)
  if (params.interval) url.searchParams.set('interval', params.interval)
  if (params.targetProperty) url.searchParams.set('target_property', params.targetProperty)
  if (params.groupBy) url.searchParams.set('group_by', JSON.stringify(params.groupBy))
  if (params.filters) url.searchParams.set('filters', JSON.stringify(params.filters))
  if (params.timezone) url.searchParams.set('timezone', params.timezone)

  const res = await fetch(url.toString(), {
    method: 'GET',
    headers: { Authorization: params.readKey },
  })

  if (!res.ok) {
    const text = await res.text()
    throw new Error(`Keen query failed: ${res.status} - ${text}`)
  }

  return res.json()
}
