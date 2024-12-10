import { Request, RequestHandler, Response } from "express";
import catchAsync from "../../shared/catchAsync";
import sendResponse from "../../shared/sendResponse";
import httpStatus from "http-status";
import pick from "../../shared/pick";
import { productService } from "./product.service";

const createProduct = catchAsync(async (req: Request, res: Response) => {

    const result = await productService.createProduct(req);
    sendResponse(res, {
        statusCode: httpStatus.OK,
        success: true,
        message: "Product Created successfuly!",
        data: result
    })
});

const getAllFromDB: RequestHandler = catchAsync(async (req: Request, res: Response) => {
    // console.log(req.query)
    const filters = pick(req.query, ['productName', 'categoryId', 'brandId', 'searchTerm']);
    const options = pick(req.query, ['limit', 'page', 'sortBy', 'sortOrder'])
    console.log(options)
    const result = await productService.getAllFromDB(filters, options)

    sendResponse(res, {
        statusCode: httpStatus.OK,
        success: true,
        message: "product data fetched!",
        meta: result.meta,
        data: result.data
    })
})


// const deleteFromDB = catchAsync(async (req: Request, res: Response) => {
//     const { id } = req.params;

//     const result = await productCategoryService.deleteFromDB(id);
//     sendResponse(res, {
//         statusCode: httpStatus.OK,
//         success: true,
//         message: "Course category data deleted!",
//         data: result
//     })
// })
// const updateIntoDB = catchAsync(async (req: Request, res: Response) => {
//     const { id } = req.params;

//     const result = await productCategoryService.updateIntoDB(id,req);
//     sendResponse(res, {
//         statusCode: httpStatus.OK,
//         success: true,
//         message: "Course category updated!",
//         data: result
//     })
// })
// const getByIdFromDB = catchAsync(async (req: Request, res: Response) => {
//     const { id } = req.params;

//     const result = await productCategoryService.getByIdFromDB(id);
//     sendResponse(res, {
//         statusCode: httpStatus.OK,
//         success: true,
//         message: "Course category updated!",
//         data: result
//     })
// })

const getByIdFromDB = catchAsync(async (req: Request, res: Response) => {
    const { id } = req.params;

    const result = await productService.getByIdFromDB(id);
    sendResponse(res, {
        statusCode: httpStatus.OK,
        success: true,
        message: "Product data fetched",
        data: result
    })
})
export const productController ={
    createProduct,
    getAllFromDB,
    // deleteFromDB,
    // updateIntoDB,
    getByIdFromDB
}