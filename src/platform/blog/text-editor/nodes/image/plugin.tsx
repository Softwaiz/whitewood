import { useLexicalComposerContext } from "@lexical/react/LexicalComposerContext";
import {
    $getSelection,
  $insertNodes,
  COMMAND_PRIORITY_EDITOR,
  createCommand,
  DELETE_CHARACTER_COMMAND,
} from "lexical";
import { useEffect } from "react";
import { $createImageNode, $isImageNode } from "./node";

export const INSERT_IMAGE_COMMAND = createCommand<void>("insert:image");

export function ImagePlugin() {
  const [editor] = useLexicalComposerContext();

  useEffect(() => {
    return editor.registerCommand(
      INSERT_IMAGE_COMMAND,
      () => {
        let node = $createImageNode();
        $insertNodes([node]);
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
          if (node !== null && $isImageNode(node)) {
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
