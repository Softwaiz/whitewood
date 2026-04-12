export interface PrepareUploadSuccess {
    data: {
        signedUrl: string;
        path: string;
        token: string;
        upload: string;
        download: string;
    }
}