/**
 * Node.js implementation of WindowInterface for jamespot-user-api
 */

import fetch, { HeadersInit, RequestInit as NodeRequestInit } from 'node-fetch';

export type FetchResponseType<T> = { json: () => Promise<T> };
export type FetchReturnType<T> = Promise<FetchResponseType<T>>;

export interface WindowInterface {
    getBackendUrl: () => Promise<string>;
    fetch: <T>(url: string, init?: RequestInit) => FetchReturnType<T>;
}

export class WindowNode implements WindowInterface {
    private readonly backendUrl: string;
    private readonly referer: string;
    private cookie: string | null;
    private debug: boolean;

    constructor(backendUrl: string) {
        this.backendUrl = backendUrl;
        this.referer = backendUrl + '/ng/wall';
        this.cookie = null;
        this.debug = process.argv.includes('--debug') || process.env.DEBUG === 'true';
    }

    async getBackendUrl() {
        return this.backendUrl;
    }

    public async fetch<T>(url: string, init?: RequestInit): FetchReturnType<T> {

        if (this.debug) {
            console.log('Fetch : ' + url, init);
        }
        let headers: Record<string,string>;
        
        if (init && init.headers) {
            headers = init.headers as Record<string, string>;
            delete init.headers;
        } else {
            headers = {};
        }

        headers.referer = this.referer;

        // Manually add cookie if user has previously logged in
        if (this.cookie != null) {
            headers.cookie = this.cookie;
        }

        if (this.debug) {
            if (this.cookie != null) {
                console.log('Cookie : ' + this.cookie);
            } else {
                console.log('No Cookie ');
            }
        }

        return fetch(url, {
            headers,
            ...init,
        } as NodeRequestInit).then((res) => {
            // If cookie present in any response, update the cookie property
            const cookies = res.headers.raw()['set-cookie'];
            if (cookies) {
                if (this.debug) {
                    console.log('Set Cookie');
                }
                this.cookie = cookies
                    .map((cookie) => cookie.split(';')[0].trim())
                    .reduce((acc, cookie) => `${acc};${cookie}`);
                if (this.debug) {
                    console.log('Cookie updated to : ' + this.cookie);
                }
            }

            if (this.debug) {
                const responseClone = res.clone();
                const pData = responseClone.json();
                pData.then(
                    (data)  => {
                        console.log('Response : ' , data);
                    }
                );
            }
            return res;
        }) as FetchReturnType<T>;
    }
}
