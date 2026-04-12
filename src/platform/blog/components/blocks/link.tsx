import { Button } from "~components/ui/button";
import { createPaddingStyle, PaddingField, type Padding } from "../fields/padding";
import { createMarginStyle, MarginField, type Margin } from "../fields/margin";
import type { ComponentConfig } from "@puckeditor/core";

export interface LinkProps {
    mode: "internal" | "external";
    label: string;
    to: string;
    margin: Margin;
    padding: Padding;
}

function render(props: LinkProps) {
    return <Button
        asChild
        style={{
            ...createMarginStyle(props.margin),
            ...createPaddingStyle(props.padding)
        }}>
        <a href={props.to}>{props.label}</a>
    </Button>
}

export const Link: ComponentConfig<LinkProps> = {
    label: "Link",
    fields: {
        mode: {
            type: "radio",
            options: [
                { label: "Interne", value: "internal" },
                { label: "Externe", value: "external" }
            ]
        },
        label: {
            type: "text"
        },
        to: {
            type: "text"
        },
        padding: PaddingField,
        margin: MarginField
    },
    defaultProps: {
        mode: "internal",
        label: "Cliquez mon lien",
        to: "/contact",
        padding: { top: 0, left: 0, right: 0, bottom: 0 },
        margin: { top: 0, left: 0, right: 0, bottom: 0 }
    },
    render
};