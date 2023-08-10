import { z } from "zod"

export const detailsSchema = z.object({
    code: z.string({required_error: "Course code is required", }),
    reg: z.string({required_error: "Register Number is required", }),
    class: z.string({required_error: "Class is required", }),
    section: z.string({required_error: "Section is required", }),
    exam: z.string({required_error: "Exam type is required", }),
})

export const qSchema = z.object({
    reg: z.string({required_error: "Register Number is required", }),
    Q1: z.number({required_error: "Q1 is required", }),
    Q2: z.number({required_error: "Q2 is required", }),
    Q3: z.number({required_error: "Q3 is required", }),
    Q4: z.number({required_error: "Q4 is required", }),
    Q5: z.number({required_error: "Q5 is required", }),
    Q6: z.number({required_error: "Q6 is required", }),
    Q7: z.number({required_error: "Q7 is required", }),
    Q8: z.number({required_error: "Q8 is required", }),
})

export type detailsData = z.infer<typeof detailsSchema>
export type qData = z.infer<typeof qSchema>