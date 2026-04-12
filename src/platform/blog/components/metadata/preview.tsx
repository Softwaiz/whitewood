import { format } from "date-fns"
import { Badge } from "~components/ui/badge"
import { Card, CardContent } from "~components/ui/card"
import { Separator } from "~components/ui/separator"

interface MetadataPreviewProps {
    metadata: {
      title: string
      description: string
      language?: string
      keywords?: string
      thumbnailUrl?: string
      ogTitle?: string
      ogDescription?: string
      ogImage?: string
      ogType?: string
      publishDate?: Date
      author?: string
      readingTime?: string
      category?: string
      twitterCard?: string
      twitterSite?: string
      noIndex?: boolean
      structuredData?: boolean
      canonicalUrl?: string
    }
  }

export default function MetadataPreview({ metadata }: MetadataPreviewProps) {
  const displayTitle = metadata.title || "Article Title"
  const displayDescription = metadata.description || "Article description will appear here..."
  const displayImage = metadata.thumbnailUrl || metadata.ogImage || "/placeholder.svg?height=300&width=600"

  return (
    <div className="space-y-6">
      <div className="space-y-4">
        <h3 className="text-sm font-medium">Google Search Preview</h3>
        <Card>
          <CardContent className="p-4">
            <div className="space-y-1">
              <div className="text-sm text-green-600 truncate">{metadata.canonicalUrl || "softwaiz.co › article"}</div>
              <div className="text-base font-medium text-blue-600 truncate">{displayTitle}</div>
              <div className="text-sm text-gray-600 line-clamp-2">{displayDescription}</div>
              {metadata.publishDate && (
                <div className="text-xs text-gray-500">
                  {format(metadata.publishDate, "MMM d, yyyy")}
                  {metadata.author && ` · ${metadata.author}`}
                </div>
              )}
            </div>
          </CardContent>
        </Card>
      </div>

      <div className="space-y-4">
        <h3 className="text-sm font-medium">Social Media Preview</h3>
        <Card>
          <CardContent className="p-4">
            <div className="space-y-3">
              <div className="aspect-[1.91/1] relative bg-muted rounded-lg overflow-hidden">
                {displayImage && (
                  <img src={displayImage || "/placeholder.svg"} alt="Preview image" className="object-cover" />
                )}
              </div>
              <div className="space-y-1">
                <div className="text-xs text-gray-500">
                  {metadata.canonicalUrl ? new URL(metadata.canonicalUrl).hostname : "example.com"}
                </div>
                <div className="text-base font-medium truncate">{metadata.ogTitle || displayTitle}</div>
                <div className="text-sm text-gray-600 line-clamp-2">{metadata.ogDescription || displayDescription}</div>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      <div className="space-y-4">
        <h3 className="text-sm font-medium">Metadata Summary</h3>
        <div className="space-y-3 text-sm">
          <div className="grid grid-cols-2 gap-2">
            <div className="font-medium">Title:</div>
            <div className="text-muted-foreground truncate">{displayTitle}</div>

            <div className="font-medium">Description:</div>
            <div className="text-muted-foreground truncate">{displayDescription}</div>

            {metadata.keywords && (
              <>
                <div className="font-medium">Keywords:</div>
                <div className="flex flex-wrap gap-1">
                  {metadata.keywords.split(",").map((keyword, i) => (
                    <Badge key={i} variant="outline" className="text-xs">
                      {keyword.trim()}
                    </Badge>
                  ))}
                </div>
              </>
            )}

            {metadata.author && (
              <>
                <div className="font-medium">Author:</div>
                <div className="text-muted-foreground">{metadata.author}</div>
              </>
            )}

            {metadata.publishDate && (
              <>
                <div className="font-medium">Published:</div>
                <div className="text-muted-foreground">{format(metadata.publishDate, "PPP")}</div>
              </>
            )}

            {metadata.category && (
              <>
                <div className="font-medium">Category:</div>
                <div className="text-muted-foreground">{metadata.category}</div>
              </>
            )}

            {metadata.readingTime && (
              <>
                <div className="font-medium">Reading Time:</div>
                <div className="text-muted-foreground">{metadata.readingTime}</div>
              </>
            )}
          </div>

          <Separator />

          <div className="space-y-2">
            <div className="font-medium">SEO Settings:</div>
            <div className="flex flex-wrap gap-2">
              {metadata.noIndex ? (
                <Badge variant="destructive">No Index</Badge>
              ) : (
                <Badge variant="outline">Indexable</Badge>
              )}

              {metadata.structuredData && <Badge variant="secondary">Structured Data</Badge>}

              {metadata.canonicalUrl && <Badge variant="outline">Canonical URL</Badge>}

              <Badge variant="outline">Twitter: {metadata.twitterCard?.replace("_", " ") || "summary"}</Badge>

              <Badge variant="outline">OG: {metadata.ogType || "article"}</Badge>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
