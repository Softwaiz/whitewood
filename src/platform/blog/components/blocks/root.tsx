import type { ComponentConfig } from "@puckeditor/core";
import type { PropsWithChildren, ReactNode } from "react";

export interface RootComponentProps {
    title: string;
    description: string;
    slug: string;
    language: string;
    keywords: { label: string }[];
    children?: ReactNode[];
}
export const RootComponent: ComponentConfig<RootComponentProps> = {
    fields: {
        title: {
            label: 'Title',
            type: "text"
        },
        description: {
            label: 'Description',
            type: "textarea"
        },
        slug: {
            type: "text"
        },
        language: {
            label: "Language",
            type: "select",
            options: [
                { label: "French", value: "fr" },
                { label: "English", value: "en" }
            ]
        },
        keywords: {
            label: "Keywords",
            type: "array",
            arrayFields: {
                label: {
                    type: "text"
                }
            }
        }
    },
    render({ children, title, description, language, keywords, puck, ...otherProps }) {
        return <div className="w-full min-h-dvh flex flex-col items-start justify-start gap-12">
            <title>{title}</title>
            <meta name="description" content={description} />
            <meta name="keywords" content={keywords?.map((k) => k.label).join(", ")} />
            {children}
        </div>
    },
    defaultProps: {
        slug: "",
        keywords: [],
        language: "fr",
        title: "",
        description: ""
    }
}
