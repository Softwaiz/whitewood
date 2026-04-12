export const ObjectFitOptions = [
    { title: "None", value: "none" },
    { title: "Cover", value: "cover" },
    { title: "Contain", value: "contain" },
    { title: "Fill", value: "fill" },
    { title: "Scale down", value: "scale-down" },
]

export const ObjectPositionOptions = [
    { title: "Top", value: "top" },
    { title: "Bottom", value: "bottom" },
    { title: "Left", value: "left" },
    { title: "Right", value: "right" },
    { title: "Center", value: "center" },
    { title: "Top left", value: "top left" },
    { title: "Top right", value: "top right" },
    { title: "Bottom left", value: "bottom left" },
    { title: "Bottom right", value: "bottom right" },
    { title: "Center left", value: "center left" },
    { title: "Center right", value: "center right" },
    { title: "Center center", value: "center center" },
    { title: "None", value: "none" },
];

export const AspectRatioOptions = [
    { title: "1/1", value: "1/1" },
    { title: "3/1", value: "3/1" },
    { title: "16/9", value: "16/9" },
    { title: "4/3", value: "4/3" },
    { title: "2/1", value: "2/1" },
    { title: "3/2", value: "3/2" },
    { title: "9/16", value: "9/16" },
    { title: "2/3", value: "2/3" },
    { title: "1/2", value: "1/2" },
    { title: "None", value: "none" },
]

export type ObjectFitEntry = (typeof ObjectFitOptions)[number];
export type ObjectPositionEntry = (typeof ObjectPositionOptions)[number];
export type AspectRatioEntry = (typeof AspectRatioOptions)[number];

export function getObjectFitOption(value: string): ObjectFitEntry | undefined {
    return ObjectFitOptions.find(option => option.value === value);
}

export function getObjectPositionOption(value: string): ObjectPositionEntry | undefined {
    return ObjectPositionOptions.find(option => option.value === value);
}

export function getAspectRatioOption(value: string): AspectRatioEntry | undefined {
    return AspectRatioOptions.find(option => option.value === value);
}