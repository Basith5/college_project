import express, { Request, Response, response } from 'express';
import { PrismaClient, Prisma } from '@prisma/client';
import {  qData, qSchema, updateCiaSchema, ciaData, psoSchema, psoData } from '../model/results';
import { fromZodError } from "zod-validation-error"
import { ZodNull, nullable } from 'zod';

const prisma = new PrismaClient();

export const userRouter = express.Router();

userRouter.post("/result", addResult);
userRouter.get("/result", getResult);
userRouter.post("/cia", updateAssignment);
userRouter.post("/total", getTotal)
userRouter.post("/addPso", psoAdd)

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
                    Q1: 0,
                    Q2: 0,
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
                co5Sum: co5Sum,
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
    const { code } = req.body;

    if (!code) {
        return res.status(400).json({
            error: {
                message: "'code' values are required.",
            },
        });
    }

    try {
        const total = await prisma.results.findMany({
            where: {
                code,
                exam: "total",
            },
        });

        const count = await prisma.results.count({
            where: {
              code,
              exam: "total",
            },
          }); 

        if (total.length === 0) {
            return res.status(404).json({
                error: {
                    message: "No 'total' exam rows found for the given code.",
                },
            });
        }

        // Initialize counters for above40Percentage
        let above40CO1 = 0;
        let above40CO2 = 0;
        let above40CO3 = 0;
        let above40CO4 = 0;
        let above40CO5 = 0;

        total.forEach(row => {
            if (row.CO1 >= 12) {
                above40CO1 += 1;
            }
            if (row.CO2 >= 16) {
                above40CO2 += 1;
            }
            if (row.CO3 >= 14) {
                above40CO3 += 1;
            }
            if (row.CO4 >= 14) {
                above40CO4 += 1;
            }
            if (row.CO5 >= 8) {
                above40CO5 += 1;
            }
        });

        var percenatge = {
            CO1 : (above40CO1 / count) * 100,
            CO2 : (above40CO2 / count) * 100,
            CO3 : (above40CO3 / count) * 100,
            CO4 : (above40CO4 / count) * 100,
            CO5 : (above40CO5 / count) * 100,
        }

        var attainmentLevels = {
            CO1: percenatge.CO1 >= 75 ? 3 : percenatge.CO1 >= 60 ? 2 : percenatge.CO1 >= 40 ? 1 : 0,
            CO2: percenatge.CO2 >= 75 ? 3 : percenatge.CO2 >= 60 ? 2 : percenatge.CO2 >= 40 ? 1 : 0,
            CO3: percenatge.CO3 >= 75 ? 3 : percenatge.CO3 >= 60 ? 2 : percenatge.CO3 >= 40 ? 1 : 0,
            CO4: percenatge.CO4 >= 75 ? 3 : percenatge.CO4 >= 60 ? 2 : percenatge.CO4 >= 40 ? 1 : 0,
            CO5: percenatge.CO5 >= 75 ? 3 : percenatge.CO5 >= 60 ? 2 : percenatge.CO5 >= 40 ? 1 : 0,
        };

        const ESEtotal = await prisma.results.findMany({
            where: {
                code,
                exam: "ESE",
            },
        });

        const ESEcount = await prisma.results.count({
            where: {
              code,
              exam: "ESE",
            },
          });          

        if (ESEtotal.length === 0) {
            return res.status(404).json({
                error: {
                    message: "No 'total' exam rows found for the given code.",
                },
            });
        }

        // Initialize counters for above40Percentage
        let ESEabove40CO1 = 0;
        let ESEabove40CO2 = 0;
        let ESEabove40CO3 = 0;
        let ESEabove40CO4 = 0;
        let ESEabove40CO5 = 0;

        ESEtotal.forEach(row => {
            if (row.CO1 >= 5) {
                ESEabove40CO1 += 1;
            }
            if (row.CO2 >= 7) {
                ESEabove40CO2 += 1;
            }
            if (row.CO3 >= 7) {
                ESEabove40CO3 += 1;
            }
            if (row.CO4 >= 7) {
                ESEabove40CO4 += 1;
            }
            if (row.CO5 >= 4) {
                ESEabove40CO5 += 1;
            }
        });

        var ESEpercenatge = {
            CO1 : (ESEabove40CO1 / ESEcount) * 100,
            CO2 : (ESEabove40CO2 / ESEcount) * 100,
            CO3 : (ESEabove40CO3 / ESEcount) * 100,
            CO4 : (ESEabove40CO4 / ESEcount) * 100,
            CO5 : (ESEabove40CO5 / ESEcount) * 100,
        }

        var ESEattainmentLevels = {
            CO1: percenatge.CO1 >= 75 ? 3 : percenatge.CO1 >= 60 ? 2 : percenatge.CO1 >= 40 ? 1 : 0,
            CO2: percenatge.CO2 >= 75 ? 3 : percenatge.CO2 >= 60 ? 2 : percenatge.CO2 >= 40 ? 1 : 0,
            CO3: percenatge.CO3 >= 75 ? 3 : percenatge.CO3 >= 60 ? 2 : percenatge.CO3 >= 40 ? 1 : 0,
            CO4: percenatge.CO4 >= 75 ? 3 : percenatge.CO4 >= 60 ? 2 : percenatge.CO4 >= 40 ? 1 : 0,
            CO5: percenatge.CO5 >= 75 ? 3 : percenatge.CO5 >= 60 ? 2 : percenatge.CO5 >= 40 ? 1 : 0,
          };

          let overAll = {
            CO1 : (attainmentLevels.CO1 + ESEattainmentLevels.CO1) / 2 ,
            CO2 : (attainmentLevels.CO2 + ESEattainmentLevels.CO2) / 2 ,
            CO3 : (attainmentLevels.CO3 + ESEattainmentLevels.CO3) / 2 ,
            CO4 : (attainmentLevels.CO4 + ESEattainmentLevels.CO4) / 2 ,
            CO5 : (attainmentLevels.CO5 + ESEattainmentLevels.CO5) / 2 ,
          }

        let averageAttain = ( overAll.CO1 + overAll.CO2 + overAll.CO3 + overAll.CO4 + overAll.CO5 ) / 5

        let direct80 = (80 * averageAttain) / 100

        let PSO1 = await prisma.pso.findMany({
            where:{
                COS: "PSO1"
            }
        });

        let PSO2 = await prisma.pso.findMany({
            where:{
                COS: "PSO2"
            }
        });

        let PSO3 = await prisma.pso.findMany({
            where:{
                COS: "PSO3"
            }
        });

        let PSO4 = await prisma.pso.findMany({
            where:{
                COS: "PSO4"
            }
        });

        let PSO5 = await prisma.pso.findMany({
            where:{
                COS: "PSO5"
            }
        });

        let PSA = {
            PSO1: calculatePSA(overAll, PSO1),
            PSO2: calculatePSA(overAll, PSO2),
            PSO3: calculatePSA(overAll, PSO3),
            PSO4: calculatePSA(overAll, PSO4),
            PSO5: calculatePSA(overAll, PSO5),
        };
        
        function calculatePSA(overAll: { CO1: any; CO2: any; CO3: any; CO4: any; CO5: any; }, psoArray: { id: number; COS: string; CO1: number; CO2: number; CO3: number; CO4: number; CO5: number; }[]) {
            let total = 0;
            let divisor = 0;
        
            for (const psoItem of psoArray) {
                total +=
                    (overAll.CO1 * psoItem.CO1) +
                    (overAll.CO2 * psoItem.CO2) +
                    (overAll.CO3 * psoItem.CO3) +
                    (overAll.CO4 * psoItem.CO4) +
                    (overAll.CO5 * psoItem.CO5);
        
                divisor += psoItem.CO1 + psoItem.CO2 + psoItem.CO3 + psoItem.CO4 + psoItem.CO5;
            }
        
            const result = total / divisor;

            // Round the result to two decimal places
            const roundedResult = Number(result.toFixed(2));

            return roundedResult;
        }

        let meanPsa = ( PSA.PSO1 + PSA.PSO2 + PSA.PSO3 + PSA.PSO4 + PSA.PSO5 ) / 5


        res.status(200).json({
            success: {
                message: "Total calculated and added successfully",
                above40CO1,
                above40CO2,
                above40CO3,
                above40CO4,
                above40CO5,
                percenatge,
                attainmentLevels,
                ESEabove40CO1,
                ESEabove40CO2,
                ESEabove40CO3,
                ESEabove40CO4,
                ESEabove40CO5,
                ESEpercenatge,
                ESEattainmentLevels,
                overAll,
                averageAttain,
                direct80,
                PSA,
                meanPsa
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

//ADD PSO
async function psoAdd(req: Request, res: Response) {
    const data = psoSchema.safeParse(req.body);

    if (!data.success) {
        let errMessage: string = fromZodError(data.error).message;
        return res.status(400).json({
            error: {
                message: errMessage,
            },
        });
    }

    try{
        const psoData: psoData = data.data;

        if (!psoData) {
            return res.status(409).json({
                error: {
                    message: "invalid params",
                },
            });
        }

        let psoAdd = await prisma.pso.create({
            data : {
                COS: psoData.COS,
                CO1: psoData.CO1,
                CO2: psoData.CO2,
                CO3: psoData.CO3,
                CO4: psoData.CO4,
                CO5: psoData.CO5,
            }
        })

        return res.json({
            msg : "successfully added"
        })

    } catch (error) {
        console.error(error);
        res.status(500).json({
            error: {
                message: "Internal server error",
            },
        });
    }
}