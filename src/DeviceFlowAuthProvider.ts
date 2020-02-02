/**
 * @module DeviceFlowAuthProvider
 */

import { AuthenticationProvider } from '@microsoft/microsoft-graph-client';
import Axios, { AxiosInstance } from 'axios';
import QueryString from 'query-string';

export class FirstStageCode {
    private _userCode: string;
    private _deviceCode: string;
    constructor(userCode: string, deviceCode: string) {
        this._userCode = userCode;
        this._deviceCode = deviceCode;
    }

    get userCode(): string {
        return this._userCode;
    }

    get deviceCode(): string {
        return this._deviceCode;
    }
}

export class DeviceFlowAuthProvider implements AuthenticationProvider {
    private clientId: string;
    private scope: string;
    private axios: AxiosInstance;
    private deviceCode = '';
    constructor(public _clientId: string, public _scope = 'https://graph.microsoft.com/.default offline_access', public _tenantId = 'organizations') {
        this.clientId = _clientId;
        this.scope = _scope;
        this.axios = Axios.create({
            baseURL: `https://login.microsoftonline.com/${_tenantId}`,
        });
    }

    public async getAccessToken(): Promise<string> {
        return new Promise<string>((resolve, reject) => {
            if (!this.deviceCode) reject(new Error(''));
        });
    }

    public async getFirstStageCode(): Promise<FirstStageCode> {
        return new Promise<FirstStageCode>((resolve, reject) => {
            const queryString = QueryString.stringify({
                client_id: this.clientId,
                scope: this.scope,
            });

            this.axios
                .post('/oauth2/v2.0/devicecode', queryString, {
                    headers: {
                        'Content-Type': 'application/x-www-form-urlencoded',
                    },
                })
                .then(resp => {
                    if (resp.data && resp.data.user_code && resp.data.device_code) {
                        this.deviceCode = resp.data.device_code;
                        resolve(new FirstStageCode(resp.data.user_code, resp.data.device_code));
                    } else {
                        reject(new Error('Empty or invalid response data!'));
                    }
                })
                .catch(err => {
                    reject(err);
                });
        });
    }
}
