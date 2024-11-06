import { Checkout, Prisma } from "@prisma/client"
import { paginationHelper } from "../../helpers/paginationHelper"
import { IAuthUser } from "../../interfaces/commont"
import { IPaginationOptions } from "../../interfaces/pagination"
import prisma from "../../shared/prisma"
import { generateTrackingNumber } from "./checkout.utils"
import { SSLService } from "../SSL/ssl.service"

const insertIntoDb = async (payload: any, user: IAuthUser) => {
    const { paymentMethod } = payload
    const userData = await prisma.user.findFirstOrThrow({
        where: {
            id: user?.userId
        }
    })
    const coustomerData = await prisma.customer.findFirstOrThrow({
        where: {
            email: userData.email
        }
    })

    const userCartData = await prisma.cart.findFirstOrThrow({
        where: {
            userId: userData.id
        }
    })
    const userBillingAddress = await prisma.address.findFirstOrThrow({
        where: {
            userId: userData.id
        }
    })

    const trackingNumber = generateTrackingNumber()
    const totalAmount = userCartData.totalPrice + 60
    const checkoutData = {
        userId: userData.id,
        cartId: userCartData.id,
        totalAmount,
        billingAddressId: userBillingAddress.id,
        trackingNumber,

    }
    const today = new Date();
    const transactionId = "project-bismillah-" + today.getFullYear() + "-" + today.getMonth() + "-" + today.getDay() + "-" + today.getHours() + "-" + today.getMinutes();
    const initPaymentData = {
        amount: checkoutData.totalAmount,
        transactionId: transactionId,
        name: coustomerData.name,
        email: coustomerData.email,
        address: coustomerData.address,
        phoneNumber: coustomerData.contactNumber
    }
    const result = await prisma.$transaction(async (tx) => {
        await prisma.checkout.create({
            data: checkoutData
        })
        const orderData = await prisma.checkout.findFirstOrThrow({
            where: {
                cartId: userCartData.id
            }
        })
        if (paymentMethod === 'ONLINEPAYMENT') {
            await prisma.payment.create({
                data: {
                    orderId: orderData.id,
                    method: "ONLINEPAYMENT",
                    amount: checkoutData.totalAmount,
                    status: 'PENDING',
                    transactionId
                }
            })
            const result = await SSLService.initPayment(initPaymentData);

            return {
                paymentUrl: result.GatewayPageURL
            };
        }
        await prisma.payment.create({
            data: {
                orderId: orderData.id,
                method: "CASHONDELIVERY",
                amount: checkoutData.totalAmount,
                status: 'PENDING',
                transactionId
            }
        })
    })
    return result
}




const getAllFromDB = async (params: any, options: IPaginationOptions) => {
    const { page, limit, skip } = paginationHelper.calculatePagination(options);
    const { searchTerm, ...filterData } = params;

    const andCondions: Prisma.CheckoutWhereInput[] = [];

    //console.log(filterData);
    if (params.searchTerm) {
        andCondions.push({
            OR: ['totalAmount'].map(field => ({
                [field]: {
                    contains: params.searchTerm,
                    mode: 'insensitive'
                }
            }))
        })
    };

    if (Object.keys(filterData).length > 0) {
        andCondions.push({
            AND: Object.keys(filterData).map(key => ({
                [key]: {
                    equals: (filterData as any)[key],
                    mode: 'insensitive'
                }
            }))
        })
    };



    //console.dir(andCondions, { depth: 'inifinity' })
    const whereConditons: Prisma.CheckoutWhereInput = { AND: andCondions }

    const result = await prisma.checkout.findMany({
        where: whereConditons,
        skip,
        take: limit,
        orderBy: options.sortBy && options.sortOrder ? {
            [options.sortBy]: options.sortOrder
        } : {
            createdAt: 'desc'
        }
    });

    const total = await prisma.checkout.count({
        where: whereConditons
    });

    return {
        meta: {
            page,
            limit,
            total
        },
        data: result
    };
};

const getByIdFromDB = async (id: string): Promise<Checkout | null> => {
    const result = await prisma.checkout.findUnique({
        where: {
            id
        }
    })

    return result;
};

const getMyOrder = async (user: IAuthUser) => {
    const userData = await prisma.user.findFirstOrThrow({
        where: {
            id: user?.userId
        }
    })

    const result = await prisma.checkout.findFirstOrThrow({
        where: {
            userId: userData.id
        }
    })

    return result
}
export const checkoutService = {
    insertIntoDb,
    getAllFromDB,
    getByIdFromDB,
    getMyOrder
}