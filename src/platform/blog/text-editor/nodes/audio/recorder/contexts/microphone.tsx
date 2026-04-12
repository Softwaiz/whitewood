import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useState,
  type ComponentType,
  type JSX,
  type PropsWithChildren,
} from "react";
import { useMicrophonePermissionContext } from "./permission";
import {
  useComputeRecordingState,
  useElapsedTimeRecorder,
  type RecordingStateObject,
} from "../hooks";

interface MediaRecorderContextType {
  audioContext?: AudioContext;
  recorder?: MediaRecorder;
  createRecorder: () => MediaRecorder | null;
  state: RecordingStateObject;
  data?: Blob;
  timer: ReturnType<typeof useElapsedTimeRecorder>;
}

const MediaRecorderContext = createContext<MediaRecorderContextType>(
  undefined as any
);

export function useMicrophoneContext() {
  const context = useContext(MediaRecorderContext);
  if (!context) {
    throw new Error(
      "useMediaRecorderContext must be used within a AudioRecorderProvider"
    );
  }
  return context;
}

export function AudioRecorderProvider({ children }: PropsWithChildren<{}>) {
  const permission = useMicrophonePermissionContext();
  const [recorder, setRecorder] = useState<MediaRecorder>();
  const [audioContext, setAudioContext] = useState<AudioContext>();
  const recordingState = useComputeRecordingState(recorder);
  const [recordedBlob, setRecordedBlob] = useState<Blob>();

  const timer = useElapsedTimeRecorder();

  const createRecorder = useCallback(() => {
    if (!permission.stream) {
      console.error("No audio stream available.");
      return null;
    }

    const processingContext = new AudioContext();
    processingContext.createMediaStreamSource(permission.stream);
    setAudioContext(processingContext);

    const recorder = new MediaRecorder(permission.stream, {
      mimeType: "audio/webm",
    });

    setRecorder(recorder);

    return recorder;
  }, [permission?.stream]);

  useEffect(() => {
    if (permission?.stream && permission.isGranted && !recorder) {
      createRecorder();
    }
  }, [permission?.stream, permission.isGranted, recorder, createRecorder]);


  useEffect(() => {
        if(recordingState.isPaused && !timer.paused) {
          timer.pauseTimer();
          console.log("pausing timer");
        }
  
        if(recordingState.isRecording && !timer.started) {
          timer.startTimer();
        }
  }, [recordingState.isPaused, timer.paused, recordingState.isRecording, timer.started]);

  useEffect(() => {
    if (recorder) {

      const onStop = () => {
        timer.stopTimer();
        console.log("Recording stopped");
      };

      const onResume = () => {
        timer.resumeTimer();
        console.log("Recording resumed");
      };

      const onDataAvailable = (event: BlobEvent) => {
        if (event.data.size > 0) {
          const audioBlob = new Blob([event.data], { type: "audio/webm" });
          setRecordedBlob(audioBlob);
        }
      };
      
      recorder.addEventListener("stop", onStop);
      recorder.addEventListener("resume", onResume);
      recorder.addEventListener("dataavailable", onDataAvailable);

      return () => {
        recorder.removeEventListener("stop", onStop);
        recorder.removeEventListener("resume", onResume);
        recorder.removeEventListener("dataavailable", onDataAvailable);
      };
    }
  }, [recorder, timer]);

  return (
    <MediaRecorderContext.Provider
      value={{
        audioContext,
        recorder,
        createRecorder,
        state: recordingState,
        data: recordedBlob,
        timer,
      }}
    >
      {children}
    </MediaRecorderContext.Provider>
  );
}

export function withAudioRecorder<Props extends JSX.IntrinsicAttributes>(
  SubComponent: ComponentType<Props>
) {
  return (props: Props) => {
    return (
      <AudioRecorderProvider>
        <SubComponent {...props} />
      </AudioRecorderProvider>
    );
  };
}