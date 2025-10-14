# Troubleshooting

## Common Issues

### Error: `ReferenceError: window is not defined`

**Problem:**
```
ReferenceError: window is not defined
    at /Users/.../node_modules/jamespot-user-api/lib/jamespot-user-api.js:1:183319
```

**Cause:**
The `jamespot-user-api` package is designed for browser environments and expects a global `window` object. In Node.js, this object doesn't exist by default.

**Solution:**
Add this line **at the very top** of your entry file, **before** importing `jamespot-user-api`:

```typescript
// Must be BEFORE any imports
(global as any).window = {};

// Now safe to import
import { JamespotUserApi, Network } from 'jamespot-user-api';
```

**Why this works:**
The jamespot-user-api library checks for `window` during module initialization. By setting `global.window` before the import, we provide the expected environment.

### TypeScript Type Errors

**Problem:**
TypeScript errors about missing properties or wrong types.

**Solution:**
1. Check the actual API by looking at the type definitions:
   ```bash
   cat node_modules/jamespot-user-api/lib/src/apis/[module]/[module].d.ts
   ```

2. Common differences from documentation:
   - Use `api.user.signIn()` not `api.user.login()`
   - Use `api.user.get(uri)` not `api.user.getCurrent()`
   - Group list doesn't accept `security` or `public` parameters directly

### Cookie/Authentication Issues

**Problem:**
Requests fail with authentication errors after successful login.

**Solution:**
The `WindowNode` adapter automatically manages cookies. Ensure:
1. You're reusing the same `api` instance for all calls
2. The login was successful (`loginResult.error === 0`)
3. Enable debug mode to see cookie management:
   ```bash
   DEBUG=true npm start
   ```

### API Response Structure

**Problem:**
Can't access expected data in responses.

**Solution:**
All API responses follow this structure:
```typescript
{
    error: 0 | number,    // 0 = success
    errorMsg?: string,     // Present if error !== 0
    result: T              // Your data (type varies)
}
```

Always check `error === 0` before accessing `result`:
```typescript
const response = await api.group.list({ type: 'spot', limit: 10 });
if (response.error === 0) {
    console.log(response.result);  // Safe to access
} else {
    console.error(response.errorMsg);
}
```

### PagingResults Structure

**Problem:**
Expected `results` or `total` properties missing.

**Solution:**
The `PagingResults` structure varies. Use type assertions for flexibility:
```typescript
const groups = await api.group.list({ type: 'spot', limit: 10 });
const results = groups.result as any;
const groupList = results.list || results;  // Handle both formats
```

## Debug Mode

Enable detailed logging to troubleshoot issues:

```bash
# Via npm script
npm run start:debug

# Via environment variable
DEBUG=true npm start

# Via command line flag
npm start -- --debug
```

This shows:
- HTTP requests and URLs
- Cookie management
- Response data

## Still Having Issues?

1. Check the jamespot-user-api package version:
   ```bash
   npm list jamespot-user-api
   ```

2. Ensure all dependencies are installed:
   ```bash
   npm install
   ```

3. Clear node_modules and reinstall:
   ```bash
   rm -rf node_modules package-lock.json
   npm install
   ```

4. Check the official documentation for API changes
