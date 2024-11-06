import { Request, Response } from "express";
import catchAsync from "../../shared/catchAsync";
import { checkoutService } from "./checkout.service";
import { IAuthUser } from "../../interfaces/commont";
import sendResponse from "../../shared/sendResponse";
import httpStatus from "http-status";

const insertIntoDb = catchAsync(async (req: Request, res: Response) => {
    const result = await checkoutService.insertIntoDb(req.body, req.user as IAuthUser)

    sendResponse(res, {
        statusCode: httpStatus.OK,
        success: true,
        message: "checkout successfuly!",
        data: result
    })
})

export const checkoutController = {
    insertIntoDb
}