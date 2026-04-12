import { useCallback, useMemo, useState } from "react";
import { prepareFileUpload, uploadFile, UploadScope } from "~platform/blog/utils/upload";

export enum MediaUploadState {
  INACTIVE = "inactive",
  PREPARING = "preparing",
  UPLOADING = "uploading",
  UPLOADED = "uploaded",
  ERROR = "error",
}

export function useUploadFile() {
  const [selectedFile, setSelectedFile] = useState<File>();
  const [uploadState, setUploadState] = useState(MediaUploadState.INACTIVE);
  const [percent, setPercent] = useState(0);
  const [url, setUrl] = useState("");

  const upload = useCallback(async (file: File) => {
    try {
      setSelectedFile(file);
      setUrl("");
      setUploadState(MediaUploadState.PREPARING);
      const preparedFile = await prepareFileUpload(file, UploadScope.Articles);
      if (preparedFile.data) {
        setUploadState(MediaUploadState.UPLOADING);
        let uploaded = await uploadFile({
          blob: file,
          token: preparedFile.data.token,
          url: preparedFile.data.upload,
          onProgress(percent) {
            setPercent(percent);
          },
        });
        setUploadState(MediaUploadState.UPLOADED);
        if (uploaded) {
          setUrl(preparedFile.data.download);
          return {
            url: preparedFile.data.download,
            size: preparedFile.size,
            type: preparedFile.type,
          };
        }
      }
    } catch (error) {
      setUploadState(MediaUploadState.ERROR);
      return undefined;
    }
  }, []);

  const isUploading = useMemo(() => {
    return [MediaUploadState.PREPARING, MediaUploadState.UPLOADING].includes(
      uploadState
    );
  }, [uploadState]);

  const isUploaded = useMemo(() => {
    return [MediaUploadState.UPLOADED].includes(uploadState) && url;
  }, [uploadState, url]);

  return {
    file: selectedFile,
    state: uploadState,
    percent,
    upload,
    isUploading,
    isUploaded,
    url,
  };
}
