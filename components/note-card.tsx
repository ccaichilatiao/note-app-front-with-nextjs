import React, { useState } from "react";

import { z } from "zod";
import { useForm } from "react-hook-form";
import { AiOutlinePlus } from "react-icons/ai";
import { MdClose, MdCreate, MdDelete, MdOutlinePushPin } from "react-icons/md";
import { zodResolver } from "@hookform/resolvers/zod";
import { format } from "date-fns";

import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";
import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormMessage,
} from "@/components/ui/form";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Calendar } from "@/components/ui/calendar";
import { Textarea } from "@/components/ui/textarea";
import { cn } from "@/lib/utils";
import { api } from "@/lib/api";
import { useMutation } from "@tanstack/react-query";
import { toast } from "@/components/ui/use-toast";

type NoteCardProps = {
  id: number;
  title: string;
  date: Date;
  content: string;
  tags: Array<string>;
  isPinned: boolean;
  refresh: () => void;
  onDelete: () => void;
  onPinNote: () => void;
};

const formSchema = z.object({
  title: z.string({ required_error: "Title is required" }),
  date: z.date({ required_error: "Date is required" }),
  content: z
    .string()
    .min(3, { message: "Content must be at least 3 characters" }),
});

export const NoteCard = ({
  id,
  title,
  date,
  content,
  tags,
  isPinned,
  refresh,
  onDelete,
  onPinNote,
}: NoteCardProps) => {
  const [tag, setTag] = useState("");
  const [existTags, setExistTags] = useState<Array<string>>(tags);

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      title: title,
      content: content,
      date: date,
    },
  });

  const addTag = () => {
    if (!tag) return;
    setExistTags([...existTags, tag]);
    setTag("");
  };
  const removeTag = (tag: string) => {
    setExistTags(existTags.filter((t) => t !== tag));
  };

  const { mutate: updateNote } = useMutation({
    mutationFn: async (values: {
      id: number;
      title: string;
      content: string;
      tags: Array<string>;
      date: Date;
    }) => {
      const { id, title, content, tags, date } = values;
      const data = await api.put(`/notes/${id}`, {
        title,
        content,
        tags,
        date,
      });
      return data;
    },
    onError: (error: any) => {
      toast({
        title: "Update Note",
        description: error.response.data.message,
        variant: "destructive",
        duration: 3000,
      });
    },
    onSuccess: (data: any) => {
      refresh();
    },
  });

  const handleSubmit = async (values: z.infer<typeof formSchema>) => {
    updateNote({ ...values, tags: existTags, id });
  };

  return (
    <div className="border rounded p-4 bg-white hover:shadow-xl transition-all ease-in-out">
      <div className="flex items-center justify-between">
        <div>
          <h6 className="text-sm font-medium">{title}</h6>
          <span className="text-xs text-slate-500">{format(date, "PPP")}</span>
        </div>
        <MdOutlinePushPin
          className={`icon-btn ${
            isPinned ? "text-[#2B85FF]" : "text-slate-300"
          }`}
          onClick={onPinNote}
        />
      </div>
      <p className="text-xs text-slate-600 mt-2">{content?.slice(0, 100)}</p>
      <div className="flex items-center justify-between mt-2">
        <div className="text-xs text-slate-500 flex gap-2">
          {existTags.map((tag) => (
            <span
              key={tag}
              className="bg-slate-200 text-slate-600 px-2 py-1 rounded"
            >
              # {tag}
            </span>
          ))}
        </div>
        <div className="flex items-center gap-2">
          {/* Edit component */}
          <Dialog>
            <DialogTrigger asChild>
              <MdCreate className="icon-btn hover:text-green-600" />
            </DialogTrigger>
            <DialogContent className="sm:max-w-md">
              <DialogHeader>
                <DialogTitle>Update Note</DialogTitle>
              </DialogHeader>

              <Form {...form}>
                <form
                  onSubmit={form.handleSubmit(handleSubmit)}
                  className="flex flex-col gap-y-4"
                >
                  <FormField
                    name="title"
                    control={form.control}
                    render={({ field }) => (
                      <FormItem>
                        <Label className="">Title</Label>
                        <Input
                          placeholder="Enter notes title about next plan"
                          {...field}
                        />
                      </FormItem>
                    )}
                  />
                  <FormField
                    control={form.control}
                    name="content"
                    render={({ field }) => (
                      <FormItem>
                        <Label>Content</Label>
                        <Textarea
                          rows={10}
                          cols={30}
                          placeholder="Enter notes content about next plan"
                          className="resize-none"
                          {...field}
                        />
                      </FormItem>
                    )}
                  />
                  {/* date field */}
                  <FormField
                    control={form.control}
                    name="date"
                    render={({ field }) => (
                      <FormItem className="flex flex-col">
                        <Label>Date</Label>
                        <Popover>
                          <PopoverTrigger asChild>
                            <FormControl>
                              <Button
                                variant={"outline"}
                                className={cn(
                                  "pl-3 text-left font-normal",
                                  !field.value && "text-muted-foreground"
                                )}
                              >
                                {field.value ? (
                                  format(field.value, "PPP")
                                ) : (
                                  <span>Pick a notes time</span>
                                )}
                              </Button>
                            </FormControl>
                          </PopoverTrigger>
                          <PopoverContent className="w-auto p-0" align="start">
                            <Calendar
                              mode="single"
                              selected={field.value}
                              onSelect={field.onChange}
                            />
                          </PopoverContent>
                        </Popover>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <div className="space-y-2">
                    <Label>Tags</Label>
                    <div className="flex space-x-4">
                      <Input
                        placeholder="Tags"
                        value={tag}
                        onChange={(e) => setTag(e.target.value)}
                      />
                      <Button size="icon" type="button" onClick={addTag}>
                        <AiOutlinePlus className="w-4 h-4" />
                      </Button>
                    </div>
                  </div>
                  {existTags.length > 0 && (
                    <div className="flex items-center gap-2 flex-wrap mt-2">
                      {existTags.map((tag, index) => (
                        <span
                          className="flex items-center gap-2 text-sm text-slate-900 bg-slate-100 px-3 py-1 rounded"
                          key={index}
                        >
                          # {tag}
                          <Button
                            type="button"
                            size="icon"
                            variant="ghost"
                            onClick={() => removeTag(tag)}
                          >
                            <MdClose className="w-4 h-4" />
                          </Button>
                        </span>
                      ))}
                    </div>
                  )}

                  <DialogClose asChild>
                    <Button type="submit" className="w-full">
                      Update
                    </Button>
                  </DialogClose>
                </form>
              </Form>
            </DialogContent>
          </Dialog>

          {/* Delete component */}
          <AlertDialog>
            <AlertDialogTrigger asChild>
              <MdDelete className="icon-btn hover:text-red-500" />
            </AlertDialogTrigger>
            <AlertDialogContent>
              <AlertDialogHeader>
                <AlertDialogTitle>Are you absolutely sure?</AlertDialogTitle>
                <AlertDialogDescription>
                  This action cannot be undone. This will permanently delete
                  your note and remove your data from our systems.
                </AlertDialogDescription>
              </AlertDialogHeader>
              <AlertDialogFooter>
                <AlertDialogCancel>Cancel</AlertDialogCancel>
                <AlertDialogAction onClick={onDelete}>
                  Continue
                </AlertDialogAction>
              </AlertDialogFooter>
            </AlertDialogContent>
          </AlertDialog>
        </div>
      </div>
    </div>
  );
};
