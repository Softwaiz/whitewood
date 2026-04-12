import type { ComponentConfig, SlotComponent } from "@puckeditor/core";
import { Card as CardBase, CardContent, CardFooter, CardHeader } from "~components/ui/card";
import { createPaddingStyle, PaddingField, type Padding } from "../fields/padding";
import { createMarginStyle, MarginField, type Margin } from "../fields/margin";

export interface CardProps {
    header?: SlotComponent;
    content?: SlotComponent;
    footer?: SlotComponent;
    margin: Margin;
    padding: Padding;
}

function render({ header: Header, content: Content, footer: Footer, margin, padding }: CardProps) {
    return <CardBase
        style={{
            ...createMarginStyle(margin),
            ...createPaddingStyle(padding)
        }}>
        <CardHeader className="w-full">
            {Header && <Header />}
        </CardHeader>
        <CardContent className="w-full">
            {Content && <Content />}
        </CardContent>
        <CardFooter className="w-full">
            {Footer && <Footer />}
        </CardFooter>
    </CardBase>
}

export const Card: ComponentConfig<CardProps> = {
    label: "Card",
    fields: {
        header: {
            type: "slot"
        },
        footer: {
            type: "slot"
        },
        content: {
            type: "slot",
        },
        padding: PaddingField,
        margin: MarginField
    },
    render,
    defaultProps: {
        padding: { top: 0, left: 0, right: 0, bottom: 0 },
        margin: { top: 0, left: 0, right: 0, bottom: 0 }
    }
}