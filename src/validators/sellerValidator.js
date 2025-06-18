import { z } from "zod";

const sellerSchema = z.object({
  name: z
    .string()
    .trim()
    .min(2, "Name is required and must be at least 2 characters.")
    .regex(/^[A-Za-z\s]+$/, "First Name can only contain letters."),
  email: z
    .string()
    .trim()
    .nonempty("Email is required.")
    .email("Please Enter a valid email address."),
  phone: z
    .string()
    .trim()
    .min(10, "Phone must be at least 10 digits.")
    .regex(/^\d+$/, "Phone number must contain digits only."),
  brand: z.string().trim().min(2, "Brand is required."),
  business: z
    .string()
    .trim()
    .min(10, "Business description must be at least 10 characters."),
});

export default sellerSchema;
