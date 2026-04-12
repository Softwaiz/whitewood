import { useLexicalComposerContext } from "@lexical/react/LexicalComposerContext";
import { Check, FileSearch, Mic, Upload, X } from "lucide-react";
import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useState,
  type ComponentType,
} from "react";
import { useDropzone } from "react-dropzone";
import { Button } from "~components/ui/button";
import { AudioRecorder } from "./recorder";
import {
  AudioSelectionOption,
  useAudioNodeDecoratorContext,
  withAudioNodeDecoratorProvider,
  type AudioNodeDecoratorProps,
} from "../context";
import { cn } from "~lib/utils";

function _AudioNodeDecorator(props: AudioNodeDecoratorProps) {
  const [editor] = useLexicalComposerContext();
  const {
    data: selectedFile,
    option,
    setSelectedOption,
    setSelectedFile,
  } = useAudioNodeDecoratorContext();

  const picker = useDropzone({
    accept: {
      "audio/mpeg": [".mp3"],
      "audio/ogg": [".ogg"],
      "audio/wav": [".wav"],
      "audio/webm": [".webm"],
      "audio/x-m4a": [".m4a"],
    },
    multiple: false,
    onDropAccepted(files, event) {
      let audio = files[0];
      if (audio) {
        setSelectedOption(AudioSelectionOption.selected);
        setSelectedFile(audio);
        /*editor.update(() => {
          let node = $getNodeByKey(props.nodeKey);
          if (node !== null && $isAudioNode(node)) {
            node.src = url;
          }
          console.log("Image node: ", node);
        });*/
      }
    },
  });

  const onRecordAudio = useCallback(() => {
    setSelectedOption(AudioSelectionOption.recorded);
  }, []);

  const onPickFile = useCallback(() => {
    picker.open();
  }, [picker]);

  return (
    <div className="w-full bg-slate-50 border border-neutral-200 rounded-md">
      <div {...picker.getRootProps()}>
        <input {...picker.getInputProps()} />
      </div>

      <div className="w-full flex flex-row items-center justify-center gap-4 py-4">
        {(!Boolean(option) ||
          (Boolean(option) && option !== AudioSelectionOption.recorded)) && (
          <button
            onClick={onRecordAudio}
            className="flex flex-col items-center justify-center w-20 aspect-square rounded-full bg-green-500 text-green-100 transition-all duration-100 hover:bg-green-600 hover:text-green-200"
          >
            <Mic size={32} color="currentColor" />
          </button>
        )}

        {(!Boolean(option) ||
          (option === AudioSelectionOption.selected && !selectedFile)) && (
          <button
            onClick={onPickFile}
            className="flex flex-col items-center justify-center w-20 aspect-square rounded-full bg-green-500 text-green-100 transition-all duration-100 hover:bg-green-600 hover:text-green-200"
          >
            <FileSearch size={32} color="currentColor" />
          </button>
        )}
      </div>

      {option === AudioSelectionOption.recorded && (
        <>
          <AudioRecorder />
        </>
      )}

      <SelectedOrRecordedAudio />
    </div>
  );
}

function SelectedOrRecordedAudio() {
  const {
    data: selectedFile,
    setSelectedFile,
    setRecordedContent,
    removeSelectedFile,
    ...nodeProps
  } = useAudioNodeDecoratorContext();

  const media = useMemo(() => {
    if (selectedFile) {
      return selectedFile;
    }
    return null;
  }, [selectedFile]);

  const url = useMemo(() => {
    if (media) {
      return URL.createObjectURL(media);
    }
  }, [media]);

  useEffect(() => {
    return () => {
      if (url) {
        URL.revokeObjectURL(url);
      }
    };
  }, [url]);

  const onRemoveSelectedFile = useCallback(() => {
    if (url) {
      URL.revokeObjectURL(url);
    }

    if (selectedFile) {
      removeSelectedFile();
    }
  }, [selectedFile, url]);

  if (!url) {
    return null;
  }

  return (
    <div className="w-full flex flex-row items-center justify-center gap-4 px-4 py-2">
      <audio controls src={url} className="w-full" />
      {nodeProps.file === selectedFile && (
        <button
          disabled={nodeProps.isUploading}
          className={cn(
            "p-3 flex flex-row items-center justify-center gap-2 bg-blue-500 text-blue-100 rounded-full transition-all duration-100",
            nodeProps.isUploaded
              ? "bg-green-500 text-green-100"
              : "bg-blue-500 text-blue-100"
          )}
          onClick={nodeProps.upload}
        >
          {nodeProps.isUploading ? (
            <>
              <span className="text-nowrap text-xs">{nodeProps.percent}%</span>
              <Upload size={16} color="currentColor" />
            </>
          ) : nodeProps.isUploaded ? (
            <>
              <Check size={16} color="currentColor" />
            </>
          ) : (
            <>
              <Upload size={16} color="currentColor" />
            </>
          )}
        </button>
      )}

      <button
        className="aspect-square p-3 flex flex-col items-center justify-center bg-red-500 text-red-100 rounded-full"
        onClick={onRemoveSelectedFile}
      >
        <X size={16} color="currentColor" />
      </button>
    </div>
  );
}

export default withAudioNodeDecoratorProvider(_AudioNodeDecorator);
