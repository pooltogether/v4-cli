export interface Status {
    status: 'LOADING' | 'REQUEST' | 'SUCCESS' | 'FAILURE';
    createdAt: number;
    updatedAt?: number;
    runtime?: number;
    meta?: any;
    error?: Error;
}
