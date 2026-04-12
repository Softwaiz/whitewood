"use client";
import type { ComponentConfig, CustomFieldRender } from "@puckeditor/core";
import { Dialog, DialogContent, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from "~components/ui/dialog";
import { Button } from "~components/ui/button";
import { Suspense, useCallback, useEffect, useRef, useState, type PropsWithChildren } from "react";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "~components/ui/select";
import * as shiki from "shiki";
import { ScrollArea } from "~components/ui/scroll-area";
import { Check, Copy } from "lucide-react";
import { AnimatePresence, motion, type Variants } from "motion/react";
import { LazyEditor } from "./lazy-editor.client";
import { useDimensions } from "~hooks/useDimensions";

export interface CodeConfigProps {
    language: string;
    code: string;
}

const codeRender: CustomFieldRender<CodeConfigProps> = (props) => {
    const ref = useRef<HTMLDivElement>(null);
    const [dialogOpen, setDialogOpen] = useState(false);
    const [value, setValue] = useState('');
    const [language, setLanguage] = useState('typescript');

    useEffect(() => {
        setValue(props.value.code);
        setLanguage(props.value.language);
    }, [props.value.code, props.value.language]);

    return <Dialog
        open={dialogOpen}
        onOpenChange={(is) => {
            setDialogOpen(is);
        }}>
        <DialogTrigger asChild>
            <Button>Open Editor</Button>
        </DialogTrigger>
        <DialogContent className="sm:max-w-screen h-screen rounded-none">
            <DialogHeader className="flex flex-row items-center justify-start gap-2">
                <DialogTitle>
                    Writing code in
                </DialogTitle>
                <Select
                    value={language}
                    onValueChange={(v) => {
                        setLanguage(v);
                    }}>
                    <SelectTrigger>
                        <SelectValue placeholder="Choisir un langage" />
                    </SelectTrigger>
                    <SelectContent>
                        <SelectItem value="typescript">Typescript</SelectItem>
                        <SelectItem value="javascript">Javascript</SelectItem>
                        <SelectItem value="json">JSON</SelectItem>
                        <SelectItem value="html">HTML</SelectItem>
                        <SelectItem value="jsx">JSX</SelectItem>
                        <SelectItem value="graphql">GraphQL</SelectItem>
                        <SelectItem value="apache">Apache</SelectItem>
                        <SelectItem value="nginx">Nginx</SelectItem>
                        <SelectItem value="jsx">JSX</SelectItem>
                    </SelectContent>
                </Select>
            </DialogHeader>
            <Suspense
                fallback={<div>
                    <p>Loading Monaco editor...</p>
                </div>}>
                <LazyEditor
                    width="100%"
                    height="80vh"
                    language={language}
                    theme="vs-dark"
                    value={value}
                    onChange={(v) => {
                        setValue(v);
                    }}
                />
            </Suspense>
            <DialogFooter>
                <Button
                    size="sm"
                    variant="outline"
                    onClick={() => {
                        setDialogOpen(false);
                    }}>
                    Cancel
                </Button>
                <Button
                    size="sm"
                    onClick={() => {
                        props.onChange({
                            code: value,
                            language: language
                        });
                        setDialogOpen(false);
                    }}>
                    Confirm
                </Button>
            </DialogFooter>
        </DialogContent>
    </Dialog>
}

interface CodeAreaProps {
    language: string;
    filename: string;
    content?: string;
}

function CodeArea({ filename, language, content, children }: PropsWithChildren<CodeAreaProps>) {

    const [copied, setCopied] = useState(false);

    const copy = useCallback(() => {
        if (content) {
            navigator.clipboard.writeText(content)
                .then(() => {
                    setCopied(true);
                    setTimeout(() => setCopied(false), 3000);
                })
        }
    }, [content]);

    const copyMotionVariants: Variants = {
        initial: {
            y: -20,
            opacity: 0
        },
        animate: {
            y: 0,
            opacity: 1
        },
        exit: {
            y: 20,
            opacity: 0
        }
    }

    return <div className="relative w-full rounded-md overflow-hidden shadow-2xl bg-neutral-900 text-neutral-300 flex flex-col items-start justify-start">
        <div className="w-full flex flex-row items-center justify-start border-b border-neutral-700">
            <div className="grow h-10 flex flex-row items-center justify-start gap-2">
                <span className="text-xs px-2 md:px-3">{language}</span>
                {filename && <>
                    <span className="w-px h-full block bg-neutral-700"></span>
                    <span className="text-xs px-2 md:px-3">{filename}</span>
                </>}
            </div>
            <motion.button
                className="mx-2 my-1 w-8 h-8 flex flex-col items-center justify-center bg-neutral-800 rounded-md overflow-hidden"
                onClick={() => {
                    if (!copied) {
                        copy();
                    }
                }}>
                <AnimatePresence>
                    {copied ? <motion.span
                        className="w-8 h-8 flex flex-col items-center justify-center"
                        variants={copyMotionVariants}
                        initial={"initial"}
                        animate={"animate"}
                        exit={"exit"}
                        key="clipboard-copied">
                        <Check size={14} />
                    </motion.span> : <motion.span
                        className="w-8 h-8 flex flex-col items-center justify-center"
                        variants={copyMotionVariants}
                        initial={"initial"}
                        animate={"animate"}
                        exit={"exit"}
                        key="clipboard-copy">
                        <Copy size={14} />
                    </motion.span>}
                </AnimatePresence>
            </motion.button>
        </div>
        <div className="w-full">
            {children}
        </div>
    </div>
}

export interface CodeProps {
    filename: string;
    content: CodeConfigProps;
    editorTheme: string;
}

function render({ filename, editorTheme: theme, content }: CodeProps) {
    const [html, setHtml] = useState('');

    useEffect(() => {
        if (globalThis.window) {
            shiki.codeToHtml(content.code, {
                lang: content.language,
                theme: theme || "andromeeda"
            })
                .then((html) => {
                    setHtml(html);
                })
                .catch((err) => {
                    console.log(err);
                })
        }
    }, [content.code, theme]);

    const relativeContainerRef = useRef<HTMLDivElement>(null);
    const relativeDimensions = useDimensions(relativeContainerRef);

    const absoluteContentRef = useRef<HTMLDivElement>(null);
    const absoluteDimensions = useDimensions(absoluteContentRef);

    return <div
        ref={relativeContainerRef}
        className="w-full relative h-(--shiki-height)"
        style={{
            '--shiki-width': relativeDimensions.width ? `${(relativeDimensions.width || 0)}px` : '100%',
            '--shiki-height': `${(absoluteDimensions?.height || 0)}px`
        } as any}
    >
        <div className="w-full absolute top-0 left-0" ref={absoluteContentRef}>
            <CodeArea language={content.language} filename={filename} content={content.code}>
                <div className="w-(--shiki-width) h-96 md:h-128 overflow-y-auto">
                    {(!html) ?
                        <pre className="w-(--shiki-width) p-4 overflow-auto text-sm text-neutral-100">
                            <code className="w-full">{content.code}</code>
                        </pre> : <div
                            className="text-sm [&_.shiki]:w-(--shiki-width) [&_.shiki]:overflow-auto [&_.shiki]:p-4"
                            dangerouslySetInnerHTML={{
                                __html: html
                            }}
                        />
                    }
                </div>
            </CodeArea>
        </div>
    </ div>
}

export const Code: ComponentConfig<CodeProps> = {
    label: "Code",
    fields: {
        filename: {
            type: "text"
        },
        content: {
            type: "custom",
            render: codeRender
        },
        editorTheme: {
            type: "select",
            options: [
                { label: "Andromeeda", value: "andromeeda" }
            ]
        }
    },
    render,
    defaultProps: {
        filename: "index.ts",
        editorTheme: "andromeeda",
        content: {
            language: "typescript",
            code: `import { } from "crypto";`
        }
    }
}