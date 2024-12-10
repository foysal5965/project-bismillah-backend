import { Request, RequestHandler, Response } from "express";
import { userService } from "./user.service";
import catchAsync from "../../shared/catchAsync";
import sendResponse from "../../shared/sendResponse";
import httpStatus from "http-status";
import pick from "../../shared/pick";
import { userFilterableFields } from "./user.constant";
import { IAuthUser } from "../../interfaces/commont";

const createAdmin = catchAsync(async (req: Request, res: Response) => {

    const result = await userService.createAdmin(req);
    sendResponse(res, {
        statusCode: httpStatus.OK,
        success: true,
        message: "Admin Created successfuly!",
        data: result
    })
});
const createCustomer = catchAsync(async (req: Request, res: Response) => {
console.log(req.body,'data')
    const result = await userService.createCustomer(req);
    sendResponse(res, {
        statusCode: httpStatus.OK,
        success: true,
        message: "Customer Created successfuly!",
        data: result
    })
});
const createVendors = catchAsync(async (req: Request, res: Response) => {

    const result = await userService.createVendors(req);
    sendResponse(res, {
        statusCode: httpStatus.OK,
        success: true,
        message: "Vendor Created successfuly!",
        data: result
    })
});


const getAllFromDB = catchAsync(async (req: Request, res: Response) => {
    // console.log(req.query)
    const filters = pick(req.query, userFilterableFields);
    const options = pick(req.query, ['limit', 'page', 'sortBy', 'sortOrder'])

    const result = await userService.getAllFromDB(filters, options)

    sendResponse(res, {
        statusCode: httpStatus.OK,
        success: true,
        message: "Users data fetched!",
        meta: result.meta,
        data: result.data
    })
});
const getMyProfile = catchAsync(async (req: Request, res: Response) => {

    const user = req.user;

    const result = await userService.getMyProfile(user as IAuthUser);

    sendResponse(res, {
        statusCode: httpStatus.OK,
        success: true,
        message: "My profile data fetched!",
        data: result
    })
});


const updateMyProfie = catchAsync(async (req: Request, res: Response) => {

    const user = req.user;

    const result = await userService.updateMyProfie(user as IAuthUser, req);

    sendResponse(res, {
        statusCode: httpStatus.OK,
        success: true,
        message: "My profile updated!",
        data: result
    })
});
export const userController ={
    createAdmin,
    createCustomer,
    createVendors,
    getAllFromDB,
    getMyProfile,
    updateMyProfie
}