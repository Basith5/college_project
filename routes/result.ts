import express, { Request, Response, response } from 'express';
import { PrismaClient, Prisma } from '@prisma/client';
import {  qData, qSchema, updateCiaSchema, ciaData } from '../model/results';
import { fromZodError } from "zod-validation-error"
import { ZodNull, nullable } from 'zod';

const prisma = new PrismaClient();

export const userRouter = express.Router();

userRouter.post("/result", addResult);
userRouter.get("/result", getResult);
userRouter.post("/cia", updateAssignment);
userRouter.post("/total", getTotal)

//get all result
async function getResult(req: Request, res: Response) {
    try {
      const { reg, exam } = req.body;
  
      if (!reg || !exam) {
        return res.status(400).json({ error: 'Both "reg" and "exam" parameters are required.' });
      }
  
      const results = await prisma.results.findMany({
        where: {
          reg: reg,
          exam: exam,
        },
      });
  
      return res.json(results);
    } catch (error) {
      console.error('Error fetching results:', error);
      return res.status(500).json({ error: 'An error occurred while fetching results.' });
    }
  }

//add result
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
                code: resultData.code
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


//update the CIA
// async function updateAssignment(req: Request, res: Response) {
//     const data = updateCiaSchema.safeParse(req.body);

//     if (!data.success) {
//         let errMessage: string = fromZodError(data.error).message;
//         return res.status(400).json({
//             error: {
//                 message: errMessage,
//             },
//         });
//     }

//     try {
//         const ciaData: ciaData = data.data;

//         // Check if the assignment already exists
//         const existingAssignment = await prisma.results.findFirst({
//             where: {
//                 reg: ciaData.reg,
//                 exam: ciaData.exam,
//             },
//         });

//         if (existingAssignment) {
//             // Assignment already exists, update Q1 and Q2 values
//             const updatedFields: any = {
//                 Q1: ciaData.Q1 !== undefined ? ciaData.Q1 : existingAssignment.Q1,
//                 Q2: ciaData.Q2 !== undefined ? ciaData.Q2 : existingAssignment.Q2,
//                 CO1: (ciaData.Q1 || existingAssignment.Q1) * (5/3),
//                 CO2: (ciaData.Q2 || existingAssignment.Q2) * (5/3)
//             };

//             await prisma.results.update({
//                 where: {
//                     id: existingAssignment.id,
//                 },
//                 data: updatedFields,
//             });
//         } else {
//             await prisma.results.create({
//                 data: {
//                     reg: ciaData.reg,
//                     exam: ciaData.exam,
//                     code: ciaData.code,
//                     class: ciaData.class || "",
//                     section: ciaData.section || "",
//                     Q1: ciaData.Q1 || 0,
//                     Q2: ciaData.Q2 || 0,
//                     Q3: 0,
//                     Q4: 0,
//                     Q5: 0,
//                     Q6: 0,
//                     Q7: 0,
//                     Q8: 0,
//                     Q9: 0,
//                     Q10: 0,
//                     Q11: 0,
//                     Q12: 0,
//                     Q13: 0,
//                     Q14: 0,
//                     Q15: 0,
//                     Q16: 0,
//                     Q17: 0,
//                     Q18: 0,
//                     Q19: 0,
//                     Q20: 0,
//                     Q21: 0,
//                     Q22: 0,
//                     Q23: 0,
//                     Q24: 0,
//                     Q25: 0,
//                     Q26: 0,
//                     Q27: 0,
//                     Q28: 0,
//                     CO1: (ciaData.Q1 || 0) * (5/3),
//                     CO2: (ciaData.Q2 || 0) * (5/3),
//                     CO3: 0,
//                     CO4: 0,
//                     CO5: 0
//                 },
//             });
//         }

//         const check = await prisma.results.findFirst({
//             where : {
//                 reg: ciaData.reg,
//                 code: ciaData.code,
//                 exam: "total"
//             }
//         })

//         // if(check){
//         //     return response.json({
//         //         msg : "Total already exist for the this user"
//         //     })
//         // }

//         const total = await prisma.results.findMany({
//             where: {
//                 reg: ciaData.reg,
//                 code: ciaData.code,
//                 exam: {
//                     in: ["CIA-1", "CIA-2", "ASG"]
//                 }
//             }
//         });
    
