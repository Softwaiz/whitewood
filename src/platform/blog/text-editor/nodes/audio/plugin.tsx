import { useLexicalComposerContext } from "@lexical/react/LexicalComposerContext";
import {
    $getRoot,
  $getSelection,
  $insertNodes,
  COMMAND_PRIORITY_EDITOR,
  createCommand,
  DELETE_CHARACTER_COMMAND,
} from "lexical";
import { useEffect } from "react";
import { $createAudioNode, $isAudioNode } from "./node";

export const INSERT_AUDIO_COMMAND = createCommand<void>("insert:audio");

export function AudioPlugin() {
  const [editor] = useLexicalComposerContext();

  useEffect(() => {
    return editor.registerCommand(
      INSERT_AUDIO_COMMAND,
      () => {
        let node = $createAudioNode();
        $insertNodes([node]);
        console.log("Audio node inserted");
        return true;
      },
      COMMAND_PRIORITY_EDITOR
    );
  }, []);

  useEffect(() => {
    return editor.registerCommand(
      DELETE_CHARACTER_COMMAND,
      (payload) => {
        const selection = editor.getEditorState().read(() => {
          return $getSelection();
        });

        if (selection !== null) {
          const node = selection.getNodes()[0];
          if (node !== null && $isAudioNode(node)) {
            node.remove();
            return true;
          }
        }
        return false;
      },
      COMMAND_PRIORITY_EDITOR
    );
  }, [editor]);

  return <></>;
}
