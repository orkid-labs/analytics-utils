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
