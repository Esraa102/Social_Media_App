import * as z from "zod";

export const signupFormSchema = z.object({
  name: z
    .string()
    .min(4, { message: "Name must be at least 4 characters" })
    .max(50),
  username: z.string().min(4, {
    message: "Username must be at least 4 characters.",
  }),
  email: z.string().email(),
  password: z.string().min(8, {
    message: "Password must be at least 8 characters",
  }),
});

export const signInFormSchema = z.object({
  email: z.string().email(),
  password: z.string().min(8, {
    message: "Password must be at least 8 characters",
  }),
});

export const postFormSchema = z.object({
  caption: z
    .string()
    .min(4, {
      message: "Caption should be at least 4 characters",
    })
    .max(2200),
  file: z.custom<File[]>(),
  location: z
    .string()
    .min(2, {
      message: "Location should be at least 2 characters",
    })
    .max(500),
  tags: z.string(),
});

export const profileFormSchema = z.object({
  name: z.string().min(4, {
    message: "Name should be at least 4 characters",
  }),
  file: z.custom<File[]>(),
  bio: z.string().max(2200),
});
