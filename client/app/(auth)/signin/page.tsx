"use client";

import {
  Card,
  CardTitle,
  CardFooter,
  CardHeader,
  CardContent,
  CardDescription,
} from "@/components/ui/card";
import { signIn } from "@/api";
import React, { useState } from "react";
import { SignInFormData } from "@/types";
import { useRouter } from "next/navigation";
import { useToast } from "@/hooks/use-toast";
import { useAuth } from "@/context/provider";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { signInSchema } from "@/lib/validations";
import AlertDialogLoader from "@/components/AlertDialogLoader";

const SignIn = () => {
  const router = useRouter();
  const { login } = useAuth();
  const { toast } = useToast();
  const [signningin, setSignningin] = useState<boolean>(false);
  const [formData, setFormData] = useState<SignInFormData>({
    email: "",
    password: "",
  });
  const [errors, setErrors] = useState<
    Partial<Record<keyof SignInFormData, string>>
  >({});

  const handleSubmit = async () => {
    const result = signInSchema.safeParse(formData);
    if (!result.success) {
      const formattedErrors: Partial<Record<keyof SignInFormData, string>> = {};
      const errorDetails = result.error.format();
      (Object.keys(errorDetails) as Array<keyof typeof errorDetails>).forEach(
        (key) => {
          const errorValue = errorDetails[key];
          if (Array.isArray(errorValue)) {
            formattedErrors[key as keyof SignInFormData] = errorValue[0] ?? "";
          } else {
            formattedErrors[key as keyof SignInFormData] =
              errorValue?._errors?.[0] ?? "";
          }
        }
      );
      setErrors(formattedErrors);
    } else {
      setErrors({});
      setSignningin(true);
      try {
        const res = await signIn(result.data);
        if (res.data.success) {
          toast({
            title: "Success",
            description: res.data.message,
          });
          login(res.data.token, res.data.user);
          router.push("/dashboard");
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
        setSignningin(false);
        setFormData({ email: "", password: "" });
      }
    }
  };

  return (
    <div className="w-full h-screen flex items-center justify-center">
      <AlertDialogLoader
        open={signningin}
        onOpenChange={setSignningin}
        title="Signning in to Quizlytic"
      />
      <Card className="w-96">
        <CardHeader>
          <CardTitle>Sign in to Quizlytic</CardTitle>
          <CardDescription>Enter your credentials to continue.</CardDescription>
        </CardHeader>
        <CardContent className="flex flex-col gap-3">
          <div className="w-full h-auto flex flex-col items-start justify-start gap-1">
            <Label htmlFor="email">Your email:</Label>
            <Input
              id="email"
              type="email"
              name="email"
              className="h-10 w-full"
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
              id="password"
              type="password"
              name="password"
              className="h-10 w-full"
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
        </CardContent>
        <CardFooter className="w-full h-auto flex flex-col gap-3">
          <Button className="w-full" onClick={handleSubmit}>
            Sign in
          </Button>
          <div className="w-full h-auto flex items-center justify-center gap-2">
            <p>Don&apos;t have an account?</p>
            <button onClick={() => router.push("/signup")}>Signup</button>
          </div>
        </CardFooter>
      </Card>
    </div>
  );
};

export default SignIn;
