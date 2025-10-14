/**
 * Example usage of jamespot-user-api in Node.js
 *
 * This demonstrates how to:
 * 1. Set up the WindowNode adapter
 * 2. Create a Network instance
 * 3. Initialize the JamespotUserApi
 * 4. Make API calls (login, group operations, etc.)
 */

// IMPORTANT: Polyfill window object BEFORE importing jamespot-user-api
// The library expects window to be available
(global as any).window = {};

import { config } from 'dotenv';
import { JamespotUserApi, Network } from 'jamespot-user-api';
import { WindowNode } from './WindowNode';

config();

async function main() {
    // Configuration
    const BACKEND_URL = process.env.JAMESPOT_URL || 'https://your-jamespot-instance.com';
    const EMAIL = process.env.JAMESPOT_EMAIL || 'your-email';
    const PASSWORD = process.env.JAMESPOT_PASSWORD || 'your-password';

    console.log('Initializing Jamespot User API Client...');

    // 1. Create the WindowNode adapter with your Jamespot backend URL
    const windowNode = new WindowNode(BACKEND_URL);

    // 2. Create the Network instance with the WindowNode adapter
    const network = new Network(windowNode);

    // 3. Initialize the JamespotUserApi with the network
    const api = new JamespotUserApi(network);

    try {
        console.log('\n--- Logging in ---');
        // 4. Login to get session cookie
        const loginResult = await api.user.signIn(EMAIL, PASSWORD);

        if (loginResult.error === 0) {
            console.log('✓ Login successful!');
            console.log('User ID:', loginResult.result.id);
            console.log('User Name:', loginResult.result.firstname, loginResult.result.lastname);
        } else {
            console.error('✗ Login failed:', loginResult.errorMsg);
            return;
        }

        // Example 1: Get current user info
        console.log('\n--- Getting current user info ---');
        const currentUser = await api.user.get(loginResult.result.uri);
        if (currentUser.error === 0) {
            console.log('✓ Current user:', (currentUser.result as any).title);
        }

        // Example 2: List groups
        console.log('\n--- Listing groups ---');
        const groupsResult = await api.group.list({
            type: 'spot',
            limit: 10,
        });

        if (groupsResult.error === 0) {
            const results = groupsResult.result as any;
            console.log(`✓ Found ${results.cnt} groups`);
            const groups = results.data;
            if (Array.isArray(groups)) {
                groups.slice(0, 10).forEach((group: any, index: number) => {
                    console.log(`  ${index + 1}. ${group.title} (ID: ${group.id})`);
                });
            }
        }

        // Example 3: Search for groups
        console.log('\n--- Searching groups ---');
        const searchQuery = 'devops';
        const searchResult = await api.group.list({
            type: 'spot',
            limit: 5,
            query: searchQuery,
        });

        if (searchResult.error === 0) {
            const results = searchResult.result as any;
            console.log(`✓ Found ${results.cnt} groups matching "${searchQuery}"`);
            const groups = results.data;
            if (Array.isArray(groups)) {
                groups.forEach((group: any, index: number) => {
                    console.log(`  ${index + 1}. ${group.title}`);
                });
            }
        }

        // Example 4: Get group categories
        console.log('\n--- Getting group categories ---');
        try {
            const categoriesResult = await api.group.getCategories();
            if (categoriesResult.error === 0) {
                console.log('✓ Available categories:', categoriesResult.result.length);
            }
        } catch(e) {
            console.log(e);
        }

        // Example 5: Autocomplete users
        console.log('\n--- Searching users ---');
        const userSearchResult = await api.user.autocomplete('a');
        console.log(`✓ Found ${userSearchResult.length} users`);
        if (userSearchResult.length > 0) {
            console.log('  First user:', userSearchResult[0].label);
        }


        // Example 6: Direct calls
        console.log('\n--- Direct calls to API ---');
        const recentDiscussions = await api.network.post({'o':'messenger', 'f':'listRecentDiscussions'});
        console.log(`✓ Found ${(recentDiscussions.result as any).length} recent discussions`);
        if ((recentDiscussions.result as any).length > 0) {
            console.log(recentDiscussions.result );
        }
        

        console.log('\n✓ All operations completed successfully!');



    } catch (error) {
        console.error('\n✗ Error occurred:', error);
    }
}

// Run the example
if (require.main === module) {
    main().catch(console.error);
}

export { main };
