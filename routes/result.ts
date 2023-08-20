import express, { Request, Response, response } from 'express';
import { PrismaClient, Prisma } from '@prisma/client';
import {  qData, qSchema } from '../model/results';
import { fromZodError } from "zod-validation-error"

const prisma = new PrismaClient();

export const userRouter = express.Router();

userRouter.post("/result", addResult);

// async function addResult(req: Request, res: Response) {
//     const data = qSchema.safeParse(req.body);

//     if (!data.success) {
//         let errMessage: string = fromZodError(data.error).message;
//         return res.status(400).json({
//             error: {
//                 message: errMessage,
//             },
//         });
//     }

//     try {
//         const resultData: qData = data.data;

//         if(!resultData){
//             return res.status(409).json({
//                 error: {
//                     message: "invalid params",
//                 },
//             });
//         }

//         const addedResult = await prisma.results.create({
//             data: {
//                 reg: resultData.reg,
//                 exam: resultData.exam,
//                 code: resultData.code,
//                 class: resultData.class,
//                 section: resultData.section,
//                 Q1: resultData.Q1,
//                 Q2: resultData.Q2,
//                 Q3: resultData.Q3,
//                 Q4: resultData.Q4,
//                 Q5: resultData.Q5,
//                 Q6: resultData.Q6,
//                 Q7: resultData.Q7,
//                 Q8: resultData.Q8,
//                 Q9: resultData.Q9,
//                 Q10: resultData.Q10,
//                 Q11: resultData.Q11,
//                 Q12: resultData.Q12,
//                 Q13: resultData.Q13,
//                 Q14: resultData.Q14,
//                 Q15: resultData.Q15,
//                 Q16: resultData.Q16,
//                 Q17: resultData.Q17,
//                 Q18: resultData.Q18,
//                 Q19: resultData.Q19,
//                 Q20: resultData.Q20,
//                 Q21: resultData.Q21,
//                 Q22: resultData.Q22,
//                 Q23: resultData.Q23,
//                 Q24: resultData.Q24,
//                 Q25: resultData.Q25,
//                 Q26: resultData.Q26,
//                 Q27: resultData.Q27,
//                 Q28: resultData.Q28,
//                 ASG: resultData.ASG,
//                 CO1: resultData.Q1 + resultData.Q2 + resultData.Q5 + resultData.Q6 + resultData.Q9 + resultData.Q10 + resultData.Q13 + resultData.Q14 + resultData.Q17 + resultData.Q18 ,
//                 CO2: resultData.Q3 + resultData.Q4 + resultData.Q7 + resultData.Q8 + resultData.Q11 + resultData.Q12 + resultData.Q15 + resultData.Q16 + resultData.Q19 + resultData.Q20 + resultData.Q21 ,
//                 CO3: resultData.Q22 + resultData.Q23 + resultData.Q26 ,
//                 CO4: resultData.Q24 + resultData.Q25 + resultData.Q27,
//                 CO5: resultData.Q28
//             },
//         });

//         res.status(201).json({
//             success: {
//                 message: "Result added successfully",
//             },
//         });
//     } catch (error) {
//         res.status(500).json({
//             error: {
//                 message: "Internal server error",
//             },
//         });
//     }
// }

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

        if (!resultData) {
            return res.status(409).json({
                error: {
                    message: "invalid params",
                },
            });
        }

        const existingResult = await prisma.results.findFirst({
            where: {
                reg: resultData.reg,
                exam: resultData.exam,
            },
        });

        if (existingResult) {
            return res.status(409).json({
                error: {
                    message: "Result already exists for the provided reg number and exam type",
                },
            });
        }

        const addedResult = await prisma.results.create({
            data: {
                reg: resultData.reg,
                exam: resultData.exam,
                code: resultData.code,
                class: resultData.class,
                section: resultData.section,
                Q1: resultData.Q1,
                Q2: resultData.Q2,
                Q3: resultData.Q3,
                Q4: resultData.Q4,
                Q5: resultData.Q5,
                Q6: resultData.Q6,
                Q7: resultData.Q7,
                Q8: resultData.Q8,
                Q9: resultData.Q9,
                Q10: resultData.Q10,
                Q11: resultData.Q11,
                Q12: resultData.Q12,
                Q13: resultData.Q13,
                Q14: resultData.Q14,
                Q15: resultData.Q15,
                Q16: resultData.Q16,
                Q17: resultData.Q17,
                Q18: resultData.Q18,
                Q19: resultData.Q19,
                Q20: resultData.Q20,
                Q21: resultData.Q21,
                Q22: resultData.Q22,
                Q23: resultData.Q23,
                Q24: resultData.Q24,
                Q25: resultData.Q25,
                Q26: resultData.Q26,
                Q27: resultData.Q27,
                Q28: resultData.Q28,
                ASG: resultData.ASG,
                CO1: resultData.Q1 + resultData.Q2 + resultData.Q5 + resultData.Q6 + resultData.Q9 + resultData.Q10 + resultData.Q13 + resultData.Q14 + resultData.Q17 + resultData.Q18 ,
                CO2: resultData.Q3 + resultData.Q4 + resultData.Q7 + resultData.Q8 + resultData.Q11 + resultData.Q12 + resultData.Q15 + resultData.Q16 + resultData.Q19 + resultData.Q20 + resultData.Q21 ,
                CO3: resultData.Q22 + resultData.Q23 + resultData.Q26 ,
                CO4: resultData.Q24 + resultData.Q25 + resultData.Q27,
                CO5: resultData.Q28
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
