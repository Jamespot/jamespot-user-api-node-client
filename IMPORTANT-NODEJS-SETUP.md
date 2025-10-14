# Critical Setup for Node.js Usage

## The Window Polyfill Requirement

The `jamespot-user-api` package was designed for **browser environments** and expects a global `window` object. When using it in Node.js, you **MUST** provide this polyfill.

## ⚠️ Required Code

Add this **at the very top** of your entry file, **BEFORE** any imports from `jamespot-user-api`:

```typescript
// MUST BE FIRST - Before any imports
(global as any).window = {};

// Now safe to import
import { JamespotUserApi, Network } from 'jamespot-user-api';
```

## Why This Is Necessary

The library's initialization code runs when the module is imported and immediately tries to access `window.JamespotUserApi`. Without the polyfill, you'll get:

```
ReferenceError: window is not defined
    at .../node_modules/jamespot-user-api/lib/jamespot-user-api.js:1:183319
```

## Implementation in This Project

All example files in this project include the polyfill:

### src/example.ts
```typescript
// Line 13
(global as any).window = {};

import { JamespotUserApi, Network } from 'jamespot-user-api';
// ... rest of code
```

### src/simple-example.ts
```typescript
// Line 6
(global as any).window = {};

import { JamespotUserApi, Network } from 'jamespot-user-api';
// ... rest of code
```

## What Gets Polyfilled

We're providing a minimal polyfill - just an empty object. This is sufficient because:

1. The WindowNode adapter handles all actual HTTP requests via `node-fetch`
2. The library only needs `window` to exist during initialization
3. We override the window-based networking with our Node.js adapter (WindowNode)

## Complete Working Example

```typescript
// Step 1: Polyfill window (CRITICAL)
(global as any).window = {};

// Step 2: Import packages
import { JamespotUserApi, Network } from 'jamespot-user-api';
import { WindowNode } from './WindowNode';

// Step 3: Setup Node.js adapter
const windowNode = new WindowNode('https://your-instance.com');
const network = new Network(windowNode);
const api = new JamespotUserApi(network);

// Step 4: Use the API
const login = await api.user.signIn('username', 'password');
if (login.error === 0) {
    console.log('Success!', login.result);
}
```

## Testing the Polyfill

You can verify it's working:

```bash
# Should run without "window is not defined" error
npm start

# With debug output
DEBUG=true npm start
```

## Common Mistake

❌ **WRONG** - Import before polyfill:
```typescript
import { JamespotUserApi } from 'jamespot-user-api';  // ERROR!
(global as any).window = {};  // Too late!
```

✅ **CORRECT** - Polyfill before import:
```typescript
(global as any).window = {};  // Do this first!
import { JamespotUserApi } from 'jamespot-user-api';  // Now safe
```

## Alternative: Separate Polyfill File

For cleaner code, create a separate polyfill file:

**polyfill.ts:**
```typescript
(global as any).window = {};
```

**main.ts:**
```typescript
import './polyfill';  // Load polyfill first
import { JamespotUserApi, Network } from 'jamespot-user-api';
// ... rest of code
```

## Summary

**The window polyfill is NOT optional** - your Node.js application will crash without it. Always include it at the top of your entry file before importing jamespot-user-api.
