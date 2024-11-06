import { Request, Response } from "express";
import catchAsync from "../../shared/catchAsync";
import { customerAddressService } from "./customerAddress.service";
import { IAuthUser } from "../../interfaces/commont";
import sendResponse from "../../shared/sendResponse";
import httpStatus from "http-status";

const insertCustomerBillingAddress = catchAsync(async (req: Request, res: Response) => {
    const result = await customerAddressService.insertCustomerBillingAddress(req.body, req.user as IAuthUser)
    sendResponse(res, {
        statusCode: httpStatus.OK,
        success: true,
        message: "Address added successfuly!",
        data: result
    })
})
export const customerAddressController = {
    insertCustomerBillingAddress
}