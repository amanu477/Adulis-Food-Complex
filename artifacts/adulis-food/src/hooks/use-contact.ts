import { useMutation } from "@tanstack/react-query";
import { z } from "zod";

export const contactSchema = z.object({
  name: z.string().min(2, "Name is required"),
  email: z.string().email("Invalid email address"),
  message: z.string().min(10, "Message must be at least 10 characters"),
});

export type ContactInput = z.infer<typeof contactSchema>;

export function useContact() {
  return useMutation({
    mutationFn: async (data: ContactInput) => {
      // Simulate API call for the frontend-only app
      await new Promise((resolve) => setTimeout(resolve, 1500));
      return { success: true, data };
    },
  });
}
