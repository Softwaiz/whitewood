import {
  $applyNodeReplacement,
  DecoratorNode,
  type EditorConfig,
  type LexicalEditor,
  type LexicalNode,
  type NodeKey,
  type SerializedElementNode,
  type SerializedLexicalNode,
} from "lexical";
import type { ReactNode } from "react";
import AudioNodeDecorator from "./decorator";

type SerializedAudioNode = SerializedElementNode & {
  src: string;
  type: string;
  size: number;
};

interface AudioNodeProps {
  src: string;
  mime: string;
  size: number;
  key: NodeKey;
}

export class AudioNode extends DecoratorNode<ReactNode> {
  __src: string | undefined = undefined;
  __size: number = 0;
  __mime: string = "";

  constructor(props: Partial<AudioNodeProps> = {}) {
    super(props.key);
    this.__src = props.src;
    this.__mime = props.mime || "";
    this.__size = props.size || 0;
  }

  get src() {
    return this.getLatest().__src || "";
  }

  set src(url: string) {
    let self = this.getWritable();
    self.__src === url;
  }

  get mime() {
    return this.getLatest().__mime;
  }

  set mime(type: string) {
    let self = this.getWritable();
    self.__mime === type;
  }

  get size() {
    return this.getLatest().__size;
  }

  set size(size: number) {
    let self = this.getWritable();
    self.__size === size;
  }

  createDOM(_config: EditorConfig, _editor: LexicalEditor): HTMLElement {
    let dom = document.createElement("div");
    return dom;
  }

  updateDOM(
    _prevNode: unknown,
    _dom: HTMLElement,
    _config: EditorConfig
  ): boolean {
    return false;
  }

  decorate(editor: LexicalEditor, config: EditorConfig): ReactNode {
    return <AudioNodeDecorator nodeKey={this.__key} />;
  }

  remove(preserveEmptyParent?: boolean): void {
    super.remove(preserveEmptyParent);
  }

  static getType() {
    return "audio";
  }

  static clone(node: AudioNode): AudioNode {
    let copy = new AudioNode({
      src: node.src,
      mime: node.mime,
      key: node.__key,
    });
    return copy;
  }

  static importJSON(serializedNode: SerializedAudioNode): AudioNode {
    const node = new AudioNode({
      src: serializedNode.src,
      mime: serializedNode.type,
    });
    return node;
  }

  exportJSON(): SerializedAudioNode {
    let latest = this.getLatest();
    return {
      ...super.exportJSON(),
      src: latest.src,
      type: latest.mime,
      size: latest.size,
    } as SerializedAudioNode;
  }
}

export function $createAudioNode() {
  return $applyNodeReplacement(new AudioNode({}));
}

export function $isAudioNode(node: LexicalNode | null | undefined) {
  return node instanceof AudioNode;
}
