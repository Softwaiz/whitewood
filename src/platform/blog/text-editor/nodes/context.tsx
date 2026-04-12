import { createContext, useContext, useState, type ComponentType } from "react";
import { useUploadFile } from "./utils/upload";

export enum AudioSelectionOption {
  recorded = "recorded",
  selected = "selected",
}

type UploadFileHook = ReturnType<typeof useUploadFile>;
interface AudioDecoratorNodeContextType extends Omit<UploadFileHook, 'upload'>  {
  nodeKey: string;

  data?: Blob;

  option?: AudioSelectionOption;
  setSelectedOption: (option?: AudioSelectionOption) => void;

  setSelectedFile: (file: File) => void;
  setRecordedContent: (blob: Blob) => void;
  removeSelectedFile: () => void;

  upload: () => ReturnType<UploadFileHook['upload']> | undefined;
}

const AudioNodeDecoratorContext = createContext<AudioDecoratorNodeContextType>(
  undefined as any
);

export function useAudioNodeDecoratorContext() {
  const context = useContext(AudioNodeDecoratorContext);
  if (!context) {
    throw new Error(
      "useAudioDecoratorContext must be used within an AudioDecoratorProvider"
    );
  }
  return context;
}

function AudioNodeDecoratorProvider({
  children,
  nodeKey,
}: {
  children: React.ReactNode;
  nodeKey: string;
}) {
  const [selectedFile, setSelectedFile] = useState<Blob>();
  const [selectedOption, setSelectedOption] = useState<AudioSelectionOption>();
  const uploadManager = useUploadFile();

  return (
    <AudioNodeDecoratorContext.Provider
      value={{
        nodeKey,
        data: selectedFile,
        option: selectedOption,

        ...uploadManager,

        upload: async () => {
          if (!selectedFile) {
            return undefined;
          } else if (selectedFile instanceof File) {
            return uploadManager.upload(selectedFile);
          } else {
            //@TODO: handle file extension properly
            let file = new File([selectedFile], `${nodeKey}.webm`);
            uploadManager.upload(file);
          }
        },

        setSelectedFile: (file: File) => {
          setSelectedFile(file);
          setSelectedOption(AudioSelectionOption.selected);
        },

        setRecordedContent: (blob: Blob) => {
          setSelectedFile(blob);
          setSelectedOption(AudioSelectionOption.recorded);
        },

        removeSelectedFile: () => {
          setSelectedFile(undefined);
          setSelectedOption(undefined);
        },

        setSelectedOption(option) {
          setSelectedOption(option);
        },
      }}
    >
      {children}
    </AudioNodeDecoratorContext.Provider>
  );
}

export interface AudioNodeDecoratorProps {
  nodeKey: string;
}

export function withAudioNodeDecoratorProvider<
  Props extends AudioNodeDecoratorProps
>(Component: ComponentType<Props>) {
  return function (props: Props) {
    return (
      <AudioNodeDecoratorProvider nodeKey={props.nodeKey}>
        <Component {...props} />
      </AudioNodeDecoratorProvider>
    );
  };
}
