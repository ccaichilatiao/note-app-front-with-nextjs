import { z } from "zod";

export const formSchema = z.object({
  title: z.string({ required_error: "Title is required" }),
  content: z
    .string()
    .min(3, { message: "Content must be at least 3 characters" }),
  date: z.date({ required_error: "Date is required" }),
});
