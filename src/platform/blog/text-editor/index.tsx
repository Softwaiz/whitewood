"use client";
import "./index.scss";

import { LexicalComposer } from "@lexical/react/LexicalComposer";
import { RichTextPlugin } from "@lexical/react/LexicalRichTextPlugin";
import { ContentEditable } from "@lexical/react/LexicalContentEditable";
import { OnChangePlugin } from "@lexical/react/LexicalOnChangePlugin";
import { HistoryPlugin } from "@lexical/react/LexicalHistoryPlugin";
import { ListPlugin } from "@lexical/react/LexicalListPlugin";
import { AutoLinkPlugin } from "@lexical/react/LexicalAutoLinkPlugin";

import { LexicalErrorBoundary } from "@lexical/react/LexicalErrorBoundary";
import {
  $createParagraphNode,
  $getRoot,
  ParagraphNode,
  type EditorState,
  type LexicalEditor,
} from "lexical";
import { Toolbar } from "./toolbar";
import { ListNode, ListItemNode } from "@lexical/list";
import { HeadingNode, QuoteNode } from "@lexical/rich-text";
import { AutoLinkNode } from "@lexical/link";
import { useLexicalComposerContext } from "@lexical/react/LexicalComposerContext";
import { useEffect, useState } from "react";
import { $generateHtmlFromNodes, $generateNodesFromDOM } from "@lexical/html";

const theme = {
  text: {
    bold: "story-textBold",
    code: "story-textCode",
    italic: "story-textItalic",
    strikethrough: "story-textStrikethrough",
    subscript: "story-textSubscript",
    superscript: "story-textSuperscript",
    underline: "story-textUnderline",
    underlineStrikethrough: "story-textUnderlineStrikethrough",
  },

  list: {
    ul: "story-ul",
    ol: "story-ol",
  },
  heading: {
    h1: "story-h1",
    h2: "story-h2",
    h3: "story-h3",
    h4: "story-h4",
    h5: "story-h5",
    h6: "story-h6",
  },
  link: "story-link",
};

const onError = (error: any) => {
  console.log(error);
};

interface ArticleEditorProps {
  initialValue: string;
  onHtmlChange(html: string): void;
}

export function ArticleEditor(props: ArticleEditorProps) {
  const initialConfig = {
    namespace: "Article",
    theme,
    onError,
    nodes: [
      ParagraphNode,
      HeadingNode,
      QuoteNode,
      ListNode,
      ListItemNode,
      AutoLinkNode,
    ],
    editorState: (editor: LexicalEditor) => {
      editor.update(() => {
        const parser = new DOMParser();
        let doc = parser.parseFromString(props.initialValue, "text/html");
        const nodes = $generateNodesFromDOM(editor, doc);
        const paragraphNode = $createParagraphNode();
        nodes.forEach((node) => paragraphNode.append(node));
        $getRoot().append(paragraphNode);
      });
    }
  };

  const URL_MATCHER =
    /((https?:\/\/(www\.)?)|(www\.))[-a-zA-Z0-9@:%._+~#=]{1,256}\.[a-zA-Z0-9()]{1,6}\b([-a-zA-Z0-9()@:%_+.~#?&//=]*)/;

  const MATCHERS = [
    (text: string) => {
      const match = URL_MATCHER.exec(text);
      if (match === null) {
        return null;
      }
      const fullMatch = match[0];
      return {
        index: match.index,
        length: fullMatch.length,
        text: fullMatch,
        url: fullMatch.startsWith("http") ? fullMatch : `https://${fullMatch}`,
        // attributes: { rel: 'noreferrer', target: '_blank' }, // Optional link attributes
      };
    },
  ];

  const onChange = (
    editorState: EditorState,
    editor: LexicalEditor,
    tags: Set<string>
  ) => {
    editorState.read(() => {
      const html = $generateHtmlFromNodes(editor);
      props.onHtmlChange(html);
    });
  };

  return (
    <div className="w-full bg-background text-neutral-600">
      <LexicalComposer initialConfig={initialConfig}>
        <Toolbar />
        <hr className="my-2" />
        <ListPlugin />
        <AutoLinkPlugin matchers={MATCHERS} />
        <RichTextPlugin
          contentEditable={
            <ContentEditable
              className="min-h-[400px] p-4 text-sm"
              aria-placeholder="Enter something."
              placeholder={<div>Enter something</div>}
            />
          }
          ErrorBoundary={LexicalErrorBoundary}
        />
        <hr className="bg-neutral-200 my-2" />
        <OnChangePlugin onChange={onChange} />
        <HistoryPlugin />
      </LexicalComposer>
    </div>
  );
}

interface InjectInitialValueProps {
  value: string;
}

function InjectInitialValuePlugin(props: InjectInitialValueProps) {
  const [booted, setBooted] = useState(false);

  const [editor] = useLexicalComposerContext();

  useEffect(() => {
    if (booted) {
      return;
    }
    if (props.value) {
      editor.update(() => {
        const parser = new DOMParser();
        let doc = parser.parseFromString(props.value, "text/html");
        const nodes = $generateNodesFromDOM(editor, doc);
        const paragraphNode = $createParagraphNode();
        nodes.forEach((node) => paragraphNode.append(node));
        $getRoot().append(paragraphNode);
      }, {
        onUpdate() {
          setBooted(true);
          console.log("booted from onUpdate");
        },
      });
    }
  }, [booted, editor, props.value]);

  return null;
}