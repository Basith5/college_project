import express, { Request, Response } from 'express';
import { PrismaClient, Prisma } from '@prisma/client';
import { detailsSchema, detailsData, qData, qSchema } from '../model/results';
import { fromZodError } from "zod-validation-error"

const prisma = new PrismaClient();

export const userRouter = express.Router();

userRouter.post("/add", addUser);
userRouter.post("/result", addResult);

async function addUser(req: Request, res: Response) {
    const data = detailsSchema.safeParse(req.body);

    if (!data.success) {
        let errMessage: string = fromZodError(data.error).message;
        return res.status(400).json({
            error: {
                message: errMessage,
            },
        });
    }

    try {
        const userDetails: detailsData = data.data;

        const addedDetails = await prisma.details.create({
            data: userDetails,
        });

        res.status(201).json({
            success: {
                message: "Succesfully added"
            }
        });
    } catch (error) {
        if (error instanceof Prisma.PrismaClientKnownRequestError) {
            if (error.code === 'P2002') {
                return res.status(409).json({
                    error: {
                        message: "These details already exist",
                    },
                });
            }
        }

        res.status(500).json({
            error: {
                message: "Internal server error",
            },
        });
    }
}

async function addResult(req: Request, res: Response) {
    const data = qSchema.safeParse(req.body);

    if (!data.success) {
        let errMessage: string = fromZodError(data.error).message;
        return res.status(400).json({
            error: {
                message: errMessage,
            },
        });
    }

    try {
        const resultData: qData = data.data;

        const existingDetails = await prisma.details.findUnique({
            where: {
                reg: resultData.reg,
            },
        });

        if (!existingDetails) {
            return res.status(404).json({
                error: {
                    message: "register number is not found",
                },
            });
        }

        const addedResult = await prisma.results.create({
            data: {
                reg: resultData.reg,
                Q1: resultData.Q1,
                Q2: resultData.Q2,
                Q3: resultData.Q3,
                Q4: resultData.Q4,
                Q5: resultData.Q5,
                Q6: resultData.Q6,
                Q7: resultData.Q7,
                Q8: resultData.Q8,
            },
        });

        res.status(201).json({
            success: {
                message: "Result added successfully",
            },
        });
    } catch (error) {
        res.status(500).json({
            error: {
                message: "Internal server error",
            },
        });
    }
}

