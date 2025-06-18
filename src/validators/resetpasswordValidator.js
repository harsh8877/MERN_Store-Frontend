import { z } from "zod";

const resetpasswordSchema = z.object({
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
  confirmPassword: z
    .string()
    .nonempty("Confirm Password is required.")
    .min(6, "Confirm Password must be at least 6 characters long.")
    .max(20, "Confirm Password must be less than 20 characters.")
    .regex(
      /[A-Z]/,
      "Confirm Password must contain at least one uppercase letter."
    )
    .regex(
      /[a-z]/,
      "Confirm Password must contain at least one lowercase letter."
    )
    .regex(/[0-9]/, "Confirm Password must contain at least one number.")
    .regex(
      /[!@#$%^&*(),.?":{}|<>]/,
      "Password must contain at least one special character."
    ),
});

export default resetpasswordSchema;
