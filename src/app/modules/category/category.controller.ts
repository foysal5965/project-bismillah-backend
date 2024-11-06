import { Request, RequestHandler, Response } from "express";
import catchAsync from "../../shared/catchAsync";
import { productCategoryService } from "./category.service";
import sendResponse from "../../shared/sendResponse";
import httpStatus from "http-status";
import pick from "../../shared/pick";

const createCategory = catchAsync(async (req: Request, res: Response) => {

    const result = await productCategoryService.createCategory(req);
    sendResponse(res, {
        statusCode: httpStatus.OK,
        success: true,
        message: "Category Created successfuly!",
        data: result
    })
});

const getAllFromDB: RequestHandler = catchAsync(async (req: Request, res: Response) => {
    // console.log(req.query)
    const filters = pick(req.query, ['icon', 'searchTerm']);
    const options = pick(req.query, ['limit', 'page', 'sortBy', 'sortOrder'])
    console.log(options)
    const result = await productCategoryService.getAllFromDB(filters, options)

    sendResponse(res, {
        statusCode: httpStatus.OK,
        success: true,
        message: "Course category data fetched!",
        meta: result.meta,
        data: result.data
    })
})


const deleteFromDB = catchAsync(async (req: Request, res: Response) => {
    const { id } = req.params;

    const result = await productCategoryService.deleteFromDB(id);
    sendResponse(res, {
        statusCode: httpStatus.OK,
        success: true,
        message: "Course category data deleted!",
        data: result
    })
})
const updateIntoDB = catchAsync(async (req: Request, res: Response) => {
    const { id } = req.params;

    const result = await productCategoryService.updateIntoDB(id,req);
    sendResponse(res, {
        statusCode: httpStatus.OK,
        success: true,
        message: "Course category updated!",
        data: result
    })
})
const getByIdFromDB = catchAsync(async (req: Request, res: Response) => {
    const { id } = req.params;

    const result = await productCategoryService.getByIdFromDB(id);
    sendResponse(res, {
        statusCode: httpStatus.OK,
        success: true,
        message: "Course category updated!",
        data: result
    })
})

export const productCategoryController ={
    createCategory,
    getAllFromDB,
    deleteFromDB,
    updateIntoDB,
    getByIdFromDB
}