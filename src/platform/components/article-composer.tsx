"use client";

import { Puck, type Data } from "@puckeditor/core";
import "@puckeditor/core/puck.css";
import { ArrowLeft, Tags } from "lucide-react";
import { useEffect, useMemo, useState } from "react";
import { NavLink } from "~components/nav-link";
import { PuckEditorConfig, type EditorComponents } from "~platform/blog/components/blocks/config";
import { ErrorBoundary } from "react-error-boundary";
import { saveArticleDraft } from "~platform/api/save-article-draft";
import { toast } from "sonner";
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogHeader,
    DialogTitle,
} from "~components/ui/dialog";
import { Button } from "~components/ui/button";

type CollectionOption = {
    id: string;
    label: string;
    slug: string;
};

type ArticleComposerProps = {
    storageKey?: string;
    enableLocalCache?: boolean;
    articleId?: string;
    isPublished?: boolean;
    initialData?: Partial<Data<EditorComponents>>;
    backHref?: string;
    backLabel?: string;
    availableCollections?: CollectionOption[];
    initialCollectionIds?: string[];
};

type PublishDialogState = {
    open: boolean;
    data: Data<EditorComponents> | null;
};

export function ArticleComposer({
    storageKey = "article.new",
    enableLocalCache = false,
    articleId,
    isPublished: initialIsPublished = false,
    initialData: serverInitialData,
    backHref = "/platform",
    backLabel = "Back to platform",
    availableCollections = [],
    initialCollectionIds = [],
}: ArticleComposerProps) {
    const [initialData, setInitialData] = useState<Partial<Data<EditorComponents>>>(serverInitialData ?? {});
    const [isReady, setIsReady] = useState(false);
    const [currentArticleId, setCurrentArticleId] = useState(articleId);
    const [isPublished, setIsPublished] = useState(initialIsPublished);
    const [selectedCollectionIds, setSelectedCollectionIds] = useState<string[]>(initialCollectionIds);
    const [publishDialog, setPublishDialog] = useState<PublishDialogState>({ open: false, data: null });
    const [isSaving, setIsSaving] = useState(false);

    useEffect(() => {
        if (serverInitialData && Object.keys(serverInitialData).length > 0) {
            setInitialData(serverInitialData);
            setIsReady(true);
            return;
        }

        if (!enableLocalCache || articleId) {
            setIsReady(true);
            return;
        }

        const cachedData = localStorage.getItem(storageKey);
        if (cachedData) {
            try {
                setInitialData(JSON.parse(cachedData) as Data<EditorComponents>);
            } catch {
                localStorage.removeItem(storageKey);
            }
        }

        setIsReady(true);
    }, [articleId, enableLocalCache, serverInitialData, storageKey]);

    const composerData = useMemo(() => initialData, [initialData]);
    const [enabled, setEnabled] = useState(true);

    const isNewArticle = !currentArticleId;

    const getDialogCopy = () => {
        if (isNewArticle) {
            return {
                title: "Save your article",
                description: "Would you like to save this article as a draft, or publish it now?",
                draftLabel: "Save as draft",
                publishLabel: "Publish",
            };
        }
        if (isPublished) {
            return {
                title: "Update your article",
                description: "This article is currently published. Do you want to return it to draft, or save and keep it published?",
                draftLabel: "Return to draft",
                publishLabel: "Save and publish",
            };
        }
        return {
            title: "Save your article",
            description: "Would you like to save changes as a draft, or publish this article?",
            draftLabel: "Save as draft",
            publishLabel: "Publish",
        };
    };

    const handleSave = async (data: Data<EditorComponents>, published: number) => {
        setIsSaving(true);
        try {
            const isCreatingFirstDraft = !currentArticleId;

            if (enableLocalCache && isCreatingFirstDraft) {
                localStorage.setItem(storageKey, JSON.stringify(data));
            }

            const result = await saveArticleDraft({
                article: data as Record<string, any>,
                articleId: currentArticleId,
                collectionIds: selectedCollectionIds,
                published,
            });

            if (result.success) {
                if (result.articleId) {
                    if (isCreatingFirstDraft && enableLocalCache) {
                        localStorage.removeItem(storageKey);
                    }
                    setCurrentArticleId(result.articleId);
                }
                setIsPublished(published === 1);
                toast.success(result.title, {
                    description: <span className="text-on-light text-sm">{result.message}</span>,
                });
            } else {
                toast.error(result.title, {
                    description: <span className="text-on-light text-sm">{result.message}</span>,
                });
            }
        } catch (err) {
            toast.error("Error", {
                description: <span className="text-on-light text-sm">An error occurred while saving the article.</span>,
            });
        } finally {
            setIsSaving(false);
            setPublishDialog({ open: false, data: null });
        }
    };

    if (!isReady) {
        return (
            <div className="w-full min-h-dvh p-8 flex flex-col items-center justify-center">
                <h1 className="font-heading text-xl">Loading your editor</h1>
                <p className="mt-2 text-sm">It won&apos;t take long. Please wait...</p>
            </div>
        );
    }

    const dialogCopy = getDialogCopy();

    return (
        <div className="w-full min-h-dvh bg-background text-foreground">
            <div className="w-full h-12 bg-card border-b border-border flex items-center px-4 sticky top-0 z-50">
                <NavLink href={backHref} className="text-xs flex items-center gap-2 text-muted-foreground hover:text-foreground transition">
                    <ArrowLeft size={14} />
                    {backLabel}
                </NavLink>
                {currentArticleId && (
                    <div className="ml-auto flex items-center gap-3 text-xs text-muted-foreground">
                        <span className={`inline-flex items-center gap-1.5 ${isPublished ? "text-accent" : ""}`}>
                            {isPublished ? "Published" : "Draft"}
                        </span>
                        <NavLink href={`/platform/content/${currentArticleId}`} className="font-medium text-foreground hover:underline">
                            Open article
                        </NavLink>
                    </div>
                )}
            </div>
            {availableCollections.length > 0 && (
                <div className="w-full bg-card border-b border-border px-4 py-2.5 flex items-center gap-2 flex-wrap">
                    <Tags size={14} className="text-muted-foreground shrink-0" />
                    <span className="text-xs text-muted-foreground font-medium shrink-0">Collections:</span>
                    {availableCollections.map((col) => {
                        const isSelected = selectedCollectionIds.includes(col.id);
                        return (
                            <button
                                key={col.id}
                                type="button"
                                onClick={() => {
                                    setSelectedCollectionIds((prev) =>
                                        isSelected
                                            ? prev.filter((id) => id !== col.id)
                                            : [...prev, col.id]
                                    );
                                }}
                                className={`rounded-full px-3 py-1 text-xs font-medium transition border ${
                                    isSelected
                                        ? "bg-foreground text-background border-foreground"
                                        : "bg-card text-muted-foreground border-border hover:border-primary/40 hover:bg-secondary/30"
                                }`}
                            >
                                {col.label}
                            </button>
                        );
                    })}
                </div>
            )}

            {enabled && (
                <ErrorBoundary fallback={<div>Something went wrong down the line</div>}>
                    <Puck
                        data={composerData}
                        config={PuckEditorConfig}
                        onAction={(action, appState, prevAppState) => {
                            console.log(action);
                        }}
                        onPublish={async (data) => {
                            setPublishDialog({ open: true, data });
                        }}

                    />
                </ErrorBoundary>
            )}

            <Dialog open={publishDialog.open} onOpenChange={(open) => {
                if (!open && !isSaving) {
                    setPublishDialog({ open: false, data: null });
                }
            }}>
                <DialogContent showCloseButton={!isSaving}>
                    <DialogHeader>
                        <DialogTitle>{dialogCopy.title}</DialogTitle>
                        <DialogDescription>{dialogCopy.description}</DialogDescription>
                    </DialogHeader>
                    <div className="flex flex-col gap-2 pt-2">
                        <Button
                            variant="outline"
                            className="w-full"
                            disabled={isSaving}
                            onClick={() => {
                                if (publishDialog.data) {
                                    handleSave(publishDialog.data, 0);
                                }
                            }}
                        >
                            {isSaving ? "Saving..." : dialogCopy.draftLabel}
                        </Button>
                        <Button
                            className="w-full"
                            disabled={isSaving}
                            onClick={() => {
                                if (publishDialog.data) {
                                    handleSave(publishDialog.data, 1);
                                }
                            }}
                        >
                            {isSaving ? "Saving..." : dialogCopy.publishLabel}
                        </Button>
                    </div>
                </DialogContent>
            </Dialog>
        </div>
    );
}