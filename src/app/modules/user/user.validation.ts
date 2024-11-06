import { UserRole, UserStatus } from "@prisma/client";
import { z } from "zod";

const createAdmin = z.object({
    password: z.string({
        required_error: "Password is required"
    }),
    admin: z.object({
        name: z.string({
            required_error: "Name is required!"
        }),
        email: z.string({
            required_error: "Email is required!"
        }),
        contactNumber: z.string({
            required_error: "Contact Number is required!"
        }),
        address: z.string({
            required_error: "Address is required!"
        })
    })
});
const createCustomer = z.object({
    password: z.string({
        required_error: "Password is required"
    }),
    customer: z.object({
        name: z.string({
            required_error: "Name is required!"
        }),
        email: z.string({
            required_error: "Email is required!"
        }),
        contactNumber: z.string({
            required_error: "Contact Number is required!"
        }),
        address: z.string({
            required_error: "Address is required!"
        })
    })
});
const createVendors = z.object({
    password: z.string({
        required_error: "Password is required"
    }),
    vendor: z.object({
        name: z.string({
            required_error: "Name is required!"
        }),
        email: z.string({
            required_error: "Email is required!"
        }),
        contactNumber: z.string({
            required_error: "Contact Number is required!"
        }),
        address: z.string({
            required_error: "Address is required!"
        })
    })
});





export const userValidation = {
    createAdmin,
    createCustomer,
    createVendors
}