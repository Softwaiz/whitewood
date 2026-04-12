import { usePuck, type ComponentConfig, type DefaultComponentProps, type SlotComponent, type WithPuckProps } from "@puckeditor/core"
import { createMarginStyle, MarginField, type Margin } from "../fields/margin";
import { createPaddingStyle, PaddingField, type Padding } from "../fields/padding";

export interface ColumnProps {
    items?: SlotComponent;
    margin: Margin;
    padding: Padding;
}


function render({ items: Content, margin, padding, ...otherProps }: WithPuckProps<ColumnProps>) {

    return <div
        ref={otherProps.puck.dragRef}
        style={{
            ...createMarginStyle(margin),
            ...createPaddingStyle(padding)
        }} className="flex flex-col items-center justify-start gap-8">
        {Content && <Content />}
        {otherProps.editMode && false && <span className="w-full block h-16 bg-red-500/20"></span>}
    </div>
}


export const Column: ComponentConfig<ColumnProps> = {
    label: "Column",
    inline: true,
    fields: {
        items: {
            type: "slot",
        },
        margin: MarginField,
        padding: PaddingField
    },
    defaultProps: {
        margin: { top: 0, left: 0, right: 0, bottom: 0 },
        padding: { top: 0, left: 0, right: 0, bottom: 0 },
    },
    render
}