"use client";

import {
  Card,
  CardTitle,
  CardFooter,
  CardHeader,
  CardContent,
  CardDescription,
} from "@/components/ui/card";
import {
  Select,
  SelectItem,
  SelectValue,
  SelectTrigger,
  SelectContent,
} from "@/components/ui/select";
import axios from "axios";
import { signUp } from "@/api";
import React, { useState } from "react";
import { SignupFormData } from "@/types";
import { useRouter } from "next/navigation";
import { useToast } from "@/hooks/use-toast";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { FaCameraRetro } from "react-icons/fa";
import { Button } from "@/components/ui/button";
import { signUpSchema } from "@/lib/validations";
import { Skeleton } from "@/components/ui/skeleton";
import AlertDialogLoader from "@/components/AlertDialogLoader";

// @ts-expect-error dont have type file
import Files from "react-files";

const SignUp = () => {
  const router = useRouter();
  const { toast } = useToast();
  const [uploading, setUploading] = useState<boolean>(false);
  const [signningup, setSignningup] = useState<boolean>(false);
  const [formData, setFormData] = useState<SignupFormData>({
    email: "",
    username: "",
    password: "",
    role: "USER",
    avatar: "",
  });
  const [errors, setErrors] = useState<
    Partial<Record<keyof SignupFormData, string>>
  >({});

  const handleImageChange = async (files: File[]) => {
    const upload_url = `${process.env.NEXT_PUBLIC_IMAGE_UPLOAD_URL}`;
    if (files.length === 0) return;
    const file = files[0];
    const image = new FormData();
    image.append("image", file);
    setUploading(true);
    try {
      const res = await axios.post(upload_url, image, {
        headers: {
          "Content-Type": "multipart/form-data",
        },
      });
      if (res.status === 200) {
        setFormData({ ...formData, avatar: res?.data?.data?.url });
      } else {
        toast({
          title: "Error",
          description: "something went wrong while uploading image!!",
          variant: "destructive",
        });
      }
    } catch (error) {
      console.error("Upload failed", error);
      toast({
        title: "Error",
        description: "something went wrong while uploading image!!",
        variant: "destructive",
      });
    } finally {
      setUploading(false);
    }
  };

  const handleSubmit = async () => {
    const result = signUpSchema.safeParse(formData);
    if (!result.success) {
      const formattedErrors: Partial<Record<keyof SignupFormData, string>> = {};
      const errorDetails = result.error.format();
      (Object.keys(errorDetails) as Array<keyof typeof errorDetails>).forEach(
        (key) => {
          const errorValue = errorDetails[key];
          if (Array.isArray(errorValue)) {
            formattedErrors[key as keyof SignupFormData] = errorValue[0] ?? "";
          } else {
            formattedErrors[key as keyof SignupFormData] =
              errorValue?._errors?.[0] ?? "";
          }
        }
      );
      setErrors(formattedErrors);
    } else {
      setErrors({});
      setSignningup(true);
      try {
        const res = await signUp(result.data);
        if (res.data.success) {
          toast({
            title: "Success",
            description: res.data.message,
          });
          router.push("/signin");
        } else {
          toast({
            title: "Error",
            description: res.data.message,
            variant: "destructive",
          });
        }
      } catch (error) {
        console.error("signup failed", error);
        toast({
          title: "Error",
          description: "something went wrong while signning up!!",
          variant: "destructive",
        });
      } finally {
        setSignningup(false);
        setFormData({
          email: "",
          username: "",
          password: "",
          role: "USER",
          avatar: "",
        });
      }
    }
  };

  return (
    <div className="w-full h-screen flex items-center justify-center">
      <AlertDialogLoader
        open={signningup}
        onOpenChange={setSignningup}
        title="Signning up to Quizlytic"
      />
      <Card className="w-96">
        <CardHeader>
          <CardTitle>Sign up to Quizlytic</CardTitle>
          <CardDescription>
            This action will signup you to the server!!
          </CardDescription>
        </CardHeader>
        <CardContent className="w-full h-auto flex gap-3 items-start justify-start flex-col">
          <Select
            value={formData.role}
            onValueChange={(value) =>
              setFormData({ ...formData, role: value as "USER" | "CREATOR" })
            }
          >
            <SelectTrigger className="w-full h-10">
              <SelectValue placeholder="Select role" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="USER">Normal user</SelectItem>
              <SelectItem value="CREATOR">Quiz creator</SelectItem>
            </SelectContent>
          </Select>
          {errors.role && <p className="text-red-500 text-sm">{errors.role}</p>}
          <div className="w-full h-auto flex flex-col items-start justify-start gap-1">
            <Label htmlFor="username">Your username:</Label>
            <Input
              className="h-10 w-full"
              id="username"
              name="username"
              type="text"
              placeholder="Enter your username"
              value={formData.username}
              onChange={(e) =>
                setFormData({ ...formData, username: e.target.value })
              }
            />
            {errors.username && (
              <p className="text-red-500 text-sm">{errors.username}</p>
            )}
          </div>
          <div className="w-full h-auto flex flex-col items-start justify-start gap-1">
            <Label htmlFor="email">Your email:</Label>
            <Input
              className="h-10 w-full"
              id="email"
              name="email"
              type="email"
              placeholder="Enter your email"
              value={formData.email}
              onChange={(e) =>
                setFormData({ ...formData, email: e.target.value })
              }
            />
            {errors.email && (
              <p className="text-red-500 text-sm">{errors.email}</p>
            )}
          </div>
          <div className="w-full h-auto flex flex-col items-start justify-start gap-1">
            <Label htmlFor="password">Your password:</Label>
            <Input
              className="h-10 w-full"
              id="password"
              name="password"
              type="password"
              placeholder="Enter your password"
              value={formData.password}
              onChange={(e) =>
                setFormData({ ...formData, password: e.target.value })
              }
            />
            {errors.password && (
              <p className="text-red-500 text-sm">{errors.password}</p>
            )}
          </div>
          <div className="w-full h-auto flex items-center justify-start gap-3">
            <Files
              accepts={["image/*"]}
              multiple={false}
              clickable
              minFileSize={0}
              maxFileSize={10000000}
              className="files-dropzone"
              onChange={handleImageChange}
            >
              <button
                className="w-16 h-16 bg-zinc-100 rounded-sm flex items-center justify-center flex-col disabled:opacity-50 disabled:cursor-not-allowed"
                disabled={uploading}
              >
                <FaCameraRetro className="text-2xl" />
                <p className="text-xs font-sans font-medium">Upload</p>
              </button>
            </Files>
            {uploading ? (
              <Skeleton className="w-16 h-16 rounded-md bg-zinc-100" />
            ) : (
              formData.avatar !== "" && (
                <div className="w-16 h-16 flex items-center justify-center overflow-hidden rounded-md bg-zinc-100">
                  <img
                    src={formData.avatar}
                    alt="imahe"
                    className="w-full h-full object-cover object-center"
                  />
                </div>
              )
            )}
          </div>
          {errors.avatar && (
            <p className="text-red-500 text-sm">{errors.avatar}</p>
          )}
        </CardContent>
        <CardFooter className="w-full h-auto flex flex-col gap-3">
          <Button className="w-full" onClick={handleSubmit}>
            Sign up
          </Button>
          <div className="w-full h-auto flex items-center justify-center gap-2">
            <p>Already have an account?</p>
            <button onClick={() => router.push("/signin")}>Signin</button>
          </div>
        </CardFooter>
      </Card>
    </div>
  );
};

export default SignUp;
