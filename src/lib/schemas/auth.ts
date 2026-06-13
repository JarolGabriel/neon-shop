import { z } from "zod";

export const signInSchema = z.object({
  email: z
    .string()
    .min(1, "Introduce tu correo electrónico")
    .email("Introduce un correo válido"),
  password: z.string().min(1, "Introduce tu contraseña"),
});

export const signUpSchema = z
  .object({
    first_name: z
      .string()
      .min(1, "Introduce tu nombre")
      .max(60, "Máximo 60 caracteres"),
    last_name: z
      .string()
      .min(1, "Introduce tu apellido")
      .max(60, "Máximo 60 caracteres"),
    email: z
      .string()
      .min(1, "Introduce tu correo electrónico")
      .email("Introduce un correo válido"),
    password: z
      .string()
      .min(6, "La contraseña debe tener al menos 6 caracteres")
      .max(72, "Máximo 72 caracteres"),
    confirm_password: z.string().min(1, "Confirma tu contraseña"),
  })
  .refine((data) => data.password === data.confirm_password, {
    message: "Las contraseñas no coinciden",
    path: ["confirm_password"],
  });

export type SignInInput = z.infer<typeof signInSchema>;
export type SignUpInput = z.infer<typeof signUpSchema>;

export const forgotPasswordSchema = z.object({
  email: z
    .string()
    .min(1, "Introduce tu correo electrónico")
    .email("Introduce un correo válido"),
});

export type ForgotPasswordInput = z.infer<typeof forgotPasswordSchema>;

export const resetPasswordSchema = z
  .object({
    password: z
      .string()
      .min(6, "La contraseña debe tener al menos 6 caracteres")
      .max(72, "Máximo 72 caracteres"),
    confirm_password: z.string().min(1, "Confirma tu contraseña"),
  })
  .refine((data) => data.password === data.confirm_password, {
    message: "Las contraseñas no coinciden",
    path: ["confirm_password"],
  });

export type ResetPasswordInput = z.infer<typeof resetPasswordSchema>;
