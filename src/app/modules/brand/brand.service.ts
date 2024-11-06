import { Brand, Prisma, ProductCategory } from "@prisma/client";
import { IFile } from "../../interfaces/file";
import { fileUploader } from "../../helpers/fileUploader";
import { Request } from "express";
import prisma from "../../shared/prisma";
import ApiError from "../../error/ApiError";
import httpStatus from "http-status";
import { IPaginationOptions } from "../../interfaces/pagination";
import { paginationHelper } from "../../helpers/paginationHelper";

const createBrand = async (req: Request): Promise<Brand> => {

    const file = req.file as IFile;

    if (file) {
        const uploadToCloudinary = await fileUploader.uploadToCloudinary(file);
        req.body.icon = uploadToCloudinary?.secure_url
    }
    const isExist = await prisma.brand.findFirst({
        where: {
            title: req.body.title
        }
    })
    if (isExist) {
        throw new ApiError(httpStatus.CONFLICT, 'This brand already exist!!')
    }
    const result = await prisma.$transaction(async (transactionClient) => {


        const createdAdminData = await transactionClient.brand.create({
            data: req.body
        });

        return createdAdminData;
    });

    return result;
};


type IBrandFilterRequest = {
    title?: string | undefined;
    searchTerm?: string | undefined;
}
const getAllFromDB = async (params: IBrandFilterRequest, options: IPaginationOptions) => {
    const { page, limit, skip } = paginationHelper.calculatePagination(options);
    const { searchTerm, ...filterData } = params;

    const andCondions: Prisma.BrandWhereInput[] = [];

    //console.log(filterData);
    if (params.searchTerm) {
        andCondions.push({
            OR: ['title'].map(field => ({
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
    const whereConditons: Prisma.BrandWhereInput = { AND: andCondions }

    const result = await prisma.brand.findMany({
        where: whereConditons,
        skip,
        take: limit,
        orderBy: options.sortBy && options.sortOrder ? {
            [options.sortBy]: options.sortOrder
        } : {
            createdAt: 'desc'
        }
    });

    const total = await prisma.brand.count({
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


const deleteFromDB = async(id:string)=>{
    const result = await prisma.brand.delete({
        where:{
            id
        }
    })
    return result
}


const getByIdFromDB = async (id: string): Promise<ProductCategory | null> => {
    const result = await prisma.brand.findUnique({
        where: {
            id
        }
    })

    return result;
};


const updateIntoDB = async (id:string, req: Request) => {
    const data = await prisma.brand.findUniqueOrThrow({
        where: {
            id
        }
    });
    const file = req.file as IFile;
    if (file) {
        const uploadToCloudinary = await fileUploader.uploadToCloudinary(file);
        if(!Array.isArray(uploadToCloudinary)){
            req.body.icon = uploadToCloudinary?.secure_url
        }
    }
    const result = await prisma.brand.update({
        where:{
            id: data.id
        },
        data:req.body
    })
    return result
    
};


export const brandService = {
    createBrand,
    getAllFromDB,
    deleteFromDB,
    updateIntoDB,
    getByIdFromDB
}