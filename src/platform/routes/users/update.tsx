import { Button } from "~components/ui/button";
import { Input } from "~components/ui/input";
import { Label } from "~components/ui/label";
import { useState } from "react";
import { toast } from "sonner";
import { ChevronLeft, Upload } from "lucide-react";

/*
export async function loader({ params, context }: Route.LoaderArgs) {
    const db = context.get(DbContext);
    const user = await db.table<OrgMember>("users").get(params.id).run();

    if (!user) {
        throw new Response("User not found", { status: 404 });
    }

    return { user };
}

export async function action({ request, context, params }: Route.ActionArgs) {
    const formData = await request.formData();
    const firstName = formData.get("firstName") as string;
    const lastName = formData.get("lastName") as string;
    const middleName = formData.get("middleName") as string;
    const role = formData.get("role") as string;
    const bio = formData.get("bio") as string;
    const pictureUrl = formData.get("pictureUrl") as string;
    const googleAuthEmail = formData.get("googleAuthEmail") as string;

    const db = context.get(DbContext);

    // Basic validation
    if (!firstName || !lastName || !role || !googleAuthEmail) {
        return { error: "Missing required fields" };
    }

    await db.table<OrgMember>("users").get(params.id).update({
        firstName,
        lastName,
        middleName,
        role,
        bio,
        pictureUrl,
        googleAuthEmail,
    }).run();

    return redirect("/platform/users");
}

export default function UpdateUser() {
    const { user } = useLoaderData<typeof loader>();
    const actionData = useActionData<typeof action>();
    const navigation = useNavigation();
    const isSubmitting = navigation.state === "submitting";
    const [uploading, setUploading] = useState(false);
    const [imageUrl, setImageUrl] = useState<string>(user.pictureUrl || "");

    const handleImageUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (!file) return;

        setUploading(true);

        try {
            const response = await fetch("/platform/content/media/upload", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({
                    file: file.name,
                    size: file.size,
                    type: file.type
                })
            });

            if (!response.ok) throw new Error("Failed to get upload URL");

            const { url, media } = await response.json();

            const uploadResponse = await fetch(url, {
                method: "PUT",
                body: file,
                headers: { "Content-Type": file.type }
            });

            if (!uploadResponse.ok) throw new Error("Failed to upload image");

            setImageUrl(media.url);
            toast.success("Image uploaded successfully");

        } catch (error) {
            console.error(error);
            toast.error("Failed to upload image");
        } finally {
            setUploading(false);
        }
    };

    return (
        <div className="max-w-2xl mx-auto p-6">
            <div className="mb-6">
                <Link to="/platform/users" className="flex items-center text-gray-500 hover:text-gray-700 mb-4">
                    <ChevronLeft className="w-4 h-4 mr-1" />
                    Back to Users
                </Link>
                <h1 className="text-2xl font-bold">Update User</h1>
            </div>

            <Form method="post" className="space-y-6 bg-white p-6 rounded-lg shadow">
                {actionData?.error && (
                    <div className="bg-red-50 text-red-600 p-3 rounded text-sm">
                        {actionData.error}
                    </div>
                )}

                <div className="grid grid-cols-2 gap-4">
                    <div className="space-y-2">
                        <Label htmlFor="firstName">First Name</Label>
                        <Input id="firstName" name="firstName" defaultValue={user.firstName} required />
                    </div>
                    <div className="space-y-2">
                        <Label htmlFor="lastName">Last Name</Label>
                        <Input id="lastName" name="lastName" defaultValue={user.lastName} required />
                    </div>
                </div>

                <div className="space-y-2">
                    <Label htmlFor="middleName">Middle Name</Label>
                    <Input id="middleName" name="middleName" defaultValue={user.middleName} />
                </div>

                <div className="space-y-2">
                    <Label htmlFor="googleAuthEmail">Email</Label>
                    <Input id="googleAuthEmail" name="googleAuthEmail" type="email" defaultValue={user.googleAuthEmail} required />
                </div>

                <div className="space-y-2">
                    <Label htmlFor="role">Role</Label>
                    <Input id="role" name="role" defaultValue={user.role} required placeholder="e.g. Admin, Editor" />
                </div>

                <div className="space-y-2">
                    <Label htmlFor="bio">Bio</Label>
                    <Textarea id="bio" name="bio" rows={4} defaultValue={user.bio} />
                </div>

                <div className="space-y-2">
                    <Label>Profile Picture</Label>
                    <div className="flex items-center space-x-4">
                        {imageUrl && (
                            <img src={imageUrl} alt="Preview" className="w-16 h-16 rounded-full object-cover" />
                        )}
                        <div className="relative">
                            <Input
                                type="file"
                                accept="image/*"
                                onChange={handleImageUpload}
                                className="hidden"
                                id="picture-upload"
                                disabled={uploading}
                            />
                            <Label
                                htmlFor="picture-upload"
                                className={`cursor-pointer inline-flex items-center px-4 py-2 border border-gray-300 shadow-sm text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50 ${uploading ? 'opacity-50 cursor-not-allowed' : ''}`}
                            >
                                <Upload className="w-4 h-4 mr-2" />
                                {uploading ? "Uploading..." : "Upload Image"}
                            </Label>
                        </div>
                        <input type="hidden" name="pictureUrl" value={imageUrl} />
                    </div>
                </div>

                <div className="pt-4">
                    <Button type="submit" disabled={isSubmitting || uploading} className="w-full">
                        {isSubmitting ? "Updating..." : "Update User"}
                    </Button>
                </div>
            </Form>
        </div>
    );
}

*/