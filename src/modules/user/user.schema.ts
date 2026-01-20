import { buildJsonSchemas } from 'fastify-zod';

import { z } from "zod";

const userCore = z.object({
  email: z.string().email({ message: "Please enter a valid email" }),
  name: z.string(),
});

export const createUserSchema = userCore.extend({
  password: z.string()
    .min(1, { message: "Password is required" })
    .min(8, { message: "Password must be longer than 8 characters" })
    .regex(/[^A-Za-z0-9]/, { message: "Password must have atleast one special character" }),
});

const createUserResponseSchema = userCore.extend({
  id: z.number(),
});

const loginSchema = z.object({
  email: z.string().email({ message: "Please enter a valid email." }),
  password: z.string(),
});

const loginResponseSchema = z.object({
  accessToken: z.string(),
});

export type CreateUserInput = z.infer<typeof createUserSchema>;
export type LoginInput = z.infer<typeof loginSchema>;


export const { schemas: userSchemas, $ref } = buildJsonSchemas({
    createUserSchema,
    createUserResponseSchema,
    loginSchema,
    loginResponseSchema,
} , {
    $id: "UserSchemas"
})

