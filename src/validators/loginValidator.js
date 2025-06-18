import { z } from "zod";

const loginSchema = z.object({
  email: z
    .string()
    .nonempty("Email is required.")
    .email("Please Enter a valid email address."),
  password: z
    .string()
    .nonempty("Password is required.")
    .min(6, "Password must be at least 6 characters long.")
    .max(20, "Password must be less than 20 characters.")
    .regex(/[A-Z]/, "Password must contain at least one uppercase letter.")
    .regex(/[a-z]/, "Password must contain at least one lowercase letter.")
    .regex(/[0-9]/, "Password must contain at least one number.")
    .regex(
      /[!@#$%^&*(),.?":{}|<>]/,
      "Password must contain at least one special character."
    ),
});

export default loginSchema;
