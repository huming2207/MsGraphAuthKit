/**
 * @module ClientCredAuthProvider
 */

import { AuthenticationProvider } from '@microsoft/microsoft-graph-client';
import Axios, { AxiosInstance } from 'axios';
import QueryString from 'query-string';

export class ClientCredAuthProvider implements AuthenticationProvider {
    private clientId: string;
    private clientSecret: string;
    private authScope: string;
    private axios: AxiosInstance;

    constructor(public _clientId: string, public _clientSecret: string, public _tenantId: string, public _authScope = 'https://graph.microsoft.com/.default') {
        this.authScope = _authScope;
        this.clientId = _clientId;
        this.clientSecret = _clientSecret;
        this.axios = Axios.create({
          baseURL: `https://login.microsoftonline.com/${_tenantId}`,
        });
    }

    public async getAccessToken(): Promise<string> {
        return new Promise<string>((resolve, reject): void => {
            const queryString = QueryString.stringify({
                grant_type: 'client_credentials',
                client_id: this.clientId,
                scope: this.authScope,
                client_secret: this.clientSecret,
            });

            this.axios
                .post('/oauth2/v2.0/token', queryString, {
                    headers: {
                        'Content-Type': 'application/x-www-form-urlencoded',
                    },
                })
                .then(resp => {
                    if (resp.data && resp.data.access_token) {
                        resolve(resp.data.access_token);
                    } else {
                        reject(resp);
                    }
                })
                .catch(err => {
                    if (err.data) {
                        reject(err.data);
                    } else {
                        reject(err);
                }
            });
        });
    }
}
