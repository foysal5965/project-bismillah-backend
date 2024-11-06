import httpStatus from "http-status";
import ApiError from "../../error/ApiError";
import { IAuthUser } from "../../interfaces/commont";
import prisma from "../../shared/prisma";

const createCartForUser = async (user: IAuthUser) => {

    const isUserExist = await prisma.user.findFirst({
        where: {
            id: user?.userId
        }
    })
    if (!isUserExist) {
        throw new ApiError(httpStatus.NOT_FOUND, 'user not found')
    }
    const isCartAlreadyExist = await prisma.cart.findFirst({
        where: {
            userId: isUserExist?.id
        }
    })
    if (isCartAlreadyExist) {
        throw new ApiError(httpStatus.CONFLICT, 'cart alreadt exist')
    }
    //@ts-ignore
    const userId = isUserExist?.id
    const cart = await prisma.cart.create({
        data: {
            userId,
            totalQuantity: 0,
            totalPrice: 0.0
        }
    });
    return cart;
}



const addItemToCart = async (payload: any, user: IAuthUser) => {
    const { productId, quantity } = payload
    const productData = await prisma.product.findFirstOrThrow({
        where: {
            id: productId
        }
    })
    const originalPrice = productData.regularSalePrize;
    const discount = productData.discount;
    const newPrice = discount ? originalPrice * (1 - discount / 100) : originalPrice;
    // console.log(newPrice,'data')
    const userCart = await prisma.cart.findFirstOrThrow({
        where: {
            userId: user?.userId
        }
    })
    // Check if item already exists in the cart
    const cartId = userCart?.id
    const existingItem = await prisma.cartItem.findFirst({
        where: { cartId, productId }
    });

    if (existingItem) {
        // Update quantity and subtotal if item exists
        const updatedQuantity = existingItem.quantity + quantity;
        const updatedSubTotal = updatedQuantity * newPrice;

        await prisma.cartItem.update({
            where: { id: existingItem.id },
            data: {
                quantity: updatedQuantity,
                subTotal: updatedSubTotal
            }
        });
    } else {
        // Add new item if it doesn't exist in the cart
        await prisma.cartItem.create({
            data: {
                cartId,
                productId,
                quantity,
                price: newPrice,
                subTotal: quantity * newPrice
            }
        });
    }

    // Update cart totals
    await updateCartTotals(cartId);
}


async function updateCartTotals(cartId: string) {
    const cartItems = await prisma.cartItem.findMany({
        where: { cartId }
    });

    const totalQuantity = cartItems.reduce((sum, item) => sum + item.quantity, 0);
    const totalPrice = cartItems.reduce((sum, item) => sum + item.subTotal, 0);

    await prisma.cart.update({
        where: { id: cartId },
        data: {
            totalQuantity,
            totalPrice
        }
    });
}




const removeItemFromCart = async (productId: string, user: IAuthUser) => {
    const userCart = await prisma.cart.findFirstOrThrow({
        where: {
            userId: user?.userId
        }
    })
    // Check if item already exists in the cart
    const cartId = userCart?.id
    await prisma.cartItem.deleteMany({
        where: { cartId, productId }
    });

    // Update cart totals after removing the item
    await updateCartTotals(cartId);
}

export const cartService = {
    createCartForUser,
    addItemToCart,
    removeItemFromCart
}