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
    constructor(public _clientId: string, public _scope: string, public _tenantId = "organizations") {
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

        });
    }
}