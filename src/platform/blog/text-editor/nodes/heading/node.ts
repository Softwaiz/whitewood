import { ElementNode, TextNode, type EditorConfig, type LexicalEditor, type LexicalNode, type NodeKey, type SerializedTextNode } from "lexical";

export class HeadingNode extends TextNode {
    __level: number;

    static getType(): string {
        return "heading";
    }

    static clone(previous: HeadingNode): HeadingNode {
        let node = new HeadingNode(previous.getTextContent(), previous.level, previous.getKey());
        return node;
    }

    static importJSON(serializedNode: SerializedTextNode &  { level: number }): HeadingNode {
        let node = new HeadingNode(serializedNode.text, serializedNode.level);
        node.setStyle(serializedNode.style);
        node.setMode(serializedNode.mode);
        node.setDetail(serializedNode.detail);
        node.setFormat(serializedNode.format);
        node.__mime = serializedNode.type;
        return node;
    } 

    constructor(text: string, level: number, key?: NodeKey) {
        super(text, key);
        this.__level = level;
    }

    set level(level: number) {
        let self = this.getWritable();
        self.__level = level
    }

    get level() {
        let self = this.getLatest();
        return self.__level;
    }

    createDOM(_config: EditorConfig, _editor: LexicalEditor): HTMLElement {
        let node = "h6";
        switch (this.__level) {
            case 1:
                node = "h1";
                break;
            case 2:
                node = "h2";
                break;
            case 3:
                node = "h3";
                break;
            case 4:
                node = "h4";
                break;
            case 5:
                node = "h5";
                break;
            case 6:
                node = "h6";
                break;
            default:
                node = "h6";
        }
        
        let dom = document.createElement(node)
        dom.innerHTML = this.getTextContent();
        let style = this.getStyle();

        return dom;

    }

    updateDOM(_prevNode: unknown, _dom: HTMLElement, _config: EditorConfig): boolean {
        return false;
    }
}

export function $createHeading(text: string, level: number) {
    return new HeadingNode(text, level);
}

export function $isHeadingNode(node: LexicalNode | null | undefined) {
    return node instanceof HeadingNode;
}