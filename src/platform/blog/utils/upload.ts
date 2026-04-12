import type { PrepareUploadSuccess } from "./types";

export enum UploadScope {
    Articles = "articles",
    Authors = "authors"
}

export async function prepareFileUpload(file: File, scope: UploadScope | undefined = UploadScope.Articles) {
    let params = new URLSearchParams();
    params.set('name', file.name);
    params.set('type', file.type);
    params.set('size', file.size.toString());
    params.set("scope", scope);

    return fetch(
        `/upload/prepare?${params.toString()}`,
        {
            method: "GET",
        }
    )
        .then((res) => res.json())
        .then((response) => {
            if (response.data) {
                return {
                    ...response as PrepareUploadSuccess,
                    type: file.type,
                    size: file.size
                }
            }
            throw response.error;
        })
}

interface UploadBlobOption {
    blob: Blob;
    url: string;
    token: string;
    onProgress(percent: number): void;
}

export function uploadFile(options: UploadBlobOption): Promise<boolean> {
    return new Promise((resolve, reject) => {
        let request = new XMLHttpRequest();

        request.open('PUT', options.url, true);
        request.setRequestHeader("Authorization", `Bearer ${options.token}`);

        request.upload.onprogress = function (event) {
            if (event.lengthComputable) {
                const percentComplete = (event.loaded / event.total) * 100;
                options.onProgress(parseFloat(percentComplete.toPrecision(2)));
            }
        };

        request.onload = function () {
            if (request.status >= 200 && request.status < 300) {
                resolve(true);
            } else {
                reject(new Error("Upload failed !"));
            }
        };

        request.onerror = function () {
            reject(request.response);
        };

        request.send(options.blob);
    })
}

