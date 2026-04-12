import type { Config } from "@puckeditor/core";
import { Title, type TitleProps } from "./title";
import { Paragraph, type ParagraphProps } from "./paragraph";
import { Card, type CardProps } from "./card";
import { Link, type LinkProps } from "./link";
import { Image, type ImageProps } from "./image";
import { Note, type NoteProps } from "./note";
import { Column, type ColumnProps } from "./column";
import { Spacer, type SpacerProps } from "./spacer";
import { RootComponent } from "./root";
import { Code, type CodeProps } from "./code";

export interface EditorComponents {
    Title: TitleProps;
    Paragraph: ParagraphProps;
    Card: CardProps;
    Link: LinkProps;
    Image: ImageProps;
    Note: NoteProps;
    Column: ColumnProps;
    Spacer: SpacerProps;
    Code: CodeProps;
}

export const PuckEditorConfig: Config<EditorComponents> = {
    root: RootComponent as any,
    components: {
        Title: Title,
        Paragraph: Paragraph,
        Card: Card,
        Link: Link,
        Image: Image,
        Note: Note, 
        Column: Column,
        Spacer: Spacer,
        Code: Code
    },
    categories: {
        Typography: {
            title: "Typography",
            components: ["Title", "Paragraph"]
        },
        Multimedia: {
            title: "Multimedia",
            components: ['Image']
        },
        Layout: {
            title: "Layout",
            components: ["Spacer", "Column"]
        }
    },

}