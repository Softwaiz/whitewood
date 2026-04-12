import type { ComponentConfig, CustomField, CustomFieldRender } from "@puckeditor/core";
import { cva } from "class-variance-authority";
import { createElement } from "react";
import { createPaddingStyle, PaddingField, type Padding } from "../fields/padding";
import { createMarginStyle, MarginField, type Margin } from "../fields/margin";

export interface TitleProps {
    level?: 1 | 2 | 3 | 4 | 5 | 6;
    children: string;
    margin: Margin;
    padding: Padding;
}

const titleStyle = cva(
    "text-neutral-600 font-bold font-display", {
    variants: {
        level: {
            1: "text-5xl",
            2: "text-4xl",
            3: "text-3xl",
            4: "text-2xl font-heading font-semibold",
            5: "text-xl font-heading font-semibold",
            6: "text-xl font-heading font-semibold",
        }
    },
    defaultVariants: {
        level: 1
    }
})

function render({ children, level = 1, margin, padding }: TitleProps) {
    const nodes = {
        1: {
            tag: "h1"
        },
        2: {
            tag: "h2"
        },
        3: {
            tag: "h3"
        },
        4: {
            tag: "h4"
        },
        5: {
            tag: "h5"
        },
        6: {
            tag: "h6"
        }
    } as const;

    const comp = createElement(nodes[level].tag, {
        className: titleStyle({ level: level }),
        children: children,
        style: {
            ...createMarginStyle(margin),
            ...createPaddingStyle(padding)
        }
    });

    return comp;
}

export const Title: ComponentConfig<TitleProps> = {
    label: "Titre",
    fields: {
        level: {
            type: "select",
            options: [
                { label: "H1", value: 1 },
                { label: "H2", value: 2 },
                { label: "H3", value: 3 },
                { label: "H4", value: 4 },
                { label: "H5", value: 5 },
                { label: "H6", value: 6 }
            ],
        },
        children: {
            type: "textarea"
        },
        padding: PaddingField,
        margin: MarginField,
    },
    defaultProps: {
        level: 1,
        children: "Heading 1",
        padding: { top: 0, left: 0, right: 0, bottom: 0 },
        margin: { top: 0, left: 0, right: 0, bottom: 0 }
    },
    render
};

