# Quick Start Guide

## 1. Setup

```bash
# Install dependencies
npm install

# Copy environment template
cp .env.example .env
```

## 2. Configure

Edit `.env` with your Jamespot credentials:

```env
JAMESPOT_URL=https://your-instance.jamespot.com
JAMESPOT_USERNAME=your-username
JAMESPOT_PASSWORD=your-password
```

## 3. Run Examples

```bash
# Run the comprehensive example
npm start

# Run the simple example
npm run start:simple

# Run with debug mode
npm run start:debug

# Build to JavaScript
npm run build
```

## 4. Basic Usage

**IMPORTANT:** The jamespot-user-api package expects a browser environment. You must polyfill the `window` object before importing:

```typescript
// REQUIRED: Polyfill window object for Node.js
(global as any).window = {};

import { JamespotUserApi, Network } from 'jamespot-user-api';
import { WindowNode } from './WindowNode';

// Initialize
const windowNode = new WindowNode('https://your-instance.com');
const network = new Network(windowNode);
const api = new JamespotUserApi(network);

// Login
const login = await api.user.signIn('username', 'password');
console.log('Logged in:', login.result.firstName);

// List groups
const groups = await api.group.list({ type: 'spot', limit: 10 });
console.log('Groups:', groups.result);

// Search users
const users = await api.user.autocomplete('john');
console.log('Users:', users);
```

## Key API Methods

### User API
- `api.user.signIn(username, password)` - Login
- `api.user.get(uri)` - Get user by URI
- `api.user.autocomplete(query)` - Search users

### Group API
- `api.group.list(config)` - List groups
- `api.group.getSpot(id)` - Get group by ID
- `api.group.getCategories()` - Get available categories
- `api.group.getObjectListJamespotSpotMembers(id)` - Get members

### Other Available APIs
- `api.article` - Articles/content
- `api.file` - File operations
- `api.calendar` - Events & calendar
- `api.search` - Search functionality
- And 30+ more modules...

## Response Format

All APIs return:

```typescript
{
    error: 0,           // 0 = success
    errorMsg?: string,  // Error message if error !== 0
    result: T           // Your data
}
```

Always check `error === 0` before using `result`.

## Debug Mode

Enable to see HTTP requests and cookies:

```bash
DEBUG=true npm start
# or
npm run start:debug
# or
node dist/example.js --debug
```

## TypeScript Support

Full TypeScript support with auto-completion:

```typescript
import {
    JamespotUserApi,
    Network,
    jUserLittle,
    jGroupList
} from 'jamespot-user-api';
```

## Next Steps

- See `README.md` for detailed documentation
- Check `src/example.ts` for comprehensive examples
- Review `src/WindowNode.ts` for the adapter implementation
- Visit the jamespot-user-api documentation for full API reference
