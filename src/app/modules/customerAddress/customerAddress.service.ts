import { AddressType } from "@prisma/client"
import { IAuthUser } from "../../interfaces/commont"
import prisma from "../../shared/prisma"

const insertCustomerBillingAddress = async (payload: any, user: IAuthUser) => {
    const id = user?.userId as string
    const result = await prisma.address.create({
        data: {
            userId: id,
            addressType: AddressType.BILLING,
            streetAddress: payload.streetAddress,
            city: payload.city,
            state: payload.state,
            postalCode: payload.postalCode,
            country: payload.country,
            phoneNumber: payload.phoneNumber,
        }
    })
    return result
}

export const customerAddressService = {
    insertCustomerBillingAddress
}