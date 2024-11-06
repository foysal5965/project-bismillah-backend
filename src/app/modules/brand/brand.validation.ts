import { z } from "zod";
const brandCreateValidation= z.object({
    title: z.string({required_error:'category name required??'})
})
const updateBrandValidation= z.object({
    title: z.string().optional()
})

export const brandValidation={
    brandCreateValidation,
    updateBrandValidation
}