//         const co1Sum = total.reduce((sum, row) => sum + row.CO1, 0);
//         const co2Sum = total.reduce((sum, row) => sum + row.CO2, 0);
//         const co3Sum = total.reduce((sum, row) => sum + row.CO3, 0);
//         const co4Sum = total.reduce((sum, row) => sum + row.CO4, 0);
//         const co5Sum = total.reduce((sum, row) => sum + row.CO5, 0);

//         const addTotal = await prisma.results.create({
//             data : {
//                 reg: ciaData.reg,
//                     exam: "total",
//                     code: ciaData.code,
//                     class: ciaData.class || "",
//                     section: ciaData.section || "",
//                     Q1: ciaData.Q1 || 0,
//                     Q2: ciaData.Q2 || 0,
//                     Q3: 0,
//                     Q4: 0,
//                     Q5: 0,
//                     Q6: 0,
//                     Q7: 0,
//                     Q8: 0,
//                     Q9: 0,
//                     Q10: 0,
//                     Q11: 0,
//                     Q12: 0,
//                     Q13: 0,
//                     Q14: 0,
//                     Q15: 0,
//                     Q16: 0,
//                     Q17: 0,
//                     Q18: 0,
//                     Q19: 0,
//                     Q20: 0,
//                     Q21: 0,
//                     Q22: 0,
//                     Q23: 0,
//                     Q24: 0,
//                     Q25: 0,
//                     Q26: 0,
//                     Q27: 0,
//                     Q28: 0,
//                     CO1: co1Sum,
//                     CO2: co2Sum,
//                     CO3: co3Sum,
//                     CO4: co4Sum,
//                     CO5: co5Sum
//             }
//         })
    
//         res.status(201).json({
//             success: {
//                 message: "Assignment added or updated successfully",
//                 co1Sum: co1Sum,
//                 co2Sum: co2Sum,
//                 co3Sum: co3Sum,
//                 co4Sum: co4Sum,
//                 co5Sum: co5Sum
//             },
//         });
//     } catch (error) {
//         console.error(error);
//         res.status(500).json({
//             error: {
//                 message: "Internal server error",
//             },
//         });
//     }
// }

