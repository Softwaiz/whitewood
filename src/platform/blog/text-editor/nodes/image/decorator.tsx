import { useLexicalComposerContext } from "@lexical/react/LexicalComposerContext";
import { $getNodeByKey } from "lexical";
import { Check, ChevronDown, Edit, Pen, Upload, X } from "lucide-react";
import { useCallback, useMemo, useState, type CSSProperties } from "react";
import { useDropzone } from "react-dropzone";
import { Button } from "~components/ui/button";
import { $isImageNode } from "./node";
import {
  AspectRatioOptions,
  getAspectRatioOption,
  getObjectFitOption,
  getObjectPositionOption,
  ObjectFitOptions,
  ObjectPositionOptions,
  type AspectRatioEntry,
  type ObjectFitEntry,
  type ObjectPositionEntry,
} from "./attributes";
import { MediaUploadState, useUploadFile } from "../utils/upload";
import { cn } from "~lib/utils";
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "~components/ui/dropdown-menu";

export default function ImageNodeDecorator(props: { nodeKey: string }) {
  const [editor] = useLexicalComposerContext();
  const [image, setImage] = useState<File>();
  const [url, setUrl] = useState<string>();
  const uploadManager = useUploadFile();

  const [aspectRatio, setAspectRatio] = useState<AspectRatioEntry | undefined>(
    getAspectRatioOption("none")
  );
  const [objectFit, setObjectFit] = useState<ObjectFitEntry | undefined>(
    getObjectFitOption("none")
  );
  const [objectPosition, setObjectPosition] = useState<
    ObjectPositionEntry | undefined
  >(getObjectPositionOption("none"));

  const picker = useDropzone({
    accept: {
      "image/png": [".png"],
      "image/jpg": [".jpg", ".jpeg"],
      "image/gif": [".gif"],
    },
    multiple: false,
    onDropAccepted(files, event) {
      let image = files[0];
      if (image) {
        setImage(image);
        let url = URL.createObjectURL(image);
        setUrl(url);
        editor.update(() => {
          let node = $getNodeByKey(props.nodeKey);
          if (node !== null && $isImageNode(node)) {
            node.src = url;
          }
          console.log("Image node: ", node);
        });
      }
    },
  });

  const onRemoveNode = useCallback(() => {
    let state = editor.getEditorState();
    editor.update(() => {
      let decoratedNode = $getNodeByKey(props.nodeKey, state);
      if (decoratedNode !== null && $isImageNode(decoratedNode)) {
        decoratedNode.remove();
      }
    });
  }, [editor, props.nodeKey]);

  const onAspectChange = useCallback(
    (nextAspect: AspectRatioEntry) => {
      editor.update(() => {
        let node = $getNodeByKey(props.nodeKey);
        if (node !== null && $isImageNode(node)) {
          node.ratio = nextAspect.value;
        }
      });
      setAspectRatio(nextAspect);
    },
    [editor, props.nodeKey]
  );

  const onObjectFitChange = useCallback(
    (objectFit: ObjectFitEntry) => {
      editor.update(() => {
        let node = $getNodeByKey(props.nodeKey);
        if (node !== null && $isImageNode(node)) {
          node.objectFit = objectFit.value;
        }
      });
      setObjectFit(objectFit);
    },
    [editor, props.nodeKey]
  );

  const onObjectPositionChange = useCallback(
    (objectPosition: ObjectPositionEntry) => {
      editor.update(() => {
        let node = $getNodeByKey(props.nodeKey);
        if (node !== null && $isImageNode(node)) {
          node.objectPosition = objectPosition.value;
        }
      });
      setObjectPosition(objectPosition);
    },
    [editor, props.nodeKey]
  );

  const onExportSelectedFile = useCallback(async () => {
    if (image) {
      const uploaded = await uploadManager.upload(image);
      if (uploaded) {
        setUrl(uploaded.url);
        editor.update(() => {
          let node = $getNodeByKey(props.nodeKey);
          if (node !== null && $isImageNode(node)) {
            node.src = uploaded.url;
            node.size = uploaded.size;
            node.mime = uploaded.type;
          }
        });
      }
    }
  }, [editor, image]);

  return (
    <div className="w-full bg-slate-50 border border-neutral-200 rounded-md">
      <div className="w-full min-h-[128px]">
        <div {...picker.getRootProps()}>
          <input {...picker.getInputProps()} />
        </div>
        {url ? (
          <div className="w-full">
            <img
              className="w-full aspect-[3/1] object-cover object-top transition-all duration-300 ease-in-out rounded-md"
              src={url}
              alt=""
              style={{
                aspectRatio:
                  aspectRatio?.value && aspectRatio.value !== "none"
                    ? aspectRatio.value
                    : undefined,
                objectFit:
                  objectFit?.value && objectFit.value !== "none"
                    ? (objectFit.value as CSSProperties["objectFit"])
                    : undefined,
                objectPosition:
                  objectPosition?.value && objectPosition.value !== "none"
                    ? objectPosition.value
                    : undefined,
              }}
            />
          </div>
        ) : picker.isDragActive ? (
          <p>Paste file here...</p>
        ) : (
          <div className="w-full py-12 space-x-4 flex flex-row items-center justify-center">
            <div className="flex flex-col items-center justify-center space-y-4">
              <img className="w-24 h-24" src="/image/new.svg" alt="New image" />
            </div>
            <div className="flex flex-col items-start justify-center">
              <h1 className="font-heading font-bold">Add a new image</h1>
              <p className="text-sm">Size allowed: {"<"}5Mb</p>
              <Button
                onClick={picker.open}
                size="sm"
                className="mt-4 px-4 py-2 text-sm bg-blue-500 text-blue-100"
              >
                Select an image
              </Button>
            </div>
          </div>
        )}
      </div>
      {image && (
        <div className="w-full h-auto gap-2 flex flex-row items-center justify-end py-2 px-2">
          <div className="flex flex-row items-center justify-center rounded-md overflow-hidden shadow-sm">
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button
                  size="sm"
                  className="text-xs font-normal bg-white text-slate-600 rounded-none border-r border-slate-200 hover:bg-neutral-50"
                >
                  Ratio: {aspectRatio?.title}{" "}
                  <ChevronDown size="24" color="var(--color-slate-600)" />
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="start">
                {AspectRatioOptions.map((aspect) => (
                  <DropdownMenuItem
                    key={aspect.value}
                    className="text-xs"
                    onClick={() => onAspectChange(aspect)}
                  >
                    Ratio {aspect.title}
                  </DropdownMenuItem>
                ))}
              </DropdownMenuContent>
            </DropdownMenu>
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button
                  size="sm"
                  className="text-xs font-normal bg-white text-slate-600 rounded-none border-r border-slate-200 hover:bg-neutral-50"
                >
                  Object Fit: {objectFit?.title}{" "}
                  <ChevronDown size="24" color="var(--color-slate-600)" />
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="start">
                {ObjectFitOptions.map((fit) => (
                  <DropdownMenuItem
                    key={fit.value}
                    className="text-xs"
                    onClick={() => onObjectFitChange(fit)}
                  >
                    {fit.title}
                  </DropdownMenuItem>
                ))}
              </DropdownMenuContent>
            </DropdownMenu>

            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button
                  size="sm"
                  className="text-xs font-normal bg-white text-slate-600 rounded-none hover:bg-neutral-50"
                >
                  Object position: {objectPosition?.title}{" "}
                  <ChevronDown size="24" color="var(--color-slate-600)" />
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="start">
                {ObjectPositionOptions.map((position) => (
                  <DropdownMenuItem
                    key={position.value}
                    className="text-xs"
                    onClick={() => onObjectPositionChange(position)}
                  >
                    {position.title}
                  </DropdownMenuItem>
                ))}
              </DropdownMenuContent>
            </DropdownMenu>
          </div>
          <div className="flex flex-row items-center justify-center rounded-md overflow-hidden shadow-sm bg-white">
            <Button
              size="sm"
              className="bg-white shadow-none rounded-none border-r border-slate-200 hover:bg-neutral-50"
              onClick={picker.open}
            >
              <Pen size={24} color="var(--color-slate-600)" />
            </Button>
            <Button
              size="sm"
              disabled={uploadManager.isUploading}
              className={cn(
                "bg-white text-slate-600 shadow-none rounded-none border-r border-slate-200 hover:bg-neutral-50",
                uploadManager.isUploading
                  ? "bg-blue-500 text-blue-100"
                  : uploadManager.url
                  ? "bg-green-500 text-green-100"
                  : ""
              )}
              onClick={() => {
                if (uploadManager.file === image && uploadManager.isUploaded) {
                  return;
                }
                if (uploadManager.isUploading) {
                  return;
                }
                onExportSelectedFile();
              }}
            >
              {uploadManager.isUploading ? (
                <>
                  <span>{uploadManager.percent}%</span>
                </>
              ) : uploadManager.url ? (
                <>
                  <Check size={24} color="currentColor" />
                </>
              ) : (
                <>
                  <Upload size={24} color="currentColor" />
                </>
              )}
            </Button>
            <Button
              size="sm"
              onClick={() => onRemoveNode()}
              className="bg-red-500 text-red-100 shadow-none rounded-none  hover:bg-red-600 hover:text-red-200"
            >
              <X size={24} color="currentColor" />
            </Button>
          </div>
        </div>
      )}
    </div>
  );
}
