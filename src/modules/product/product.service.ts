import { equal } from "node:assert";
import { prisma } from "../../utils/prisma";
import { CreateProductInput } from "./product.schema";

export async function createProduct(data : CreateProductInput & { ownerId : number}){
    return await prisma.product.create({
        data,
    });
}


export async function getProducts(){
    return await prisma.product.findMany({
        select: {
            title: true,
            content: true,
            price: true,
            createdAt: true,
            updatedAt: true,
            id: true,
            owner: {
                select: {
                    id: true,
                    name: true
                }
            }
        }
    })
}

export async function getProductById(productId : number){
    return await prisma.product.findUnique({
        where: {
            id: productId
        },
        select: {
            title: true,
            content: true,
            price: true,
            id: true,
            createdAt: true,
            updatedAt: true,
            owner: {
                select: {
                    id: true,
                    name: true
                }
            }
        }
    })
}

export async function getProductsByOwnerId(ownerId : number){
    return await prisma.product.findMany({
        where: {
            owner: {
                id: ownerId
            }
        },
        select: {
            title: true,
            content: true,
            price: true,
            id: true,
            createdAt: true,
            updatedAt: true,
            owner: {
                select: {
                    id: true,
                    name: true
                }
            }
        }
    })
}