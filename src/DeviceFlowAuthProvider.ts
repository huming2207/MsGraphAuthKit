/**
 * @module DeviceFlowAuthProvider
 */

import { AuthenticationProvider } from '@microsoft/microsoft-graph-client';
import Axios, { AxiosInstance } from 'axios';
import QueryString from 'query-string';

export class DeviceFlowAuthProvider implements AuthenticationProvider {
    private clientId: string;
    private scope: string;
    private axios: AxiosInstance;
    constructor(public _clientId: string, public _scope = "https://graph.microsoft.com/.default offline_access", public _tenantId = "organizations") {
        this.clientId = _clientId;
        this.scope = _scope;
        this.axios = Axios.create({
            baseURL: `https://login.microsoftonline.com/${_tenantId}`,
        });
    }

    public async getAccessToken(): Promise<string> { 
        return new Promise<string>((resolve, reject) => {
            
        });
    }

    public async getDeviceCode(): Promise<string> {
        return new Promise<string>((resolve, reject) => {
            const queryString = QueryString.stringify({
                client_id: this.clientId,
                scope: this.scope
            }); 

            this.axios
                .post('/oauth2/v2.0/devicecode', queryString, {
                    headers: {
                        'Content-Type': 'application/x-www-form-urlencoded',
                    },
                })
                .then(resp => {
                    if (resp.data && resp.data.device_code) {
                        resolve(resp.data.device_code);
                    } else {
                        reject(new Error(''));
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