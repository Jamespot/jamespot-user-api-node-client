# Jamespot User API - Node.js Client Sample

This project demonstrates how to use the `jamespot-user-api` package in a Node.js environment.

## 🚨 Critical Requirement

**The jamespot-user-api requires a `window` object polyfill for Node.js!**

See [IMPORTANT-NODEJS-SETUP.md](./IMPORTANT-NODEJS-SETUP.md) for details.

TL;DR: Add this before importing the package:
```typescript
(global as any).window = {};
```

## Overview

The `jamespot-user-api` package provides a typed API client for interacting with Jamespot.Pro backends. While it's primarily designed for browser usage, this sample shows how to adapt it for Node.js using a custom `WindowNode` adapter.

## Project Structure

```
jUserApiClientSample/
├── src/
│   ├── WindowNode.ts        # Node.js adapter for the API (adapted from source)
│   ├── example.ts            # Comprehensive example with multiple API calls
│   └── simple-example.ts     # Simple login and list groups example
├── package.json
├── tsconfig.json
├── .env.example              # Environment variables template
└── README.md
```

## Setup

### 1. Install Dependencies

```bash
npm install
```

### 2. Configure Environment

Copy `.env.example` to `.env` and update with your Jamespot credentials:

```bash
cp .env.example .env
```

Edit `.env`:
```env
JAMESPOT_URL=https://your-jamespot-instance.com
JAMESPOT_EMAIL=your-email
JAMESPOT_PASSWORD=your-password
DEBUG=false
```

## Usage

### Run the Comprehensive Example

```bash
npx ts-node src/example.ts
```

This will:
- Login to Jamespot
- Get current user info
- List groups
- Search for groups
- Get group categories
- Search for users

### Run the Simple Example

```bash
npx ts-node src/simple-example.ts
```

### Build the Project

```bash
npm run build
```

### Run Compiled JavaScript

```bash
node dist/example.js
```

## How It Works

### 0. Window Polyfill (Critical for Node.js)

The `jamespot-user-api` package is designed for browsers and expects a `window` object. For Node.js, you must polyfill it **before** importing the package:

```typescript
// This MUST be done before any imports from jamespot-user-api
(global as any).window = {};
```

Without this, you'll get: `ReferenceError: window is not defined`

### 1. WindowNode Adapter

The `WindowNode` class implements the `WindowInterface` required by the API:

```typescript
import { WindowNode } from './WindowNode';

const windowNode = new WindowNode('https://your-jamespot-instance.com');
```

Key features:
- Manages cookies automatically for authentication
- Uses `node-fetch` for HTTP requests
- Provides debug logging when `DEBUG=true`

### 2. Initialize the API

```typescript
import { JamespotUserApi, Network } from 'jamespot-user-api';

const network = new Network(windowNode);
const api = new JamespotUserApi(network);
```

### 3. Make API Calls

**IMPORTANT:** Always polyfill the `window` object before importing jamespot-user-api:

```typescript
// Polyfill window object (required for Node.js)
(global as any).window = {};

import { JamespotUserApi, Network } from 'jamespot-user-api';
import { WindowNode } from './WindowNode';

// Login (use signIn method)
const loginResult = await api.user.signIn('username', 'password');

// List groups
const groups = await api.group.list({
    type: 'spot',
    limit: 10,
});

// Search users
const users = await api.user.autocomplete('john');
```

## Available API Modules

The `JamespotUserApi` provides access to many modules:

- `api.user` - User operations (login, profile, search)
- `api.group` - Group/community operations
- `api.article` - Article/content operations
- `api.file` - File operations
- `api.calendar` - Calendar and events
- `api.meeting` - Meeting management
- `api.taxonomy` - Taxonomy/tags
- `api.search` - Search functionality
- And many more...

## Debug Mode

Enable debug mode to see HTTP requests and cookie management:

```bash
DEBUG=true npx ts-node src/example.ts
```

Or pass the `--debug` flag:

```bash
npx ts-node src/example.ts --debug
```

## TypeScript Support

This project is fully typed using TypeScript. The `jamespot-user-api` package includes TypeScript definitions, providing:

- Auto-completion in your IDE
- Type checking at compile time
- Better documentation through types

## API Response Format

Most API calls return an object with this structure:

```typescript
{
    error: number,        // 0 for success, non-zero for errors
    errorMsg?: string,    // Error message if error !== 0
    result: T,            // The actual result data
}
```

Always check `error === 0` before accessing `result`:

```typescript
const response = await api.user.getCurrent();
if (response.error === 0) {
    console.log('User:', response.result);
} else {
    console.error('Error:', response.errorMsg);
}
```

## Common Use Cases

### Authentication

```typescript
// Login (use signIn method)
const loginResult = await api.user.signIn('username', 'password');

// Get current user (use the uri from login result)
const user = await api.user.get(loginResult.result.uri);
```

### Groups

```typescript
// List all groups
const groups = await api.group.list({
    type: 'spot',
    limit: 50
});

// Search groups
const searchResults = await api.group.list({
    type: 'spot',
    query: 'project',
    limit: 10
});

// Get specific group
const group = await api.group.getSpot('123');

// Get group members
const members = await api.group.getObjectListJamespotSpotMembers('123');
```

### Users

```typescript
// Autocomplete/search users
const users = await api.user.autocomplete('john');

// Get user by ID
const user = await api.user.getUser('123');
```

## Notes

- The WindowNode adapter manages authentication cookies automatically
- All API calls are asynchronous (use `await` or `.then()`)
- Environment variables can be overridden by modifying the code directly
- The session persists as long as the API instance is alive

## Dependencies

- `jamespot-user-api` - The main API client
- `node-fetch` - HTTP client for Node.js
- `typescript` - TypeScript compiler
- `ts-node` - Run TypeScript directly

## Additional Documentation

- **[IMPORTANT-NODEJS-SETUP.md](./IMPORTANT-NODEJS-SETUP.md)** - Critical window polyfill requirement
- **[QUICKSTART.md](./QUICKSTART.md)** - Quick start guide
- **[TROUBLESHOOTING.md](./TROUBLESHOOTING.md)** - Common issues and solutions

## License

ISC
