"use client";

import React, { useState } from "react";
import { useRouter } from "next/navigation";

import { z } from "zod";
import { useForm } from "react-hook-form";
import { MdAdd, MdClose } from "react-icons/md";
import { zodResolver } from "@hookform/resolvers/zod";
import { AiOutlinePlus } from "react-icons/ai";
import { useMutation, useQuery } from "@tanstack/react-query";

import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import {
  Pagination,
  PaginationContent,
  PaginationEllipsis,
  PaginationItem,
  PaginationLink,
  PaginationNext,
  PaginationPrevious,
} from "@/components/ui/pagination";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
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

import { formSchema } from "./constants";
import { NoteCard } from "@/components/note-card";
import { cn } from "@/lib/utils";
import { Calendar } from "@/components/ui/calendar";
import { format, formatDate } from "date-fns";
import { api } from "@/lib/api";
import Spanner from "@/components/spanner";
import { toast } from "@/components/ui/use-toast";

type NoteType = {
  id: number;
  title: string;
  content: string;
  date: Date;
  tags: Array<string>;
  isPinned: boolean;
};

const DashboardPage = () => {
  const [tag, setTag] = useState("");
  const [tags, setTags] = useState<Array<string>>([]);

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      title: "",
      content: "",
    },
  });

  const addTag = () => {
    if (!tag) return;
    setTags([...tags, tag]);
    setTag("");
  };
  const removeTag = (tag: string) => {
    setTags(tags.filter((t) => t !== tag));
  };

  // create
  const { mutate: addNote } = useMutation({
    mutationFn: async (values: {
      title: string;
      content: string;
      tags: Array<string>;
      date: Date;
    }) => {
      return api.post("/notes", values);
    },
    onError: (error: any) => {
      toast({
        title: "Create Note",
        description: error.response.data.message,
        variant: "destructive",
        duration: 3000,
      });
    },
    onSuccess: (data: any) => {
      noteRefetch();
    },
  });

  const handleSubmit = async (values: z.infer<typeof formSchema>) => {
    console.log(values);
    addNote({ ...values, tags: tags });
    form.reset();
    setTags([]);
  };

  const {
    data,
    isPending,
    refetch: noteRefetch,
  } = useQuery({
    queryKey: ["notes"],
    queryFn: async () => {
      const data: any = await api.get("/notes");
      return data.notes;
    },
    staleTime: 1000 * 60 * 10,
  });

  const { mutate: deleteNote } = useMutation({
    mutationFn: async (id: number) => {
      const data = await api.delete(`/notes/${id}`);
      return data;
    },
    onError: (error: any) => {
      toast({
        title: "Delete Note",
        description: error.response.data.message,
        variant: "destructive",
        duration: 3000,
      });
    },
    onSuccess: (data: any) => {
      noteRefetch();
    },
  });

  const { mutate: pinNote } = useMutation({
    mutationFn: async (id: number) => {
      const data = await api.patch(`/notes/${id}`);
      return data;
    },
    onError: (error: any) => {
      toast({
        title: "Pin Note",
        description: error.response.data.message,
        variant: "destructive",
        duration: 3000,
      });
    },
    onSuccess: (data: any) => {
      noteRefetch();
    },
  });

  return (
    <>
      {isPending ? (
        <Spanner />
      ) : (
        <div className="container mx-auto">
          <div className="grid grid-cols-2 gap-4 mt-8 md:grid-cols-3">
            {data.length > 0 ? (
              data.map((note: any) => (
                <NoteCard
                  key={note.id}
                  id={note.id}
                  title={note.title}
                  date={note.date ? new Date(note.date) : new Date()}
                  content={note.content}
                  tags={note.tags || []}
                  isPinned={note.isPinned}
                  refresh={() => {
                    noteRefetch();
                  }}
                  onDelete={() => {
                    deleteNote(note.id);
                  }}
                  onPinNote={() => {
                    pinNote(note.id);
                  }}
                />
              ))
            ) : (
              <div className="flex items-center justify-center text-3xl min-h-screen">
                Not found Notes
              </div>
            )}
          </div>
          <Dialog>
            <DialogTrigger asChild>
              <Button className="fixed w-16 h-16 flex items-center justify-center rounded-2xl  right-10 bottom-10">
                <MdAdd className="text-[32px] text-white" />
              </Button>
            </DialogTrigger>
            <DialogContent className="sm:max-w-md">
              <DialogHeader>
                <DialogTitle>Add Note</DialogTitle>
              </DialogHeader>

              <Form {...form}>
                <form
                  onSubmit={form.handleSubmit(handleSubmit)}
                  className="flex flex-col gap-y-4"
                >
                  <FormField
                    name="title"
                    render={({ field }) => (
                      <FormItem>
                        <Label>Title</Label>
                        <Input placeholder="Title" {...field} />
                      </FormItem>
                    )}
                  />
                  <FormField
                    name="content"
                    render={({ field }) => (
                      <FormItem>
                        <Label>Content</Label>
                        <Textarea
                          rows={10}
                          cols={30}
                          placeholder="Content"
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
                              // disabled={(date) =>
                              //   date > new Date() || date < new Date("1900-01-01")
                              // }
                              // initialFocus
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
                  {tags.length > 0 && (
                    <div className="flex items-center gap-2 flex-wrap mt-2">
                      {tags.map((tag, index) => (
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
                    <Button type="submit" className="w-full ">
                      Add
                    </Button>
                  </DialogClose>
                </form>
              </Form>
            </DialogContent>
          </Dialog>
        </div>
      )}
    </>
  );
};

export default DashboardPage;
