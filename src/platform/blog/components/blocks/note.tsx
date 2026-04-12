import type { ComponentConfig } from "@puckeditor/core";
import { PaddingField, type Padding } from "../fields/padding";
import { MarginField, type Margin } from "../fields/margin";
import { RichTextField } from "../fields/text-editor";

export interface NoteProps {
    title: string;
    body: string;

    margin: Margin;
    padding: Padding;
}

function render({ title, body, margin, padding}: NoteProps) {
    return <div className="w-full text-blue-600 bg-blue-600/20 border border-blue-600/30 rounded-lg p-4 space-y-4">
        <div className="w-full">
            <h6 className="font-heading text-xl font-semibold">{title}</h6>
        </div>
        <div className="w-full text-sm" dangerouslySetInnerHTML={{
            __html: body
        }}/>
    </div>
}

export const Note: ComponentConfig<NoteProps> = {
    label: "Alert",
    fields: {
        title: {
            type: "text"
        },
        body: RichTextField,
        padding: PaddingField,
        margin: MarginField
    },
    render,
    defaultProps: {
        title: "",
        body: "",
        padding: { top: 0, left: 0, right: 0, bottom: 0 },
        margin: { top: 0, left: 0, right: 0, bottom: 0 }
    }
}