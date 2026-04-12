import {
  $applyNodeReplacement,
  DecoratorNode,
  type EditorConfig,
  type LexicalEditor,
  type LexicalNode,
  type NodeKey,
  type SerializedElementNode,
} from "lexical";
import type { ReactNode } from "react";
import ImageNodeDecorator from "./decorator";

type SerializedImageNode = SerializedElementNode & {
  src: string;
  mime: string;
  size: number;
  style: Partial<ImageStyle>;
};

interface ImageNodeProps {
  src?: string;
  key?: NodeKey;
  mime?: string;
  size?: number;
  style?: Partial<ImageStyle>;
}

interface ImageStyle {
  aspectRatio: string;
  objectFit: string;
  objectPosition: string;
}

export class ImageNode extends DecoratorNode<ReactNode> {
  __src!: string;
  __style: Partial<ImageStyle>;
  __size?: number;
  __mime: string;

  constructor(props: ImageNodeProps) {
    super(props.key);
    this.__src = props.src || "";
    this.__size = props.size;
    this.__mime = props.mime ?? "";
    this.__style = {
      ...props.style,
    };
  }

  get src() {
    return this.getLatest().__src;
  }

  set src(url: string) {
    let self = this.getWritable();
    self.__src === url;
  }

  get size() {
    return this.getLatest().__size;
  }

  set size(size: number | undefined) {
    let self = this.getWritable();
    self.__size = size;
  }

  get mime() {
    return this.getLatest().__mime;
  }

  set mime(mime: string | undefined) {
    let self = this.getWritable();
    self.__mime = mime || "";
  }

  get ratio() {
    return this.getLatest().__style.aspectRatio;
  }

  set ratio(ratio: string | undefined) {
    let self = this.getWritable();
    self.__style.aspectRatio = ratio;
  }

  get objectFit() {
    return this.getLatest().__style.objectFit;
  }

  set objectFit(objectFit: string | undefined) {
    let self = this.getWritable();
    self.__style.objectFit = objectFit;
  }

  get objectPosition() {
    return this.getLatest().__style.objectPosition;
  }

  set objectPosition(objectPosition: string | undefined) {
    let self = this.getWritable();
    self.__style.objectPosition = objectPosition;
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
    return <ImageNodeDecorator nodeKey={this.__key} />;
  }

  remove(preserveEmptyParent?: boolean): void {
    super.remove(preserveEmptyParent);
  }

  static getType() {
    return "image";
  }

  static clone(node: ImageNode): ImageNode {
    let copy = new ImageNode({
      src: node.src,
      mime: node.__mime,
      size: node.__size,
      style: node.__style,
      key: node.__key,
    });
    return copy;
  }

  static importJSON(serializedNode: SerializedImageNode): ImageNode {
    const node = new ImageNode({
      src: serializedNode.src,
      mime: serializedNode.mime,
      size: serializedNode.size,
      style: serializedNode.style,
    });
    return node;
  }

  exportJSON(): SerializedImageNode {
    let latest = this.getLatest();
    
    const value = {
      ...super.exportJSON(),
      src: latest.__src,
      size: latest.__size || 0,
      style: latest.__style,
      mime: latest.__mime,
    } as SerializedImageNode;

    return value;
  }
}

export function $createImageNode() {
  return $applyNodeReplacement(
    new ImageNode({
      src: "",
    })
  );
}

export function $isImageNode(node: LexicalNode | null | undefined) {
  return node instanceof ImageNode;
}
