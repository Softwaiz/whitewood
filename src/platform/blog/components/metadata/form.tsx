import { useState } from "react";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { format } from "date-fns";
import { CalendarIcon, Clock, Globe, Info, Share2, Tag } from "lucide-react";
import { Button } from "~components/ui/button";
import { cn } from "~lib/utils";
import MetadataPreview from "./preview";
import { Language, MetadataSchema, OgType, TwitterCardType, type ArticleMetadataValues } from "~platform/blog/schemas/metadata";
import { Form, FormControl, FormDescription, FormField, FormItem, FormLabel, FormMessage } from "~components/ui/form";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "~components/ui/tabs";
import { Separator } from "~components/ui/separator";
import { Input } from "~components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "~components/ui/select";
import { Popover, PopoverContent, PopoverTrigger } from "~components/ui/popover";
import { Calendar } from "~components/ui/calendar";
import { Switch } from "~components/ui/switch";
import { Textarea } from "~components/ui/textarea";
import { Card, CardContent } from "~components/ui/card";

export default function ArticleMetadataForm() {
  const [activeTab, setActiveTab] = useState("basic");

  const form = useForm<ArticleMetadataValues>({
    resolver: zodResolver(MetadataSchema) as any,
    defaultValues: {
      title: "",
      description: "",
      language: Language.fr,
      keywords: "",
      thumbnailUrl: "",
      ogTitle: "",
      ogDescription: "",
      ogImage: "",
      ogType: OgType.article,
      author: "",
      readingTime: "",
      category: "",
      canonicalUrl: "",
      twitterCard: TwitterCardType.summary_large_image,
      twitterSite: "",
      noIndex: false,
      structuredData: true,
    },
  });

  const watchedValues = form.watch();

  function onSubmit(data: ArticleMetadataValues) {
    console.log(data);
    // Here you would typically save the metadata or generate the meta tags
    alert("Metadata saved successfully!");
  }

  return (
    <div className="grid gap-6 lg:grid-cols-[1fr_400px]">
      <Card>
        <CardContent className="p-6">
          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
              <Tabs value={activeTab} onValueChange={setActiveTab}>
                <TabsList className="grid grid-cols-5 mb-6">
                  <TabsTrigger
                    value="basic"
                    className="flex items-center gap-2"
                  >
                    <Info className="h-4 w-4" />
                    <span className="hidden sm:inline">Basic</span>
                  </TabsTrigger>
                  <TabsTrigger
                    value="opengraph"
                    className="flex items-center gap-2"
                  >
                    <Share2 className="h-4 w-4" />
                    <span className="hidden sm:inline">OpenGraph</span>
                  </TabsTrigger>
                  <TabsTrigger
                    value="article"
                    className="flex items-center gap-2"
                  >
                    <Clock className="h-4 w-4" />
                    <span className="hidden sm:inline">Article</span>
                  </TabsTrigger>
                  <TabsTrigger
                    value="twitter"
                    className="flex items-center gap-2"
                  >
                    <Globe className="h-4 w-4" />
                    <span className="hidden sm:inline">Twitter</span>
                  </TabsTrigger>
                  <TabsTrigger
                    value="advanced"
                    className="flex items-center gap-2"
                  >
                    <Tag className="h-4 w-4" />
                    <span className="hidden sm:inline">Advanced</span>
                  </TabsTrigger>
                </TabsList>

                <TabsContent value="basic" className="space-y-4">
                  <div className="space-y-2">
                    <h2 className="text-xl font-semibold">Basic Metadata</h2>
                    <p className="text-sm text-muted-foreground">
                      These fields are essential for SEO and will be used as
                      fallbacks for other metadata.
                    </p>
                  </div>
                  <Separator />
                  <FormField
                    control={form.control}
                    name="title"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Article Title</FormLabel>
                        <FormControl>
                          <Input placeholder="Enter article title" {...field} />
                        </FormControl>
                        <FormDescription>
                          Keep your title under 70 characters for optimal SEO.
                          <span className="ml-1 text-muted-foreground">
                            ({field.value.length}/70)
                          </span>
                        </FormDescription>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  <FormField
                    control={form.control}
                    name="language"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Language</FormLabel>
                        <Select
                          onValueChange={field.onChange}
                          defaultValue={field.value}
                        >
                          <FormControl>
                            <SelectTrigger className="w-full">
                              <SelectValue placeholder="Select language" />
                            </SelectTrigger>
                          </FormControl>
                          <SelectContent>
                            <SelectItem value={Language.en}>English (EN)</SelectItem>
                            <SelectItem value={Language.fr}>Français (FR)</SelectItem>
                          </SelectContent>
                        </Select>
                        <FormDescription>
                          The primary language of your article content.
                        </FormDescription>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  <FormField
                    control={form.control}
                    name="description"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Article Description</FormLabel>
                        <FormControl>
                          <Textarea
                            placeholder="Enter a concise description of your article"
                            className="min-h-[100px]"
                            {...field}
                          />
                        </FormControl>
                        <FormDescription>
                          Keep your description between 50-160 characters for
                          optimal SEO.
                          <span className="ml-1 text-muted-foreground">
                            ({field.value.length}/160)
                          </span>
                        </FormDescription>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  <FormField
                    control={form.control}
                    name="keywords"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Keywords</FormLabel>
                        <FormControl>
                          <Input
                            placeholder="seo, article, metadata, keywords"
                            {...field}
                          />
                        </FormControl>
                        <FormDescription>
                          Comma-separated keywords relevant to your article.
                        </FormDescription>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  <FormField
                    control={form.control}
                    name="thumbnailUrl"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Thumbnail Image URL</FormLabel>
                        <FormControl>
                          <Input
                            placeholder="https://example.com/image.jpg"
                            {...field}
                          />
                        </FormControl>
                        <FormDescription>
                          URL to the image that will be used as a thumbnail.
                        </FormDescription>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </TabsContent>

                <TabsContent value="opengraph" className="space-y-4">
                  <div className="space-y-2">
                    <h2 className="text-xl font-semibold">
                      OpenGraph Metadata
                    </h2>
                    <p className="text-sm text-muted-foreground">
                      These fields control how your article appears when shared
                      on social media.
                    </p>
                  </div>
                  <Separator />
                  <FormField
                    control={form.control}
                    name="ogTitle"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>OG Title</FormLabel>
                        <FormControl>
                          <Input
                            placeholder="Leave blank to use article title"
                            {...field}
                          />
                        </FormControl>
                        <FormDescription>
                          The title that will appear when shared on social
                          media.
                        </FormDescription>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  <FormField
                    control={form.control}
                    name="ogDescription"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>OG Description</FormLabel>
                        <FormControl>
                          <Textarea
                            placeholder="Leave blank to use article description"
                            className="min-h-[100px]"
                            {...field}
                          />
                        </FormControl>
                        <FormDescription>
                          The description that will appear when shared on social
                          media.
                        </FormDescription>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  <FormField
                    control={form.control}
                    name="ogImage"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>OG Image URL</FormLabel>
                        <FormControl>
                          <Input
                            placeholder="Leave blank to use thumbnail"
                            {...field}
                          />
                        </FormControl>
                        <FormDescription>
                          Recommended size: 1200×630 pixels.
                        </FormDescription>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  <FormField
                    control={form.control}
                    name="ogType"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>OG Type</FormLabel>
                        <Select
                          onValueChange={field.onChange}
                          defaultValue={field.value}
                        >
                          <FormControl>
                            <SelectTrigger>
                              <SelectValue placeholder="Select OG type" />
                            </SelectTrigger>
                          </FormControl>
                          <SelectContent>
                            <SelectItem value="article">Article</SelectItem>
                            <SelectItem value="website">Website</SelectItem>
                            <SelectItem value="profile">Profile</SelectItem>
                            <SelectItem value="book">Book</SelectItem>
                          </SelectContent>
                        </Select>
                        <FormDescription>
                          The type of content you're sharing.
                        </FormDescription>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </TabsContent>

                <TabsContent value="article" className="space-y-4">
                  <div className="space-y-2">
                    <h2 className="text-xl font-semibold">Article Metadata</h2>
                    <p className="text-sm text-muted-foreground">
                      These fields provide additional information about your
                      article.
                    </p>
                  </div>
                  <Separator />
                  <FormField
                    control={form.control}
                    name="publishDate"
                    render={({ field }) => (
                      <FormItem className="flex flex-col">
                        <FormLabel>Publication Date</FormLabel>
                        <Popover>
                          <PopoverTrigger asChild>
                            <FormControl>
                              <Button
                                variant={"outline"}
                                className={cn(
                                  "w-full pl-3 text-left font-normal",
                                  !field.value && "text-muted-foreground"
                                )}
                              >
                                {field.value ? (
                                  format(field.value, "PPP")
                                ) : (
                                  <span>Pick a date</span>
                                )}
                                <CalendarIcon className="ml-auto h-4 w-4 opacity-50" />
                              </Button>
                            </FormControl>
                          </PopoverTrigger>
                          <PopoverContent className="w-auto p-0" align="start">
                            <Calendar
                              mode="single"
                              selected={field.value}
                              onSelect={field.onChange}
                              disabled={(date) =>
                                date > new Date() ||
                                date < new Date("1900-01-01")
                              }
                              autoFocus
                            />
                          </PopoverContent>
                        </Popover>
                        <FormDescription>
                          When the article was or will be published.
                        </FormDescription>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  <FormField
                    control={form.control}
                    name="author"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Author</FormLabel>
                        <FormControl>
                          <Input placeholder="John Doe" {...field} />
                        </FormControl>
                        <FormDescription>
                          The name of the article's author.
                        </FormDescription>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  <FormField
                    control={form.control}
                    name="readingTime"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Reading Time</FormLabel>
                        <FormControl>
                          <Input placeholder="5 min read" {...field} />
                        </FormControl>
                        <FormDescription>
                          Estimated time to read the article.
                        </FormDescription>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  <FormField
                    control={form.control}
                    name="category"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Category/Section</FormLabel>
                        <FormControl>
                          <Input
                            placeholder="Technology, Health, etc."
                            {...field}
                          />
                        </FormControl>
                        <FormDescription>
                          The category or section this article belongs to.
                        </FormDescription>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </TabsContent>

                <TabsContent value="twitter" className="space-y-4">
                  <div className="space-y-2">
                    <h2 className="text-xl font-semibold">
                      Twitter Card Metadata
                    </h2>
                    <p className="text-sm text-muted-foreground">
                      These fields control how your article appears when shared
                      on Twitter.
                    </p>
                  </div>
                  <Separator />
                  <FormField
                    control={form.control}
                    name="twitterCard"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Twitter Card Type</FormLabel>
                        <Select
                          onValueChange={field.onChange}
                          defaultValue={field.value}
                        >
                          <FormControl>
                            <SelectTrigger>
                              <SelectValue placeholder="Select card type" />
                            </SelectTrigger>
                          </FormControl>
                          <SelectContent>
                            <SelectItem value="summary">Summary</SelectItem>
                            <SelectItem value="summary_large_image">
                              Summary with Large Image
                            </SelectItem>
                            <SelectItem value="app">App</SelectItem>
                            <SelectItem value="player">Player</SelectItem>
                          </SelectContent>
                        </Select>
                        <FormDescription>
                          How your content will be displayed on Twitter.
                        </FormDescription>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  <FormField
                    control={form.control}
                    name="twitterSite"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Twitter @username</FormLabel>
                        <FormControl>
                          <Input placeholder="@yourusername" {...field} />
                        </FormControl>
                        <FormDescription>
                          The Twitter @username the card should be attributed
                          to.
                        </FormDescription>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </TabsContent>

                <TabsContent value="advanced" className="space-y-4">
                  <div className="space-y-2">
                    <h2 className="text-xl font-semibold">
                      Advanced SEO Settings
                    </h2>
                    <p className="text-sm text-muted-foreground">
                      Additional settings to fine-tune your SEO strategy.
                    </p>
                  </div>
                  <Separator />
                  <FormField
                    control={form.control}
                    name="canonicalUrl"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Canonical URL</FormLabel>
                        <FormControl>
                          <Input
                            placeholder="https://example.com/original-article"
                            {...field}
                          />
                        </FormControl>
                        <FormDescription>
                          The preferred URL for this content if it exists in
                          multiple locations.
                        </FormDescription>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  <FormField
                    control={form.control}
                    name="noIndex"
                    render={({ field }) => (
                      <FormItem className="flex flex-row items-center justify-between rounded-lg border p-4">
                        <div className="space-y-0.5">
                          <FormLabel className="text-base">No Index</FormLabel>
                          <FormDescription>
                            Prevent search engines from indexing this article.
                          </FormDescription>
                        </div>
                        <FormControl>
                          <Switch
                            checked={field.value}
                            onCheckedChange={field.onChange}
                          />
                        </FormControl>
                      </FormItem>
                    )}
                  />
                  <FormField
                    control={form.control}
                    name="structuredData"
                    render={({ field }) => (
                      <FormItem className="flex flex-row items-center justify-between rounded-lg border p-4">
                        <div className="space-y-0.5">
                          <FormLabel className="text-base">
                            Include Structured Data
                          </FormLabel>
                          <FormDescription>
                            Add JSON-LD structured data for rich search results.
                          </FormDescription>
                        </div>
                        <FormControl>
                          <Switch
                            checked={field.value}
                            onCheckedChange={field.onChange}
                          />
                        </FormControl>
                      </FormItem>
                    )}
                  />
                </TabsContent>
              </Tabs>
            </form>
          </Form>
        </CardContent>
      </Card>

      <div className="space-y-6">
        <Card>
          <CardContent className="p-6">
            <h2 className="text-xl font-semibold mb-4">Metadata Preview</h2>
            <MetadataPreview metadata={watchedValues} />
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
