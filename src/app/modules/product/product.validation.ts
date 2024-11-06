import { z } from "zod";

// Define the zod schema for Product
const createProductSchema = z.object({
  productName: z.string().min(1, "Product name is required"),
  purchasePrize: z.number().positive("Purchase prize must be a positive number"),
  regularSalePrize: z.number().positive("Regular sale prize must be a positive number"),
  discount: z.number().min(0).max(100).optional(),  // Discount as a percentage, 0-100 range
  stockStatus: z.enum(["INSTOCK", "OUTOFSTOCK", "DISCONTINUED"]),  // Define possible stock statuses
  stockQuantity: z.number().int().nonnegative("Stock quantity cannot be negative"),
  details: z.string().min(1, "Product details are required"),
  categoryId: z.string().uuid("Invalid category ID"),
  brandId: z.string().uuid("Invalid brand ID"),
});

export const  productVallidation ={
createProductSchema
}
