# Analytics Utils

Analytics utilities for Keen.io integration with UTM tracking and event collection.

## Features

- UTM parameter tracking (first-touch and current URL)
- LocalStorage persistence for first-touch attribution
- Pageview and custom event tracking
- Keen.io query execution
- Backend API proxy support (no third-party client scripts)

## Usage

```typescript
import {
  trackPageview,
  trackEvent,
  executeKeenQuery,
  collectUtm,
  ensureFirstTouchUtm
} from '@orkid-labs/analytics-utils'

// Track pageview with UTM parameters
trackPageview('/dashboard', { userId: '123' })

// Track custom event
trackEvent('button_click', { buttonId: 'submit' })

// Collect UTM parameters
const utm = collectUtm()

// Execute Keen.io query
const result = await executeKeenQuery({
  projectId: 'your-project',
  readKey: 'your-read-key',
  analysisType: 'count',
  eventCollection: 'pageviews',
  timeframe: 'last_7_days'
})
```

## License

MIT

---

## Part of Orkid Labs

**analytics-utils** — Keen.io analytics utilities — UTM tracking, event collection, and bot-aware telemetry helpers.

- Install: `npm install @orkid-labs/analytics-utils`
- Package: https://www.npmjs.com/package/@orkid-labs/analytics-utils
- API docs: https://docs.orkidlabs.xyz/packages/analytics-utils
- Docs: https://docs.orkidlabs.xyz/packages/analytics-utils

Related Orkid projects: [react-utils](https://github.com/orkid-labs/react-utils), [@orkid-labs/sdk](https://github.com/orkid-labs/sdk)

Orkid Labs builds gasless, MEV-protected swap routing and agent-native DeFi infrastructure — [orkidlabs.xyz](https://orkidlabs.xyz) · [@orkid-labs on npm](https://www.npmjs.com/org/orkid-labs) · [github.com/orkid-labs](https://github.com/orkid-labs)
