"use client";
import { useState } from "react";
import { LogOut, User, Lock, Eye, EyeOff } from "lucide-react";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";
import { createErrorToast } from "@/lib/errorUtils";

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
import { useRouter, usePathname } from "next/navigation";
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
  const [showOldPassword, setShowOldPassword] = useState(false);
  const [showNewPassword, setShowNewPassword] = useState(false);

  const router = useRouter();
  const pathname = usePathname();
  const queryClient = useQueryClient();

  // Function to get the screen title based on the current path
  const getScreenTitle = () => {
    if (pathname === "/main") return "AI Chatbot";
    if (pathname === "/main/courses") return "Digital Courses";
    if (pathname === "/main/bookCoach") return "Coach Booking";
    if (pathname.startsWith("/main/courses/")) return "Course Details";

    // Default title if no match
    return "Dashboard";
  };

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
      toast.error("Profile Update Failed", createErrorToast("Profile Update Failed", error));
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
      toast.error("Password Change Failed", createErrorToast("Password Change Failed", error));
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
        <div className="flex items-center">
          <h1 className="text-white text-lg font-semibold">{getScreenTitle()}</h1>
        </div>
        <div className="flex items-center gap-4">
          {/* <Button
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
          </Button> */}
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
              <div className="relative">
                <Input
                  id="oldPassword"
                  type={showOldPassword ? "text" : "password"}
                  value={oldPassword}
                  onChange={(e) => setOldPassword(e.target.value)}
                  className="col-span-3 pr-10"
                  disabled={changePasswordMutation.isPending}
                />
                <button
                  type="button"
                  onClick={() => setShowOldPassword(!showOldPassword)}
                  className="absolute right-2 top-1/2 transform -translate-y-1/2 text-gray-400"
                >
                  {showOldPassword ? <Eye size={16} /> : <EyeOff size={16} />}
                </button>
              </div>
            </div>
            <div className="grid gap-2 text-white">
              <Label htmlFor="newPassword">New Password</Label>
              <div className="relative">
                <Input
                  id="newPassword"
                  type={showNewPassword ? "text" : "password"}
                  value={newPassword}
                  onChange={(e) => setNewPassword(e.target.value)}
                  className="col-span-3 pr-10"
                  disabled={changePasswordMutation.isPending}
                />
                <button
                  type="button"
                  onClick={() => setShowNewPassword(!showNewPassword)}
                  className="absolute right-2 top-1/2 transform -translate-y-1/2 text-gray-400"
                >
                  {showNewPassword ? <Eye size={16} /> : <EyeOff size={16} />}
                </button>
              </div>
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