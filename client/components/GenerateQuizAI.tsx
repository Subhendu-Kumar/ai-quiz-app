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
import { Label } from "./ui/label";
import { Input } from "./ui/input";
import { Button } from "./ui/button";
import { QuizSchema } from "@/types";
import React, { useState } from "react";
import { Textarea } from "./ui/textarea";
import { quizSchema } from "@/lib/validations";
import { useToast } from "@/hooks/use-toast";
import { generateQuiz } from "@/api";
import AlertDialogLoader from "./AlertDialogLoader";
import { useRouter } from "next/navigation";

const GenerateQuizAI = () => {
  const router = useRouter();
  const { toast } = useToast();
  const [formData, setFormData] = useState<QuizSchema>({
    title: "",
    topic: "",
    description: "",
    numberofquestions: 5,
    difficultylevel: "EASY",
    quiztype: "MULTIPLE_CHOICE",
  });
  const [errors, setErrors] = useState<
    Partial<Record<keyof QuizSchema, string>>
  >({});
  const [generating, setGenerating] = useState<boolean>(false);

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSelectChange = (name: keyof QuizSchema, value: string) => {
    setFormData((prev) => ({
      ...prev,
      [name]: name === "numberofquestions" ? Number(value) : value,
    }));
  };

  const handleSubmit = async () => {
    const result = quizSchema.safeParse(formData);
    if (!result.success) {
      const errorMessages: Partial<Record<keyof QuizSchema, string>> = {};
      result.error.errors.forEach((err) => {
        if (err.path.length) {
          errorMessages[err.path[0] as keyof QuizSchema] = err.message;
        }
      });
      setErrors(errorMessages);
    } else {
      setErrors({});
      setGenerating(true);
      try {
        const res = await generateQuiz(result.data);
        if (res.data.success) {
          toast({
            title: "Success",
            description: res.data.message,
          });
          router.push("/dashboard");
        } else {
          toast({
            title: "Error",
            description: res.data.message,
            variant: "destructive",
          });
        }
      } catch (error) {
        console.log("error generating quiz: ", error);
        toast({
          title: "Error",
          description: "Something went wrong",
          variant: "destructive",
        });
      } finally {
        setGenerating(false);
        setFormData({
          title: "",
          topic: "",
          description: "",
          numberofquestions: 5,
          difficultylevel: "EASY",
          quiztype: "MULTIPLE_CHOICE",
        });
      }
    }
  };

  return (
    <div className="w-full h-auto flex items-center justify-center py-20 px-10">
      <AlertDialogLoader
        title="generating quiz using ai"
        open={generating}
        onOpenChange={setGenerating}
      />
      <Card className="w-[80%]">
        <CardHeader className="flex items-center justify-center">
          <CardTitle>Generate Quiz</CardTitle>
          <CardDescription>
            Here you can generate quiz through AI by filling up the form!!
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="w-full h-auto flex items-center justify-center gap-4">
            <div className="w-[50%] h-auto flex flex-col items-start justify-start gap-1">
              <Label htmlFor="title">Quiz title:</Label>
              <Input
                id="title"
                type="title"
                name="title"
                className="h-10 w-full border-black"
                value={formData.title}
                onChange={handleChange}
                placeholder="Enter quiz title"
              />
              {errors.title && (
                <p className="text-red-500 text-sm">{errors.title}</p>
              )}
            </div>
            <div className="w-[50%] h-auto flex flex-col items-start justify-start gap-1">
              <Label htmlFor="topic">Quiz topic:</Label>
              <Input
                id="topic"
                type="topic"
                name="topic"
                className="h-10 w-full border-black"
                value={formData.topic}
                onChange={handleChange}
                placeholder="Enter quiz topic"
              />
              {errors.topic && (
                <p className="text-red-500 text-sm">{errors.topic}</p>
              )}
            </div>
          </div>
          <div className="w-full h-auto flex flex-col items-start justify-start gap-1 mt-4">
            <Label htmlFor="description">Quiz description:</Label>
            <Textarea
              id="description"
              name="description"
              value={formData.description}
              onChange={handleChange}
              placeholder="Enter quiz description...."
              className="w-full min-h-20 max-h-36 border-black"
            />
            {errors.description && (
              <p className="text-red-500 text-sm">{errors.description}</p>
            )}
          </div>
          <div className="w-full grid grid-cols-3 gap-4 mt-4">
            <Select
              onValueChange={(value) => handleSelectChange("quiztype", value)}
              value={formData.quiztype}
            >
              <SelectTrigger className="w-full h-10 border-black">
                <SelectValue placeholder="Quiz type" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="MULTIPLE_CHOICE">multiple choice</SelectItem>
                <SelectItem value="TRUE_FALSE">true/false</SelectItem>
              </SelectContent>
            </Select>
            <Select
              onValueChange={(value) =>
                handleSelectChange("difficultylevel", value)
              }
              value={formData.difficultylevel}
            >
              <SelectTrigger className="w-full h-10 border-black">
                <SelectValue placeholder="Difficulty level" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="EASY">easy</SelectItem>
                <SelectItem value="MEDIUM">medium</SelectItem>
                <SelectItem value="HARD">hard</SelectItem>
              </SelectContent>
            </Select>
            <Select
              onValueChange={(value) =>
                handleSelectChange("numberofquestions", value)
              }
              value={formData.numberofquestions.toLocaleString()}
            >
              <SelectTrigger className="w-full h-10 border-black">
                <SelectValue placeholder="Difficulty level" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="5">5</SelectItem>
                <SelectItem value="10">10</SelectItem>
                <SelectItem value="20">20</SelectItem>
                <SelectItem value="30">30</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </CardContent>
        <CardFooter>
          <Button onClick={handleSubmit} className="w-full h-10">
            Generate
          </Button>
        </CardFooter>
      </Card>
    </div>
  );
};

export default GenerateQuizAI;
