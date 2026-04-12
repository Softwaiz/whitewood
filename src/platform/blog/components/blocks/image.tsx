"use client";
import { type ComponentConfig, type CustomFieldRender } from "@puckeditor/core";
import { useDropzone } from "react-dropzone";
import { useCallback, useEffect, useMemo, useState } from "react";
import { Button } from "~components/ui/button";
import { ArrowUp, Pen, Plus } from "lucide-react";
import type { MediaObject, MediaUploadResponse } from "~platform/lib/media";
import { cn } from "~lib/utils";
import { MarginField, type Margin } from "../fields/margin";
import { PaddingField, type Padding } from "../fields/padding";

export interface ImageProps {
    source: MediaObject;
    alt: string;
    caption: string;
    aspectRatio: "unset" | "16/9" | "9/16" | "3/4" | "4/3" | 3;
    margin: Margin;
    padding: Padding;
}

function ImageRender({ source, caption, alt, aspectRatio }: ImageProps) {
    return <figure className="w-full flex flex-col items-center justify-center">
        {
            source && <img
                className={
                    cn(
                        "w-full min-h-45 aspect-video object-cover",
                        aspectRatio === "16/9" && "lg:min-h-auto lg:aspect-video",
                        aspectRatio === "9/16" && "lg:min-h-auto lg:aspect-9/16",
                        aspectRatio === "3/4" && "lg:min-h-auto lg:aspect-3/4",
                        aspectRatio === "4/3" && "lg:min-h-auto lg:aspect-4/3",
                        aspectRatio === 3 && "lg:min-h-auto lg:aspect-[3]"
                    )
                }
                src={source?.url}
                alt={alt} />
        }
        {caption && <figcaption className="text-neutral-800">{caption}</figcaption>}
    </figure>
}

function ImagePropertySource(props: Parameters<CustomFieldRender<MediaObject>>[0]) {
    const [file, setSelectedFile] = useState<File>();
    const [isNew, setIsNew] = useState(false);
    const [previewURL, setPreviewURL] = useState<string | null>(props.value?.url || null);

    const dropzone = useDropzone({
        accept: {
            "image/jpeg": [".jpg", ".jpeg"],
            "image/png": [".png"],
            "image/webp": [".webp"]
        },
        noClick: true,
        noKeyboard: true,
        onDropAccepted(files) {
            const acceptedFile = files.at(0);
            if (!acceptedFile) {
                return;
            }

            setSelectedFile(acceptedFile);
            setIsNew(true);
        },
    });


    useEffect(() => {
        if (file) {
            const objectURL = URL.createObjectURL(file);
            setPreviewURL(objectURL);

            return () => {
                URL.revokeObjectURL(objectURL);
            };
        }

        setPreviewURL(props.value?.url || null);
        setIsNew(false);
    }, [file, props.value?.url]);

    const [uploading, setUploading] = useState(false);
    const fallbackPreview = useMemo(() => "https://placehold.co/600x400/f59e0b/ffffff?text=Whitewood", []);

    const upload = useCallback(async () => {
        if (!file) {
            return;
        }
        if (uploading) {
            return;
        }
        setUploading(true);
        const formData = new FormData();
        formData.set("file", file);

        return fetch(`/platform/content/media/upload`, {
            method: "POST",
            body: formData,
        })
            .then(async (res) => {
                const payload = await res.json() as Partial<MediaUploadResponse> & { message?: string };

                if (!res.ok) {
                    throw new Error(payload.message || "Image upload failed.");
                }

                return payload;
            })
            .then((res) => {
                if (res.media) {
                    props.onChange(res.media);
                    setSelectedFile(undefined);
                    setIsNew(false);
                }
            })
            .catch((err) => {
                /// an error occured while uploading the image
                console.error(err);
            })
            .finally(() => {
                setUploading(false);
            });
    }, [file, props, uploading]);


    return <div className="w-full space-y-4">
        <div
            {...dropzone.getRootProps({
                className: "overflow-hidden rounded-2xl border border-dashed border-neutral-300 bg-neutral-50",
            })}
        >
            <img
                className="h-60 w-full object-cover"
                src={previewURL || fallbackPreview}
                alt="Selected image preview"
            />
        </div>
        <input {...dropzone.getInputProps()} />
        <div className="w-full flex flex-row items-center justify-start gap-2">
            <Button
                type="button"
                size="icon-sm"
                className="w-8 h-8 rounded-full"
                title="Ajouter une image"
                onClick={() => {
                    dropzone.open();
                }}>
                {previewURL ? <Pen size={16} /> : <Plus size={16} />}
            </Button>
            {previewURL && isNew && <Button
                type="button"
                size="sm"
                className="w-8 h-8 rounded-full"
                title="Téléverser l'image"
                disabled={uploading}
                onClick={upload}>
                <ArrowUp />
            </Button>}
        </div>
    </div>
}


export const Image: ComponentConfig<ImageProps> = {
    label: "Image",
    fields: {
        source: {
            type: "custom",
            render: ImagePropertySource,
        },
        alt: {
            type: "text"
        },
        caption: {
            type: "text"
        },
        aspectRatio: {
            label: "Aspect Ratio",
            type: "radio",
            options: [
                { label: "Default", value: "unset" },
                { label: "Square", value: '1/1' },
                { label: "Portrait", value: '9/16' },
                { label: "Video", value: '16/9' },
                { label: "3", value: 3 }
            ]
        },
        padding: PaddingField,
        margin: MarginField
    },
    render: ImageRender,
    defaultProps: {
        source: {
            url: "https://placehold.co/600x400/f59e0b/ffffff?text=Whitewood",
            path: "https://placehold.co/600x400/f59e0b/ffffff?text=Whitewood",
            name: "placehold.co/default.png",
            type: "image/png",
            size: 2048,
        } as MediaObject,
        alt: "A new image",
        caption: "A new caption for the image",
        aspectRatio: "unset",
        padding: { top: 0, left: 0, right: 0, bottom: 0 },
        margin: { top: 0, left: 0, right: 0, bottom: 0 }
    }
}

