import { useLexicalComposerContext } from "@lexical/react/LexicalComposerContext";
import {
  $createTextNode,
  $insertNodes,
  COMMAND_PRIORITY_LOW,
  createCommand,
} from "lexical";
import { useEffect } from "react";
import { $createHeadingNode, type HeadingTagType } from "@lexical/rich-text";

export const INSERT_HEADING_COMMAND = createCommand<{
  level: number;
  text: string;
}>("insert_heading");

export function useHeading() {
  const [editor] = useLexicalComposerContext();

  useEffect(() => {
    if (globalThis.window) {
      return editor.registerCommand(
        INSERT_HEADING_COMMAND,
        (payload) => {
          let tag: HeadingTagType = "h6";
          switch (payload.level) {
            case 1:
              tag = "h1";
              break;
            case 2:
              tag = "h2";
              break;
            case 3:
              tag = "h3";
              break;

            case 4:
              tag = "h4";
              break;
            case 5:
              tag = "h5";
              break;
            default:
              tag = "h6";
              break;
          }

          let node = $createHeadingNode(tag);
          node.append($createTextNode(payload.text));

          $insertNodes([node]);
          return true;
        },
        COMMAND_PRIORITY_LOW
      );
    }
  }, [editor]);

  return null;
}
