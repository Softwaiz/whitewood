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

type CollectionOption = {
    id: string;
    label: string;
    slug: string;
};

type ArticleComposerProps = {
    storageKey?: string;
    enableLocalCache?: boolean;
    articleId?: string;
    initialData?: Partial<Data<EditorComponents>>;
    backHref?: string;
    backLabel?: string;
    availableCollections?: CollectionOption[];
    initialCollectionIds?: string[];
};

export function ArticleComposer({
    storageKey = "article.new",
    enableLocalCache = false,
    articleId,
    initialData: serverInitialData,
    backHref = "/platform",
    backLabel = "Back to platform",
    availableCollections = [],
    initialCollectionIds = [],
}: ArticleComposerProps) {
    const [initialData, setInitialData] = useState<Partial<Data<EditorComponents>>>(serverInitialData ?? {});
    const [isReady, setIsReady] = useState(false);
    const [currentArticleId, setCurrentArticleId] = useState(articleId);
    const [selectedCollectionIds, setSelectedCollectionIds] = useState<string[]>(initialCollectionIds);

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

    if (!isReady) {
        return (
            <div className="w-full min-h-dvh p-8 flex flex-col items-center justify-center">
                <h1 className="font-heading text-xl">Loading your editor</h1>
                <p className="mt-2 text-sm">It won&apos;t take long. Please wait...</p>
            </div>
        );
    }

    return (
        <div className="w-full min-h-dvh bg-neutral-100 text-neutral-600">
            <div className="w-full h-12 bg-white border-b border-input flex items-center px-4 sticky top-0 z-50">
                <NavLink href={backHref} className="text-xs flex items-center gap-2 hover:underline">
                    <ArrowLeft size={14} />
                    {backLabel}
                </NavLink>
                {currentArticleId && (
                    <div className="ml-auto flex items-center gap-3 text-xs text-neutral-500">
                        <span>Draft linked</span>
                        <NavLink href={`/platform/content/${currentArticleId}`} className="font-medium text-neutral-900 hover:underline">
                            Open article
                        </NavLink>
                    </div>
                )}
            </div>
            {availableCollections.length > 0 && (
                <div className="w-full bg-white border-b border-neutral-200 px-4 py-2.5 flex items-center gap-2 flex-wrap">
                    <Tags size={14} className="text-neutral-400 shrink-0" />
                    <span className="text-xs text-neutral-500 font-medium shrink-0">Collections:</span>
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
                                        ? "bg-neutral-950 text-white border-neutral-950"
                                        : "bg-white text-neutral-600 border-neutral-300 hover:border-neutral-400 hover:bg-neutral-50"
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
                            try {

                                const isCreatingFirstDraft = !currentArticleId;

                                if (enableLocalCache && isCreatingFirstDraft) {
                                    localStorage.setItem(storageKey, JSON.stringify(data));
                                }

                                const result = await saveArticleDraft({
                                    article: data as Record<string, any>,
                                    articleId: currentArticleId,
                                    collectionIds: selectedCollectionIds,
                                });

                                if (result.success) {
                                    if (result.articleId) {
                                        if (isCreatingFirstDraft && enableLocalCache) {
                                            localStorage.removeItem(storageKey);
                                        }
                                        setCurrentArticleId(result.articleId);
                                    }
                                    toast.success(result.title, {
                                        description: <span className="text-on-light text-sm">{result.message}</span>,
                                    });
                                    return;
                                }

                                toast.error(result.title, {
                                    description: <span className="text-on-light text-sm">{result.message}</span>,
                                });

                            } catch (err) {
                                toast.error("Error", {
                                    description: <span className="text-on-light text-sm">An error occurred while saving the article.</span>,
                                });
                            }
                        }}

                    />
                </ErrorBoundary>
            )}
        </div>
    );
}