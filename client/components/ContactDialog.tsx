"use client";

import {
  AlertDialog,
  AlertDialogTitle,
  AlertDialogCancel,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogContent,
  AlertDialogDescription,
} from "@/components/ui/alert-dialog";
import { Label } from "./ui/label";
import { Input } from "./ui/input";
import { Button } from "./ui/button";
import emailjs from "@emailjs/browser";
import { Textarea } from "./ui/textarea";
import { useToast } from "@/hooks/use-toast";
import React, { FormEvent, useRef, useState } from "react";

const ContactDialog = ({
  open,
  onOpenChange,
}: {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}) => {
  const { toast } = useToast();
  const form = useRef<HTMLFormElement>(null);
  const [loading, setLoading] = useState<boolean>(false);

  const sendEmail = (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setLoading(true);
    emailjs
      .sendForm(
        `${process.env.NEXT_PUBLIC_EMAILJS_SERVICE}`,
        `${process.env.NEXT_PUBLIC_EMAILJS_TEMPLATE}`,
        form.current!,
        {
          publicKey: `${process.env.NEXT_PUBLIC_EMAILJS_PUBLIC}`,
        }
      )
      .then(
        () => {
          form.current!.reset();
          toast({
            title: "Success",
            description: "successfully sent the email",
          });
        },
        (error) => {
          console.log("FAILED...", error);
          toast({
            title: "Error",
            description: "Something went wrong while sending email",
            variant: "destructive",
          });
        }
      );
    setLoading(false);
  };

  return (
    <AlertDialog open={open} onOpenChange={onOpenChange}>
      <AlertDialogContent className="w-96">
        <AlertDialogHeader>
          <AlertDialogTitle className="font-sans font-bold text-lg">
            Contact Us
          </AlertDialogTitle>
          <AlertDialogDescription>
            We’d love to hear from you! Whether you have questions, feedback, or
            need support, feel free to reach out.
          </AlertDialogDescription>
        </AlertDialogHeader>
        <form
          ref={form}
          noValidate
          autoComplete="off"
          onSubmit={sendEmail}
          className="w-full h-auto flex items-start justify-start flex-col gap-3"
        >
          <div className="w-full h-auto flex items-start justify-start flex-col gap-1">
            <Label>
              Your name: <span className="text-red-500">*</span>
            </Label>
            <Input
              type="text"
              className="w-full h-10 border-black"
              placeholder="Enter your name"
            />
          </div>
          <div className="w-full h-auto flex items-start justify-start flex-col gap-1">
            <Label>
              Your email: <span className="text-red-500">*</span>
            </Label>
            <Input
              type="email"
              className="w-full h-10 border-black"
              placeholder="Enter your email"
            />
          </div>
          <div className="w-full h-auto flex items-start justify-start flex-col gap-1">
            <Label>
              Subject: <span className="text-red-500">*</span>
            </Label>
            <Textarea
              className="w-full max-h-32 min-h-16 border-black"
              placeholder="Enter your email"
            />
          </div>
          <Button className="w-full h-10" type="submit" disabled>
            {loading ? "sending mail..." : "Send"}
          </Button>
        </form>
        <AlertDialogFooter>
          <AlertDialogCancel className="w-full">Close</AlertDialogCancel>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );
};

export default ContactDialog;
