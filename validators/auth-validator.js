const { default: mongoose } = require("mongoose");
const { z } = require("zod");

const loginSchema = z.object({
    email: z
        .string({ required_error: "Email is required" })
        .trim()
        .email({ message: "Invalid email address" }),
    password: z
        .string({ required_error: "Password is required" })

});

const signupSchema = loginSchema.extend({
    username: z
        .string({ required_error: "Name is required" })
        .trim()
        .min(3, { message: "Name must be more than 3 characters" })
        .max(255, { message: "Name must not be more than 255 characters" }),
    phone: z
        .string({ required_error: "Phone number is required" })
        .trim()
        .min(10, { message: "Phone number must be 10 digits" })
        .max(12, { message: "Phone number must not be more than 12 digits" }),
    password: z
        .string({ required_error: "Password is required" })
        .min(7, { message: "Password should have atleast 8 characters" })
        .max(1024, { message: "Password can't be greater than 1024 characters" })
        .regex(/^(?=.*[A-Z])(?=.*\d)/, { message: "Password should consist of one uppercase and one number" }),
});

module.exports = { signupSchema, loginSchema };
