import type { CustomField } from "@puckeditor/core";
import type { CSSProperties } from "react";
import { Input } from "~components/ui/input";
import { Label } from "~components/ui/label";

export interface Margin {
    top: number;
    bottom: number;
    left: number;
    right: number;
}

export function createMarginStyle(margin: Margin) {
    return {
        marginLeft: `${margin.left || 0}px`,
        marginTop: `${margin.top || 0}px`,
        marginRight: `${margin?.right || 0}px`,
        marginBottom: `${margin.bottom || 0}px`
    } as CSSProperties
}

export const MarginField: CustomField<Margin> = {
    type: "custom",
    label: "Margin",
    render({ name, onChange, value }) {
        return <div className="w-full grid grid-cols-4 gap-2">
            <div className="col-span-12 flex flex-row items-center justify-between">
                <p className="text-sm font-semibold">Margin</p>

                <div className="flex flex-row items-center justify-start gap-2">
                    <button className="text-xs px-2 py-1 border border-input">All</button>
                    <button className="text-xs px-2 py-1 border border-input">Vertical</button>
                    <button className="text-xs px-2 py-1 border border-input">Horizontal</button>
                </div>
            </div>
            <div className="space-y-2">
                <Label className="text-xs">Left</Label>
                <Input
                    className="text-xs h-9"
                    value={value?.left}
                    onChange={(ev) => {
                        onChange({
                            ...value,
                            left: parseInt(ev.currentTarget.value) || 0
                        })
                    }}
                />
            </div>
            <div className="space-y-2">
                <Label className="text-xs">Right</Label>
                <Input
                    className="text-xs h-9"
                    value={value?.right}
                    onChange={(ev) => {
                        onChange({
                            ...value,
                            right: parseInt(ev.currentTarget.value) || 0
                        })
                    }}
                />
            </div>
            <div className="space-y-2">
                <Label className="text-xs">Top</Label>
                <Input
                    className="text-xs h-9"
                    value={value?.top}
                    onChange={(ev) => {
                        onChange({
                            ...value,
                            top: parseInt(ev.currentTarget.value) || 0
                        })
                    }}
                />
            </div>
            <div className="space-y-2">
                <Label className="text-xs">Bottom</Label>
                <Input
                    className="text-xs h-9"
                    value={value?.bottom}
                    onChange={(ev) => {
                        onChange({
                            ...value,
                            bottom: parseInt(ev.currentTarget.value) || 0
                        })
                    }}
                />
            </div>
        </div>
    }
}