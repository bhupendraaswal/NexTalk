import { Edit3, SquarePen } from "lucide-react";
import Search from "./Search";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import useAuthStore from "../../store/useAuthStore";
import { ucFirst } from "../../utils/string";
import { useMemo, useState } from "react";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import axiosInstance from "../../services/apiService";

const UserListHeader = () => {
  const { user, getLoggedInUser } = useAuthStore();
  const [isEditing, setIsEditing] = useState(false);
  const [draft, setDraft] = useState({
    fullName: user?.fullName || user?.username || "",
    bio: user?.bio || "Hey there! I’m using Chatty.",
    status: user?.status || "Available",
  });
  const [avatarFile, setAvatarFile] = useState(null);

  useMemo(() => {
    setDraft({
      fullName: user?.fullName || user?.username || "",
      bio: user?.bio || "Hey there! I’m using Chatty.",
      status: user?.status || "Available",
    });
  }, [user?.fullName, user?.username, user?.bio, user?.status]);

  const handleSave = async () => {
    const formData = new FormData();
    if (avatarFile) formData.append("avatar", avatarFile);
    if (draft.fullName) formData.append("fullName", draft.fullName);
    if (draft.bio) formData.append("bio", draft.bio);
    if (draft.status) formData.append("status", draft.status);

    try {
      await axiosInstance.patch("/users/profile", formData, {
        headers: { "Content-Type": "multipart/form-data" },
      });
      await getLoggedInUser();
      setIsEditing(false);
      setAvatarFile(null);
    } catch (error) {
      console.error(error);
    }
  };

  const avatarUrl = user?.avatar?.url || "/images/user.png";
  const displayName = ucFirst(user?.fullName || user?.username || "User");
  const statusLabel = user?.status || "Available";

  return (
    <section className="pr-1 md:pr-4 mb-4">
      <div className="rounded-2xl border border-border/60 bg-background/80 p-3 shadow-sm backdrop-blur">
        <div className="flex items-center justify-between mb-3">
          <h3 className="text-lg font-semibold">Chats</h3>
          <SquarePen className="size-4 text-muted-foreground" />
        </div>

        <div className="flex items-center gap-3 rounded-xl bg-muted/50 p-3">
          <Avatar className="size-12 border">
            <AvatarImage src={avatarUrl} alt={displayName} />
            <AvatarFallback>{displayName?.slice(0, 2).toUpperCase()}</AvatarFallback>
          </Avatar>

          <div className="min-w-0 flex-1">
            <div className="flex items-center justify-between gap-2">
              <p className="truncate font-medium">{displayName}</p>
              <Button size="sm" variant="ghost" className="h-7 px-2" onClick={() => setIsEditing((prev) => !prev)}>
                <Edit3 className="mr-1 size-3" /> Edit
              </Button>
            </div>
            <p className="truncate text-sm text-muted-foreground">@{user?.username || "user"}</p>
            <p className="truncate text-sm text-muted-foreground">{user?.email || ""}</p>
            <p className="mt-1 text-xs font-medium text-emerald-500">{statusLabel}</p>
          </div>
        </div>

        {isEditing && (
          <div className="mt-3 space-y-2 rounded-xl border border-border/70 bg-background/70 p-3">
            <Input
              type="file"
              accept="image/*"
              onChange={(event) => setAvatarFile(event.target.files?.[0] || null)}
            />
            <Input
              placeholder="Full name"
              value={draft.fullName}
              onChange={(event) => setDraft((prev) => ({ ...prev, fullName: event.target.value }))}
            />
            <Input
              placeholder="Status"
              value={draft.status}
              onChange={(event) => setDraft((prev) => ({ ...prev, status: event.target.value }))}
            />
            <Textarea
              placeholder="Bio"
              value={draft.bio}
              onChange={(event) => setDraft((prev) => ({ ...prev, bio: event.target.value }))}
              className="min-h-20"
            />
            <div className="flex justify-end gap-2">
              <Button variant="outline" size="sm" onClick={() => setIsEditing(false)}>
                Cancel
              </Button>
              <Button size="sm" onClick={handleSave}>
                Save
              </Button>
            </div>
          </div>
        )}
      </div>

      <div className="mt-3">
        <Search />
      </div>
    </section>
  );
};

export default UserListHeader;