async function updateAssignment(req: Request, res: Response) {
    const data = updateCiaSchema.safeParse(req.body);

    if (!data.success) {
        let errMessage: string = fromZodError(data.error).message;
        return res.status(400).json({
            error: {
                message: errMessage,
            },
        });
    }

    try {
        const ciaData: ciaData = data.data;

        // Check if the assignment already exists
        const existingAssignment = await prisma.results.findFirst({
            where: {
                reg: ciaData.reg,
                exam: ciaData.exam,
            },
        });

        if (existingAssignment) {
            // Assignment already exists, update Q1 and Q2 values
            const updatedFields: any = {
                Q1: ciaData.Q1 !== undefined ? ciaData.Q1 : existingAssignment.Q1,
                Q2: ciaData.Q2 !== undefined ? ciaData.Q2 : existingAssignment.Q2,
                CO1: (ciaData.Q1 || existingAssignment.Q1) * (5/3),
                CO2: (ciaData.Q2 || existingAssignment.Q2) * (5/3)
            };

            await prisma.results.update({
                where: {
                    id: existingAssignment.id,
                },
                data: updatedFields,
            });
        } else {
            await prisma.results.create({
                data: {
                    reg: ciaData.reg,
                    exam: ciaData.exam,
                    code: ciaData.code,
                    class: ciaData.class || "",
                    section: ciaData.section || "",
                    Q1: ciaData.Q1 || 0,
                    Q2: ciaData.Q2 || 0,
                    Q3: 0,
                    Q4: 0,
                    Q5: 0,
                    Q6: 0,
                    Q7: 0,
                    Q8: 0,
                    Q9: 0,
                    Q10: 0,
                    Q11: 0,
                    Q12: 0,
                    Q13: 0,
                    Q14: 0,
                    Q15: 0,
                    Q16: 0,
                    Q17: 0,
                    Q18: 0,
                    Q19: 0,
                    Q20: 0,
                    Q21: 0,
                    Q22: 0,
                    Q23: 0,
                    Q24: 0,
                    Q25: 0,
                    Q26: 0,
                    Q27: 0,
                    Q28: 0,
                    CO1: (ciaData.Q1 || 0) * (5/3),
                    CO2: (ciaData.Q2 || 0) * (5/3),
                    CO3: 0,
                    CO4: 0,
                    CO5: 0
                },
            });
        }

        const total = await prisma.results.findMany({
            where: {
                reg: ciaData.reg,
                code: ciaData.code,
                exam: {
                    in: ["CIA-1", "CIA-2", "ASG"]
                }
            }
        });
    
        const co1Sum = total.reduce((sum, row) => sum + row.CO1, 0);
        const co2Sum = total.reduce((sum, row) => sum + row.CO2, 0);
        const co3Sum = total.reduce((sum, row) => sum + row.CO3, 0);
        const co4Sum = total.reduce((sum, row) => sum + row.CO4, 0);
        const co5Sum = total.reduce((sum, row) => sum + row.CO5, 0);

        const check = await prisma.results.findFirst({
            where : {
                reg: ciaData.reg,
                code: ciaData.code,
                exam: "total"
            }
        });

        if (check) {
            // Update the existing total row
            await prisma.results.update({
                where: {
                    id: check.id,
                },
                data: {
                    CO1: co1Sum,
                    CO2: co2Sum,
                    CO3: co3Sum,
                    CO4: co4Sum,
                    CO5: co5Sum
                },
            });
        } else {
            // Create the total row
            await prisma.results.create({
                data: {
                    reg: ciaData.reg,
                    exam: "total",
                    code: ciaData.code,
                    class: ciaData.class || "",
                    section: ciaData.section || "",
                    Q1: ciaData.Q1 || 0,
                    Q2: ciaData.Q2 || 0,
                    Q3: 0,
                    Q4: 0,
                    Q5: 0,
                    Q6: 0,
                    Q7: 0,
                    Q8: 0,
                    Q9: 0,
                    Q10: 0,
                    Q11: 0,
                    Q12: 0,
                    Q13: 0,
                    Q14: 0,
                    Q15: 0,
                    Q16: 0,
                    Q17: 0,
                    Q18: 0,
                    Q19: 0,
                    Q20: 0,
                    Q21: 0,
                    Q22: 0,
                    Q23: 0,
                    Q24: 0,
                    Q25: 0,
                    Q26: 0,
                    Q27: 0,
                    Q28: 0,
                    CO1: co1Sum,
                    CO2: co2Sum,
                    CO3: co3Sum,
                    CO4: co4Sum,
                    CO5: co5Sum
                },
            });
        }
    
        res.status(201).json({
            success: {
                message: "Assignment added or updated successfully",
                co1Sum: co1Sum,
                co2Sum: co2Sum,
                co3Sum: co3Sum,
                co4Sum: co4Sum,
                co5Sum: co5Sum
            },
        });
    } catch (error) {
        console.error(error);
        res.status(500).json({
            error: {
                message: "Internal server error",
            },
        });
    }
}

//Get the total
async function getTotal(req: Request, res: Response) {
    const { reg, code } = req.body;

    if (!reg || !code) {
        return res.status(400).json({
            error: {
                message: "Both 'reg' and 'code' values are required.",
            },
        });
    }

    try {
        const totalExists = await prisma.results.findFirst({
            where: {
                reg,
                code,
                exam: "total",
            },
        });

        const total = await prisma.results.findMany({
            where: {
                reg,
                code,
                exam: {
                    in: ["CIA-1", "CIA-2", "ASG", "total"],
                },
            },
        });

        // Calculate above40 percentage only for "total" exam rows
        var above40PercentRows = total
            .filter(row => row.exam === "total")
            .filter(row => (row.CO1 / row.Q1) * 100 > 12);
        var above40PercentCount = above40PercentRows.length;

        res.status(200).json({
            success: {
                message: "Total calculated and added successfully",
                above40PercentCount,
                above40PercentRows,
            },
        });
    } catch (error) {
        console.error(error);
        res.status(500).json({
            error: {
                message: "Internal server error",
            },
        });
    }
}
