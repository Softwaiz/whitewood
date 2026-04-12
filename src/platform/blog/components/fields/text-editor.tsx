"use client";

import type { ComponentConfig, CustomField, CustomFieldRender } from "@puckeditor/core";
import { ArticleEditor } from "../../text-editor";
import { Button } from "~components/ui/button";
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from "~components/ui/dialog";
import { useState } from "react";

type RichTextContent = string;

function render(props: Parameters<CustomFieldRender<RichTextContent>>[0]) {
    const [open, setOpen] = useState(false);
    const [draft, setDraft] = useState(() => {
        return props.value ?? '';
    });

    return <div className="w-full">
        <h6 className="font-semibold text-sm">Your story</h6>
        <Button
            size="sm"
            className="w-full"
            variant="outline"
            onClick={() => {
                setOpen(true);
            }}>
            Open Editor
        </Button>
        <Dialog
            open={open}
            onOpenChange={(is) => {
                setOpen(is);
            }}>
            <DialogContent className="sm:max-w-2xl max-h-dvh overflow-y-auto">
                <DialogHeader>
                    <DialogTitle>
                        Write your story
                    </DialogTitle>
                    <DialogDescription>
                        Compose your story here with proper formatting.
                    </DialogDescription>
                </DialogHeader>
                <ArticleEditor
                    initialValue={props.value}
                    onHtmlChange={(html) => {
                        setDraft(html);
                    }} />
                <DialogFooter>
                    <Button
                        size="sm"
                        variant="outline"
                        onClick={() => {
                            setOpen(false);
                        }}>
                        Cancel
                    </Button>
                    <Button
                        size="sm"
                        onClick={() => {
                            props.onChange(draft);
                            setOpen(false);
                        }}>
                        Confirm
                    </Button>
                </DialogFooter>
            </DialogContent>
        </Dialog>
    </div>
}

export const TextAreaRender = render;

export const RichTextField: CustomField<RichTextContent> = {
    type: "custom",
    label: "Story",
    render
}