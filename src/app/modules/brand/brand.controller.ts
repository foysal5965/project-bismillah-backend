import { Request, RequestHandler, Response } from "express";
import catchAsync from "../../shared/catchAsync";
import { brandService } from "./brand.service";
import sendResponse from "../../shared/sendResponse";
import httpStatus from "http-status";
import pick from "../../shared/pick";

const createBrand = catchAsync(async (req: Request, res: Response) => {

    const result = await brandService.createBrand(req);
    sendResponse(res, {
        statusCode: httpStatus.OK,
        success: true,
        message: "Brand Created successfuly!",
        data: result
    })
});

const getAllFromDB: RequestHandler = catchAsync(async (req: Request, res: Response) => {
    // console.log(req.query)
    const filters = pick(req.query, ['icon', 'searchTerm']);
    const options = pick(req.query, ['limit', 'page', 'sortBy', 'sortOrder'])
    console.log(options)
    const result = await brandService.getAllFromDB(filters, options)

    sendResponse(res, {
        statusCode: httpStatus.OK,
        success: true,
        message: "Brands category data fetched!",
        meta: result.meta,
        data: result.data
    })
})


const deleteFromDB = catchAsync(async (req: Request, res: Response) => {
    const { id } = req.params;

    const result = await brandService.deleteFromDB(id);
    sendResponse(res, {
        statusCode: httpStatus.OK,
        success: true,
        message: "Brand data deleted!",
        data: result
    })
})
const updateIntoDB = catchAsync(async (req: Request, res: Response) => {
    const { id } = req.params;

    const result = await brandService.updateIntoDB(id,req);
    sendResponse(res, {
        statusCode: httpStatus.OK,
        success: true,
        message: "Brand data updated!",
        data: result
    })
})
const getByIdFromDB = catchAsync(async (req: Request, res: Response) => {
    const { id } = req.params;

    const result = await brandService.getByIdFromDB(id);
    sendResponse(res, {
        statusCode: httpStatus.OK,
        success: true,
        message: "Brand data fetched",
        data: result
    })
})

export const brandController ={
    createBrand,
    getAllFromDB,
    deleteFromDB,
    updateIntoDB,
    getByIdFromDB
}