import { UserStatus } from "@prisma/client";
import prisma from "../../shared/prisma";
import bcrypt from 'bcrypt'
import { jwtHelpers } from "../../helpers/jwrHelpers";
import config from "../../config";
import { Secret } from "jsonwebtoken";
import emailSender from "./emailSender";
import ApiError from "../../error/ApiError";
import httpStatus from "http-status";

const loginUser = async (payload: {
    email: string,
    password: string
}) => {

    const userData = await prisma.user.findUnique({
        where: {
            email: payload.email,
            status: UserStatus.ACTIVE
        }
    });
    if (!userData) {
        throw new Error("User not found or inactive");
    }

    if (!userData.password) {
        throw new Error("Account has no password set");
    }
    const isCorrectPassword = await bcrypt.compare(payload.password, userData.password);
    if (!isCorrectPassword) {
        throw new Error("Password incorrect!")
    }
    const accessToken = jwtHelpers.generateToken({
        email: userData.email,
        role: userData.role,
        userId: userData.id
    },
        config.jwt.jwt_secret as Secret,
        config.jwt.expires_in as string
    );

    const refreshToken = jwtHelpers.generateToken({
        email: userData.email,
        role: userData.role,
        userId: userData.id
    },
        config.jwt.refresh_token_secret as Secret,
        config.jwt.refresh_token_expires_in as string
    );

    return {
        accessToken,
        refreshToken,
        needPasswordChange: userData.needPasswordChange
    };
};

const refreshToken = async (token: string) => {
    let decodedData;
    try {
        decodedData = jwtHelpers.verifyToken(token, config.jwt.refresh_token_secret as Secret);
    }
    catch (err) {
        throw new Error("You are not authorized!")
    }

    const userData = await prisma.user.findUniqueOrThrow({
        where: {
            email: decodedData.email,
            status: UserStatus.ACTIVE
        }
    });

    const accessToken = jwtHelpers.generateToken({
        email: userData.email,
        role: userData.role,
        userId: userData.id
    },
        config.jwt.jwt_secret as Secret,
        config.jwt.expires_in as string
    );

    return {
        accessToken,
        needPasswordChange: userData.needPasswordChange
    };

};



const changePassword = async (user: any, payload: any) => {
    const userData = await prisma.user.findUniqueOrThrow({
        where: {
            email: user.email,
            status: UserStatus.ACTIVE
        }
    });

    const isCorrectPassword: boolean = await bcrypt.compare(payload.oldPassword, userData.password);

    if (!isCorrectPassword) {
        throw new Error("Current password is incorrect!")
    }

    const hashedPassword: string = await bcrypt.hash(payload.newPassword, 12);

    await prisma.user.update({
        where: {
            email: userData.email
        },
        data: {
            password: hashedPassword,
            needPasswordChange: false
        }
    })

    return {
        message: "Password changed successfully!"
    }
};



const forgotPassword = async (payload: { email: string }) => {
    const userData = await prisma.user.findUniqueOrThrow({
        where: {
            email: payload.email,
            status: UserStatus.ACTIVE
        }
    });

    const resetPassToken = jwtHelpers.generateToken(
        { email: userData.email, role: userData.role, userId: userData.id },
        config.jwt.reset_pass_secret as Secret,
        config.jwt.reset_pass_token_expires_in as string
    )
    //console.log(resetPassToken)

    const resetPassLink = config.reset_pass_link + `?userId=${userData.id}&token=${resetPassToken}`

    await emailSender(
        userData.email,
        `
       <div style="font-family: Arial, sans-serif; line-height: 1.5; color: #333;">
    <p>Dear User,</p>
    <p>Your password reset link is below:</p>
    <a href="${resetPassLink}" style="text-decoration: none;">
        <button style="
            background: linear-gradient(45deg, #4CAF50, #81C784);
            color: white;
            padding: 10px 20px;
            border: none;
            border-radius: 5px;
            cursor: pointer;
            font-size: 16px;
            font-weight: bold;
        ">
            Reset Password
        </button>
    </a>
    <p>If you did not request this, please ignore this email.</p>
    <p>Thank you,<br>Your Company Team</p>
</div>

        `
    )
};


const resetPassword = async (token: string, payload: { id: string, password: string ,token:string}) => {
    

    const userData = await prisma.user.findUniqueOrThrow({
        where: {
            id: payload.id,
            status: UserStatus.ACTIVE
        }
    });

    const isValidToken = jwtHelpers.verifyToken(payload.token, config.jwt.reset_pass_secret as Secret)

    if (!isValidToken) {
        throw new ApiError(httpStatus.FORBIDDEN, "Forbidden!")
    }

    // hash password
    const password = await bcrypt.hash(payload.password, 12);

    // update into database
    await prisma.user.update({
        where: {
            id: payload.id
        },
        data: {
            password
        }
    })
};
export const authService = {
    loginUser,
    refreshToken,
    changePassword,
    forgotPassword,
    resetPassword
}