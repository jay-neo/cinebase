import { z } from "zod";

export const EmailSchema = z.object({
	email: z
		.string()
		.trim()
		.toLowerCase()
		.email({ message: "Please enter a valid email." }),
});

export const RegisterSchema = EmailSchema.extend({
	name: z
		.string()
		.trim()
		.min(2, { message: "Name must be at least 2 characters long." })
		.max(40, { message: "Name must be at most 40 characters long." })
		.transform((val) => val.replace(/\s+/g, " "))
		.refine((val) => /^[A-Za-z]+(?: [A-Za-z]+)*$/.test(val), {
			message: "Name can only contain letters.",
		}),
	password: z
		.string()
		.trim()
		.min(8, { message: "Be at least 8 characters long" })
		.max(50, { message: "Password must be at most 50 characters long" })
		.regex(/[a-zA-Z]/, { message: "Contain at least one letter." })
		.regex(/[0-9]/, { message: "Contain at least one number." })
		.regex(/[^a-zA-Z0-9]/, {
			message: "Contain at least one special character.",
		})
		.refine((val) => !/[\\\x00-\x1F\x7F]/.test(val), {
			message:
				"Password cannot contain escape sequences or control characters.",
		}),
});

export const LoginSchema = EmailSchema.extend({
	password: z
		.string()
		.trim()
		.min(1, { message: "Password field must not be empty." })
		.refine((val) => !/[\\\x00-\x1F\x7F]/.test(val), {
			message:
				"Password cannot contain escape sequences or control characters.",
		}),
});

export const OTPVerifySchema = EmailSchema.extend({
	otp: z
		.string()
		.trim()
		.min(6, { message: "OTP must be at least 6 characters long." })
		.refine((val) => !/[\\\x00-\x1F\x7F]/.test(val), {
			message:
				"Password cannot contain escape sequences or control characters.",
		}),
});

export const OTPResendSchema = EmailSchema.extend({
	token: z
		.string()
		.trim()
		.refine((val) => !/[\\\x00-\x1F\x7F]/.test(val), {
			message:
				"Password cannot contain escape sequences or control characters.",
		}),
});

export const ResetPasswordSchema = OTPResendSchema.extend({
	password: z
		.string()
		.trim()
		.min(8, { message: "Be at least 8 characters long" })
		.max(50, { message: "Password must be at most 50 characters long" })
		.regex(/[a-zA-Z]/, { message: "Contain at least one letter." })
		.regex(/[0-9]/, { message: "Contain at least one number." })
		.regex(/[^a-zA-Z0-9]/, {
			message: "Contain at least one special character.",
		})
		.refine((val) => !/[\\\x00-\x1F\x7F]/.test(val), {
			message:
				"Password cannot contain escape sequences or control characters.",
		}),
});
