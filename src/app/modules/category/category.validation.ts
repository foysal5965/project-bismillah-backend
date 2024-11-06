import { z } from "zod";
const createCategoryValidation= z.object({
    title: z.string({required_error:'category name required??'})
})
const updateCategoryValidation= z.object({
    title: z.string().optional()
})

export const productCategoryValidation={
    createCategoryValidation,
    updateCategoryValidation
}