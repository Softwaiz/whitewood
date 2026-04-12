import { Button } from "~components/ui/button";
import { useEffect, useMemo, useState } from "react";
import {
  useMicrophonePermissionContext,
  withMicrophonePermissionProvider,
} from "./contexts/permission";
import { useMicrophoneContext, withAudioRecorder } from "./contexts/microphone";
import { useAudioNodeDecoratorContext } from "../../context";
import { Pause, Play, StopCircle, X } from "lucide-react";

const WhenPermissionIsGranted = () => {
  const decorator = useAudioNodeDecoratorContext();
  const microphone = useMicrophoneContext();

  useEffect(() => {
    let data = microphone.data;
    if (data) {
      decorator.setRecordedContent(data);
    }
  }, [microphone.data]);

  const elapsedTimeAsString = (elapsedTime: number) => {
    const hours = Math.floor(elapsedTime / 3600000);
    if (hours > 0) {
      return `${hours}h ${Math.floor((elapsedTime % 3600000) / 60000)}m`;
    }
    const minutes = Math.floor(elapsedTime / 60000);
    if (minutes > 0) {
      return `${minutes}m ${Math.floor((elapsedTime % 60000) / 1000)}s`;
    }
    const seconds = Math.floor(elapsedTime / 1000);
    return `${seconds}s`;
  };


  return (
    <div className="w-full flex flex-col items-center justify-center gap-4 p-4">
      <p className="font-bold text-4xl">
        {elapsedTimeAsString(microphone.timer.elapsedTime)}
      </p>
      <div className="w-full flex flex-row items-center justify-center gap-4">
        <div>
          <Button
            size="icon"
            disabled={microphone.state.isStarted && !microphone.state.isPaused}
            className="bg-white text-black rounded-full shadow-md hover:bg-gray-200"
            onClick={() => {
              if (microphone.recorder) {
                if (microphone.recorder.state === "paused") {
                  microphone.recorder.resume();
                } else if (microphone.recorder.state === "recording") {
                  return;
                } else {
                  microphone.recorder.start();
                }
              } else {
                console.error("Recorder is not initialized.");
              }
            }}
          >
            <Play size={24} />
          </Button>

          <Button
            size="icon"
            disabled={microphone.state.isPaused}
            className="bg-white text-black rounded-full shadow-md hover:bg-gray-200"
            onClick={() => {
              if (microphone.recorder?.state === "recording") {
                microphone.recorder.pause();
                console.log("clicked on the pause button");
              }
            }}
          >
            <Pause size={24} />
          </Button>
        </div>

        <div className="space-x-2">
          <Button
            size="icon"
            disabled={!microphone.state.isRecording}
            className="bg-white text-black rounded-full shadow-md hover:bg-gray-200"
            onClick={() => {
              if (microphone.recorder) {
                microphone.recorder.stop();
              } else {
                console.error("Recorder is not initialized.");
              }
            }}
          >
            <StopCircle size={24} />
          </Button>
          <Button
            size="icon"
            className="bg-red-500 text-white rounded-full hover:bg-red-600"
            onClick={() => {
              decorator.setSelectedOption(undefined);
            }}
          >
            <X size={24} />
          </Button>
        </div>
      </div>
    </div>
  );
};

const WhenPermissionIsDenied = () => {
  const permission = useMicrophonePermissionContext();

  return (
    <div>
      <p className="text-red-500">
        Microphone access denied. Please enable it in your browser settings.
      </p>
      <Button onClick={permission.requestPermission}>Request Permission</Button>
    </div>
  );
};

const WhenPermissionIsUnknown = () => {
  const permission = useMicrophonePermissionContext();
  return (
    <div>
      <p className="text-yellow-500">
        Microphone access is required to record audio.
      </p>
      <Button onClick={permission.requestPermission}>
        Request Microphone Access
      </Button>
    </div>
  );
};

function _AudioRecorder() {
  const permission = useMicrophonePermissionContext();

  return (
    <div className="w-full">
      {permission.isGranted ? (
        <WhenPermissionIsGranted />
      ) : (
        <>
          {permission.isDenied ? (
            <WhenPermissionIsDenied />
          ) : (
            <WhenPermissionIsUnknown />
          )}
        </>
      )}
    </div>
  );
}

export const AudioRecorder = withMicrophonePermissionProvider(
  withAudioRecorder(_AudioRecorder)
);
