/**
 * Simple example: Login and list groups
 */

// IMPORTANT: Polyfill window object BEFORE importing jamespot-user-api
(global as any).window = {};

import { config } from 'dotenv';
import { JamespotUserApi, Network } from 'jamespot-user-api';
import { WindowNode } from './WindowNode';

config();

async function simpleExample() {
    // Setup
    const windowNode = new WindowNode('https://your-jamespot-instance.com');
    const network = new Network(windowNode);
    const api = new JamespotUserApi(network);

    // Login
    const loginResult = await api.user.signIn('your-email', 'your-password');

    if (loginResult.error === 0) {
        console.log('Logged in as:', loginResult.result.firstName);

        // List groups
        const groups = await api.group.list({
            type: 'spot',
            limit: 10,
        });

        const results = groups.result as any;
        const groupList = results.list || results;
        console.log('Groups:', Array.isArray(groupList) ? groupList.map((g: any) => g.title) : []);
    }
}

simpleExample().catch(console.error);
