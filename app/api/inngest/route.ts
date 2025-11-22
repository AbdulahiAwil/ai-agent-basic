import { serve } from "inngest/next";
import { inngest } from "../../inngest/client";
import { apiFetcher, approvalWorkflow, batchProcessor, createUser, dailyReport, dataProcess, limitedConcurrecy, reminder, senderEmail, simpleGreet, validationFunction } from "@/app/inngest/functions";


export const { GET, POST, PUT} = serve({
    client: inngest,
    functions:[
        simpleGreet,
        dataProcess,
        senderEmail,
        approvalWorkflow,
        apiFetcher,
        validationFunction,
        reminder,
        // dailyReport,
        limitedConcurrecy,
        batchProcessor,
        createUser
    ]
})