import { Request, Response } from "express";
import catchAsync from "../../shared/catchAsync";
import { cartService } from "./cart.service";
import { IAuthUser } from "../../interfaces/commont";
import sendResponse from "../../shared/sendResponse";
import httpStatus from "http-status";

const createCartForUser = catchAsync(async (req: Request, res: Response) => {

    const result = await cartService.createCartForUser(req.user as IAuthUser)
    sendResponse(res, {
        statusCode: httpStatus.OK,
        success: true,
        message: "cart created successfuly!",
        data: result
    })
});
const addItemToCart = catchAsync(async (req: Request, res: Response) => {

    const result = await cartService.addItemToCart(req.body,req.user as IAuthUser)
    sendResponse(res, {
        statusCode: httpStatus.OK,
        success: true,
        message: "cart created successfuly!",
        data: result
    })
});
const removeItemFromCart = catchAsync(async (req: Request, res: Response) => {

    const result = await cartService.removeItemFromCart(req.body.productId,req.user as IAuthUser)
    sendResponse(res, {
        statusCode: httpStatus.OK,
        success: true,
        message: "product remove successfuly!",
        data: result
    })
});
const getAllFromDB = catchAsync(async(req: Request, res: Response)=>{
    const result = await cartService.getAllFromDB(req.user as IAuthUser)
    sendResponse(res, {
        statusCode: httpStatus.OK,
        success: true,
        message: "cart fetched successfuly!",
        data: result
    })
})
const getCartItems = catchAsync(async(req: Request, res: Response)=>{
    const result = await cartService.getCartItems(req.user as IAuthUser)
    sendResponse(res, {
        statusCode: httpStatus.OK,
        success: true,
        message: "cart items successfuly!",
        data: result
    })
})
export const cartController= {
    createCartForUser,
    addItemToCart,
    removeItemFromCart,
    getAllFromDB,
    getCartItems
}