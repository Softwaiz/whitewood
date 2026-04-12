import { useCallback, useEffect, useRef, useState } from "react";

function useIsMicrophoneAvailable() {
  const [isAvailable, setIsAvailable] = useState(false);
  const [error, setError] = useState(null);
  const [stream, setStream] = useState<MediaStream>();

  const requestStream = useCallback(async () => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({
        audio: true,
      });
      setStream(stream);
      setIsAvailable(true);
    } catch (err: any) {
      setError(err);
    }
  }, []);

  useEffect(() => {
    requestStream();
  }, []);

  return { stream, isAvailable, requestStream, error };
}

export function useMicrophonePermission() {
  const availability = useIsMicrophoneAvailable();
  const [permission, setPermission] = useState<PermissionState | null>(null);

  const checkPermission = useCallback(async () => {
    try {
      const status = await navigator.permissions.query({ name: "microphone" });
      setPermission(status.state);
      if(status.state === "granted") {
        availability.requestStream();
      }
    } catch (error) {
      console.error("Error checking microphone permission:", error);
    }
  }, []);

  useEffect(() => {
    if (availability.isAvailable) {
      checkPermission();
    }
  }, [availability.isAvailable, checkPermission]);

  return {
    state: permission,
    requestPermission: checkPermission,
    isGranted: permission === "granted",
    isDenied: permission === "denied",
    isAvailable: availability.isAvailable,
    stream: availability.stream,
  };
}


const RECORDING_STATE_MAP = {
  "recording": {
    isRecording: true,
    isStarted: true,
    isPaused: false,
    isStopped: false,
  },
  "paused": {
    isRecording: true,
    isStarted: true,
    isPaused: true,
    isStopped: false,
  },
  "inactive": {
    isRecording: false,
    isStarted: false,
    isPaused: false,
    isStopped: true,
  },
};

export type RecordingStateObject = (typeof RECORDING_STATE_MAP)[keyof typeof RECORDING_STATE_MAP];

export function useComputeRecordingState(recorder: MediaRecorder | undefined): RecordingStateObject {
  const [recordingState, setRecordingState] = useState<RecordingStateObject>(RECORDING_STATE_MAP.inactive);

  useEffect(() => {
    if (recorder) {
      const state = RECORDING_STATE_MAP[recorder.state as keyof typeof RECORDING_STATE_MAP];
      setRecordingState(state);

      const startListener = () => {
        setRecordingState(RECORDING_STATE_MAP.recording);
        console.log("start listener invoked");
      }

      const pauseListener = () => {
        setRecordingState(RECORDING_STATE_MAP.paused);
        console.log("pause listener invoked");
      }

      const resumeListener = () => {
        setRecordingState(RECORDING_STATE_MAP.recording);
        console.log("resume listener invoked");
      }

      const stopListener = () => {
        setRecordingState(RECORDING_STATE_MAP.inactive);
        console.log("stop listener invoked");
      }

      recorder.addEventListener("start", startListener);
      recorder.addEventListener("pause", pauseListener, {once: false});
      recorder.addEventListener("stop", stopListener);
      recorder.addEventListener("resume", resumeListener);

      return () => {
        recorder.removeEventListener("start", startListener);
        recorder.removeEventListener("pause", pauseListener);
        recorder.removeEventListener("stop", stopListener);
        recorder.removeEventListener("resume", resumeListener);
      }

    }
  }, [recorder, setRecordingState]);

  return recordingState;
}


export function useElapsedTimeRecorder() {
  const [elapsedTime, setElapsedTime] = useState(0);
  const [started, setStarted] = useState(false);
  const [paused, setPaused] = useState(false);
  const timerRef = useRef<ReturnType<typeof setInterval> | null>(null);


  const configureInterval = useCallback(() => {
    timerRef.current = setInterval(() => {
      setElapsedTime((prev) => prev + 500);
    }, 500);
  }, []);

  const cancelInterval = useCallback(() => {
    if (timerRef.current) {
      clearInterval(timerRef.current);
      timerRef.current = null;
    }
  }, []);

  const stopTimer = useCallback(() => {
    cancelInterval();
    let finalElapsedTime = elapsedTime;
    setStarted(false);
    setPaused(false);
    setElapsedTime(0);
    return finalElapsedTime;
  }, [elapsedTime]);

  const startTimer = useCallback(() => {
    if(started) {
    return;
    }
    setElapsedTime(0);
    configureInterval();
    setStarted(true);
    setPaused(false);
  }, [started, stopTimer]);


  const pauseTimer = useCallback(() => {
    cancelInterval();
    setStarted(true);
    setPaused(true);
    console.log("pausing timer !");
  }
  , []);

  const resumeTimer = useCallback(() => {
    if (paused && !timerRef.current) {
      console.log("resuming timer.....")
      configureInterval();
      setStarted(true);
      setPaused(false);
    }
  }, [paused]);

  useEffect(() => { 
    return () => {
      cancelInterval();
    };
  }, []);


  return {
    elapsedTime,
    started,
    paused,
    startTimer,
    stopTimer,
    pauseTimer,
    resumeTimer,
  };

}