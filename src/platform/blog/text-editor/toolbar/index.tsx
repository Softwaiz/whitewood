import "./index.css";

import { useLexicalComposerContext } from "@lexical/react/LexicalComposerContext";
import { FORMAT_TEXT_COMMAND, UNDO_COMMAND } from "lexical";
import {
  INSERT_ORDERED_LIST_COMMAND,
  INSERT_UNORDERED_LIST_COMMAND,
} from "@lexical/list";
import {
  Bold,
  Italic,
  List,
  ListOrdered,
  Strikethrough,
  Underline,
  Undo,
} from "lucide-react";
import { Button } from "~components/ui/button";

export function Toolbar() {
  const [editor] = useLexicalComposerContext();

  return (
    <div className="w-full flex flex-row items-center justify-start gap-1">

      <Button
        className="toolbar__item"
        onClick={() => {
          editor.dispatchCommand(UNDO_COMMAND, undefined);
        }}
      >
        <Undo size={16}/>
      </Button>

      <div className="flex flex-row items-center justify-center gap-1">
        <Button
          className="toolbar__item"
          onClick={() => {
            editor.dispatchCommand(INSERT_ORDERED_LIST_COMMAND, undefined);
          }}
        >
          <ListOrdered size={16} />
        </Button>
        <Button
          className="toolbar__item"
          onClick={() => {
            editor.dispatchCommand(INSERT_UNORDERED_LIST_COMMAND, undefined);
          }}
        >
          <List size={16} />
        </Button>
      </div>

      <div className="flex flex-row items-center justify-center gap-1">
        <Button
          className="toolbar__item"
          onClick={() => {
            editor.dispatchCommand(FORMAT_TEXT_COMMAND, "bold");
          }}
        >
          <Bold size={16} />
        </Button>
        <Button
          className="toolbar__item"
          onClick={() => {
            editor.dispatchCommand(FORMAT_TEXT_COMMAND, "italic");
          }}
        >
          <Italic size={16} />
        </Button>
        <Button
          className="toolbar__item"
          onClick={() => {
            editor.dispatchCommand(FORMAT_TEXT_COMMAND, "underline");
          }}
        >
          <Underline size={16} />
        </Button>

        <Button
          className="toolbar__item"
          onClick={() => {
            editor.dispatchCommand(FORMAT_TEXT_COMMAND, "strikethrough");
          }}
        >
          <Strikethrough size={16} />
        </Button>
      </div>
    </div>
  );
}
