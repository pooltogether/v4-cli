export enum StatusState {
    LOADING = 'LOADING',
    REQUEST = 'REQUEST',
    SUCCESS = 'SUCCESS',
    FAILURE = 'FAILURE'
}

export type StatusError = {
    code: number;
    msg: string;
};

export interface Status {
    status: StatusState;
    createdAt: number;
    updatedAt?: number;
    runtime?: number;
    meta?: any;
    error?: StatusError;
}
