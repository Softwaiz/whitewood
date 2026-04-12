import {
  createContext,
  useContext,
  type ComponentType,
  type JSX,
  type PropsWithChildren,
} from "react";
import { useMicrophonePermission as useMicrophonePermissionBase } from "../hooks";

const MicrophonePermissionContext = createContext<
  ReturnType<typeof useMicrophonePermissionBase>
>(undefined as any);

export function useMicrophonePermissionContext() {
  const value = useContext(MicrophonePermissionContext);
  return value;
}

export function MicrophoneAccessPermissionProvider({
  children,
}: PropsWithChildren<{}>) {
  const permission = useMicrophonePermissionBase();

  return (
    <MicrophonePermissionContext.Provider value={permission}>
      {children}
    </MicrophonePermissionContext.Provider>
  );
}

export function withMicrophonePermissionProvider<
  Props extends JSX.IntrinsicAttributes
>(SubComponent: ComponentType<Props>) {
  return (props: Props) => {
    return (
      <MicrophoneAccessPermissionProvider>
        <SubComponent {...props} />
      </MicrophoneAccessPermissionProvider>
    );
  };
}
