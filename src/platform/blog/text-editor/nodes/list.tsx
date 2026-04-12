import {
  $createListNode,
  $insertList,
  INSERT_CHECK_LIST_COMMAND,
  INSERT_ORDERED_LIST_COMMAND,
  INSERT_UNORDERED_LIST_COMMAND,
} from "@lexical/list";
import { useLexicalComposerContext } from "@lexical/react/LexicalComposerContext";
import { COMMAND_PRIORITY_LOW } from "lexical";
import { useEffect } from "react";

export function useList() {
  const [editor] = useLexicalComposerContext();

  useEffect(() => {
    if (globalThis.window) {
        
      let ul_command = editor.registerCommand(
        INSERT_UNORDERED_LIST_COMMAND,
        () => {
          console.log("added bullet list");
          $insertList("bullet");
          return true;
        },
        COMMAND_PRIORITY_LOW
      );

      let ol_command = editor.registerCommand(
        INSERT_ORDERED_LIST_COMMAND,
        () => {
          console.log("added number list");
          $insertList("number");
          return true;
        },
        COMMAND_PRIORITY_LOW
      );

      return () => {
        ul_command();
        ol_command();
      };
    }
  }, [editor]);

  useEffect(() => {
    return;
  }, [editor]);

  return null;
}
