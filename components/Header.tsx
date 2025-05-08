"use client";
import { useState } from "react";
import { LogOut, Search, User, Lock } from "lucide-react";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { toast, Toaster } from "sonner"; // Import Sonner

import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "@/components/ui/dialog";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { SidebarTrigger } from "@/components/ui/sidebar";
import Image from "next/image";
import { useRouter } from "next/navigation";
import useAuthStore from "@/stores/authStore";
import { updateUserName, changePassword } from "@/lib/ApiService";

export function Header() {
  const [isProfileOpen, setIsProfileOpen] = useState(false);
  const [isPasswordOpen, setIsPasswordOpen] = useState(false);
  const { user } = useAuthStore();
  const [profileImage, setProfileImage] = useState("/placeholder.svg?height=32&width=32");
  const [userName, setUserName] = useState(user?.name || "");
  const [oldPassword, setOldPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");

  const router = useRouter();
  const queryClient = useQueryClient();

  // React Query mutation for updating the username
  const updateNameMutation = useMutation({
    mutationFn: updateUserName,
    onSuccess: (data) => {
      useAuthStore.getState().setAuth(data.token || useAuthStore.getState().token, {
        id: data.user.id || user?.id,
        email: data.user.email || user?.email,
        name: data.user.name,
      });
      queryClient.invalidateQueries({ queryKey: ["userProfile"] });
      setIsProfileOpen(false);
      toast.success("Profile updated successfully!"); // Success toast
    },
    onError: (error) => {
      console.error("Error updating username:", error);
      toast.error("Failed to update profile. Please try again."); // Error toast
    },
  });

  // React Query mutation for changing password
  const changePasswordMutation = useMutation({
    mutationFn: changePassword,
    onSuccess: () => {
      setOldPassword("");
      setNewPassword("");
      setIsPasswordOpen(false);
      toast.success("Password changed successfully!"); // Success toast
    },
    onError: (error) => {
      console.error("Error changing password:", error);
      toast.error("Failed to change password. Please try again."); // Error toast
    },
  });

  const handleLogout = () => {
    const clearAuth = useAuthStore.getState().clearAuth;
    clearAuth();
    router.push("/auth/login");
    toast.success("Logged out successfully!"); // Logout toast
  };

  const handleSaveProfile = () => {
    updateNameMutation.mutate(userName);
  };

  const handleChangePassword = () => {
    changePasswordMutation.mutate({ oldPassword, newPassword });
  };

  return (
    <>
      {/* Add Toaster component to render toasts */}
      
      <header  className="sticky top-0 z-50 flex h-16 items-center justify-between border-b border-[#3C4A60] bg-[#0A0F1D] px-4">
        <div className="flex items-center gap-2 md:hidden">
          <SidebarTrigger />
        </div>
        <div className="flex w-full max-w-md font-semibold items-center rounded-full text-white bg-[#334155] px-3 py-1">
          <Search className="h-5 w-5 text-white" />
          <Input
            type="search"
            placeholder="Search..."
            className="border-0 bg-transparent placeholder:text-white text-white text-sm font-semibold focus-visible:ring-0 focus-visible:ring-offset-0"
          />
        </div>
        <div className="flex items-center gap-4">
          <Button
            variant="default"
            size="sm"
            className="hidden bg-[#F6BE00] text-black rounded-[10px] gap-2 hover:bg-[#F6BE00] md:flex"
          >
            <Image src="/phone.svg" alt="phone" width={16} height={16} />
            Contact Us
          </Button>
          <Button
            variant="ghost"
            size="icon"
            className="text-muted-foreground hover:bg-transparent border rounded-full border-[#5C5C5C]"
          >
            <Image src="/bell.svg" alt="phone" width={16} height={16} />
          </Button>
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Avatar className="h-8 w-8 cursor-pointer">
                <AvatarImage src={profileImage || "/placeholder.svg"} alt={userName} />
                <AvatarFallback>{user?.name?.charAt(0) || "U"}</AvatarFallback>
              </Avatar>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end" className="w-56">
              <DropdownMenuItem onClick={() => setIsProfileOpen(true)}>
                <User className="mr-2 h-4 w-4" />
                <span>Edit Profile</span>
              </DropdownMenuItem>
              <DropdownMenuItem onClick={() => setIsPasswordOpen(true)}>
                <Lock className="mr-2 h-4 w-4" />
                <span>Change Password</span>
              </DropdownMenuItem>
              <DropdownMenuItem onClick={handleLogout}>
                <LogOut className="mr-2 h-4 w-4" />
                <span>Logout</span>
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      </header>

      {/* Edit Profile Dialog */}
      <Dialog open={isProfileOpen} onOpenChange={setIsProfileOpen}>
        <DialogContent className="sm:max-w-[425px] bg-[#1a2235] border-[#3C4A60]">
          <DialogHeader>
            <DialogTitle className="text-white">Edit Profile</DialogTitle>
          </DialogHeader>
          <div className="grid gap-4 py-4">
            <div className="flex flex-col items-center gap-4">
              <Avatar className="h-24 w-24">
                <AvatarImage src={profileImage || "/placeholder.svg"} alt={userName} />
                <AvatarFallback>{user?.name?.charAt(0) || "U"}</AvatarFallback>
              </Avatar>
            </div>
            <div className="grid gap-2 text-white">
              <Label htmlFor="name">Name</Label>
              <Input
                id="name"
                value={userName}
                onChange={(e) => setUserName(e.target.value)}
                className="col-span-3"
                disabled={updateNameMutation.isPending}
              />
            </div>
          </div>
          <DialogFooter>
            <Button
              className="bg-[#F6BE00] hover:bg-yellow-600 text-black"
              onClick={handleSaveProfile}
              disabled={updateNameMutation.isPending}
            >
              {updateNameMutation.isPending ? "Saving..." : "Save changes"}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Change Password Dialog */}
      <Dialog open={isPasswordOpen} onOpenChange={setIsPasswordOpen}>
        <DialogContent className="sm:max-w-[425px] bg-[#1a2235] border-[#3C4A60]">
          <DialogHeader>
            <DialogTitle className="text-white">Change Password</DialogTitle>
          </DialogHeader>
          <div className="grid gap-4 py-4">
            <div className="grid gap-2 text-white">
              <Label htmlFor="oldPassword">Old Password</Label>
              <Input
                id="oldPassword"
                type="password"
                value={oldPassword}
                onChange={(e) => setOldPassword(e.target.value)}
                className="col-span-3"
                disabled={changePasswordMutation.isPending}
              />
            </div>
            <div className="grid gap-2 text-white">
              <Label htmlFor="newPassword">New Password</Label>
              <Input
                id="newPassword"
                type="password"
                value={newPassword}
                onChange={(e) => setNewPassword(e.target.value)}
                className="col-span-3"
                disabled={changePasswordMutation.isPending}
              />
            </div>
          </div>
          <DialogFooter>
            <Button
              className="bg-[#F6BE00] hover:bg-yellow-600 text-black"
              onClick={handleChangePassword}
              disabled={changePasswordMutation.isPending}
            >
              {changePasswordMutation.isPending ? "Changing..." : "Change Password"}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </>
  );
}