import { Prisma, Product } from "@prisma/client";
import { Request } from "express";
import { IFile } from "../../interfaces/file";
import { fileUploader, uploadMultipleFilesToCloudinary } from "../../helpers/fileUploader";
import prisma from "../../shared/prisma";
import ApiError from "../../error/ApiError";
import httpStatus from "http-status";
import { IPaginationOptions } from "../../interfaces/pagination";
import { paginationHelper } from "../../helpers/paginationHelper";

const createProduct = async (req: Request): Promise<Product> => {

    const files = req.files as IFile[];

    if (files && files.length > 0) {
        const uploadResults = await uploadMultipleFilesToCloudinary(files);

        // Extract the secure_url from each result and store them in req.body.images
        req.body.images = uploadResults.map(result => result.secure_url);
    }
    const isExist = await prisma.product.findFirst({
        where: {
            productName: req.body.productName
        }
    })
    if (isExist) {
        throw new ApiError(httpStatus.CONFLICT, 'Product alredy exist!!')
    }
    const result = await prisma.product.create({
        data: req.body
    })

    return result;
};

type IProductFilterRequest = {
    productName?: string | undefined;
    searchTerm?: string | undefined;
    brandId?: string | undefined;
    categoryId?: string | undefined;
}
const getAllFromDB = async (params: IProductFilterRequest, options: IPaginationOptions) => {
    const { page, limit, skip } = paginationHelper.calculatePagination(options);
    const { searchTerm, brandId, categoryId, ...filterData } = params;

    const andConditions: Prisma.ProductWhereInput[] = [];

    //console.log(filterData);
    if (searchTerm) {
        andConditions.push({
            OR: ['productName'].map(field => ({
                [field]: {
                    contains: searchTerm,
                    mode: 'insensitive'
                }
            }))
        })
    };

    if (Object.keys(filterData).length > 0) {
        andConditions.push({
            AND: Object.keys(filterData).map(key => ({
                [key]: {
                    equals: (filterData as any)[key],
                    mode: 'insensitive'
                }
            }))
        })
    };
    // Add brandId and categoryId filters if provided
    if (brandId) {
        andConditions.push({
            brandId: {
                equals: brandId
            }
        });
    }
    if (categoryId) {
        andConditions.push({
            categoryId: {
                equals: categoryId
            }
        });
    }

    //console.dir(andCondions, { depth: 'inifinity' })
    const whereConditons: Prisma.ProductWhereInput = { AND: andConditions }

    const result = await prisma.product.findMany({
        where: whereConditons,
        skip,
        take: limit,
        orderBy: options.sortBy && options.sortOrder ? {
            [options.sortBy]: options.sortOrder
        } : {
            createdAt: 'desc'
        }
    });

    const total = await prisma.product.count({
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
export const productService = {
    createProduct,
    getAllFromDB
}