/**
 * Filebank example: Login and list all folders and files of a specificed group
 */

// IMPORTANT: Polyfill window object BEFORE importing jamespot-user-api
(global as any).window = {};

import { config } from 'dotenv';
import { JamespotUserApi, Network } from 'jamespot-user-api';
import { WindowNode } from './WindowNode';
config();


const BACKEND_URL = process.env.JAMESPOT_URL || 'https://your-jamespot-instance.com';
const EMAIL = process.env.JAMESPOT_EMAIL || 'your-email';
const PASSWORD = process.env.JAMESPOT_PASSWORD || 'your-password';
const GROUP_ID = '424';

const windowNode = new WindowNode(BACKEND_URL);
const network = new Network(windowNode);
const api = new JamespotUserApi(network);


async function parseFiles(folderuri: string, foldertitle: string) {

    // Get files in folder
    const files = await api.filebank.getDocuments(folderuri);
    files.result.data.forEach(async (file) => {
        const attachedFiles = file._attachedFiles;
        attachedFiles.forEach(async (file) => {
            const fileName = file.title;
            const fileId = file.id;

            const downloadFile = await windowNode.fetch(`${BACKEND_URL}/downloadFile.php?id=${fileId}`);

            // Do something with file
        });
    });

    // Get subfolders in folder
    const subfolders = await api.filebank.getFolders(folderuri);
    subfolders.result.forEach(async (folder) => {

        // Do something with folder
        await parseFiles(folder.uri, folder.title);
    });

}


async function fileBankExample() {
    try {
        const loginResult = await api.user.signIn(EMAIL, PASSWORD);
        if (loginResult.error === 0) {
            console.log('✓ Login successful!');
            console.log('User ID:', loginResult.result.id);
            console.log('User Name:', loginResult.result.firstname, loginResult.result.lastname);
        } else {
            console.error('✗ Login failed:', loginResult.errorMsg);
            return;
        }


        const filebank = await api.filebank.getFolders(`spot/${GROUP_ID}`);
        const filebankRoot = filebank.result.find(r => r.type === "rootFolder");
        if (!filebankRoot) {
            return;
        }
        await parseFiles(filebankRoot.uri, filebankRoot.title);

    } catch (error) {
        console.log(error);
    }

}

fileBankExample().catch(console.error);
