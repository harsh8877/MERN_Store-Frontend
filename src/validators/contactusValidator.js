import { z } from "zod";

const contactusSchema = z.object({
  name: z
    .string()
    .min(1, "First Name is required.")
    .regex(/^[A-Za-z\s]+$/, "First Name can only contain letters."),
  email: z
    .string()
    .nonempty("Email is required.")
    .email("Please Enter a valid email address."),
  message: z
    .string()
    .min(1, "Message is required.")
    .regex(/^[A-Za-z\s]+$/, "Message can only contain letters."),
});

export default contactusSchema;
