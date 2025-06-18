import { z } from "zod";

const forgotpasswordSchema = z.object({
  email: z
    .string()
    .nonempty("Email is required.")
    .email("Please Enter a valid email address."),
});

export default forgotpasswordSchema;
