import { timeStamp } from "console";
import { inngest } from "./client";
import { NonRetriableError } from "inngest";

export const simpleGreet = inngest.createFunction(
    {id: 'simple-greeter'},
    {event: 'greet/user'},
    async ({event, step}) => {
        const result = await step.run('Say Hello', async () => {
            return `Hello, ${event.data.name}, ${event.data.phone}`;
        })
        return result;
    }
)

export const dataProcess = inngest.createFunction(
    {id: 'data-processor'},
    {event: 'process/data'},
    async ({event, step}) => {

        const users = event.data.users;
        const rawData = await step.run('Fetch Raw Data', async () => {
            await new Promise((resolve) => setTimeout(resolve, 1000)); // Simulate delay
            return {users};
        })

        // Transform data
        const processedData = await step.run('Process Data', async () => {
            return rawData.users.map((user: string) => user.toUpperCase());
        })

        // save or send processed data
        const saveData = await step.run('Save Processed Data', async () => {
            console.log('Saving data');
            return processedData
        })

        await new Promise((resolve) => setTimeout(resolve, 2000)); // Simulate delay
        return saveData;
    }
)

export const senderEmail = inngest.createFunction(
    {id: 'send-email'},
    {event: 'email/send'},
    async ({event, step}) => {
        const { emails }= event.data;
        const results = []

        for(const email of emails){
            const result = await step.run('send-email', async () => {
                console.log(`Sending email to ${email}`);
                await new Promise((resolve) => setTimeout(resolve, 1000));
                return {email, status : 'sent', timeStamp: new Date().toISOString()};
            });
            results.push(result);

            if(email !== emails[emails.length -1]){
                await step.sleep('wait for next email', "2s");
            }
        }
    }
)

export const approvalWorkflow = inngest.createFunction(
    {id: 'approval-workflow'},
    {event: 'workflow/start'},
    async ({event, step}) => {

        const { requestId, action } = event.data;
        // Process data
        const processed = await step.run('process-request', async () => {
            console.log('Processing request data');
            return {requestId, action, status: 'apending approval' }
        })

        // wait for approval
        const approval = await step.waitForEvent('wait for approval', {
            event: 'workflow/approval',
            timeout: '1m',
            match: 'data.requestId'
        })
        if(!approval){
            return {
                requestId,
                status: 'approval timed out',
                message: 'No approval received within the time limit'
            }
        }

        // Finalize based on approval
        const result = await step.run('updating request status', async () => {
            return {
                requestId,
                status: 'approval-data-status',
                message: 'Request approved and finalized'
            }
        })
        return result;
    }

)

export const apiFetcher = inngest.createFunction(
    {id: 'api-fetcher', retries: 0},
    {event: 'api/fetch'},
    async ({event, step}) => {
        const { url } = event.data;
        const data = await step.run('fetch-api-data', async () =>{
            console.log(`Fetching data from ${url}`);

            if(Math.random() > 0.3){
                throw new Error('Random API fetch failure');
            }
            return {url, data: "success"}
        })
        return data;
    }
)

export const validationFunction = inngest.createFunction(
    {id: "validation"},
    {event: "data/validate"},

    async ({event, step}) => {
        const {email} = event.data;

        const isValid = await step.run('validate-email', async () => {

            if(!email.includes('@')){
                throw new NonRetriableError('Invalid email format');
            }
            return {email, valid: true}
        })
        return isValid;
    }
)

export const reminder = inngest.createFunction(
    {id: 'reminder'},
    {event: 'reminder/schedule'},
    async ({event, step}) => {
        const {message, delayMinutes} = event.data;

        await step.sleep('wait-before-reminder', `${delayMinutes}m`);
        const send = await step.run('send-reminder', async () => {

            return {
                message,
                sentAt: new Date().toISOString(),
                originalDelay: `${delayMinutes} minutes`
            }
        })
        return send;
    }
)

export const dailyReport = inngest.createFunction(
    {id: 'daily-report'},
    {cron: '*/1 * * * * '},
    async ({step}) => {
        const report = await step.run('generate-report', async () => {
            
            return {
                report: "Daily report generated",
                
            }
        })
        return report;
    }
)

export const limitedConcurrecy = inngest.createFunction(
    {id: 'limited-concurrency', concurrency: 2},
    {event: 'task/start'},
    async ({event, step}) => {
        const {items} = event.data;
        const results = await Promise.all(
              items.map((item: string) =>
                step.run(`process-item-${item}`, async () => {

                    await new Promise((resolve) => setTimeout(resolve, 10000));

                    return {item, status: 'processed', timeStamp: new Date().toISOString()}
                    

                })
        )
    )
        return {processedItems: results.length, results};
       
    }    
)

export const batchProcessor = inngest.createFunction(
  { id: "batch-processor" },
  { event: "batch/process" },
  async ({ event, step }) => {
    const { items } = event.data;

    console.log(`Processing ${items.length} items...`);

    // Process each item (queued automatically)
    const results = await Promise.all(
      items.map((item: string, index: number) =>
        step.run(`process-item-${index}`, async () => {
          console.log(`Processing item: ${item}`);
          await new Promise(resolve => setTimeout(resolve, 10000));
          return { item, processed: true, timestamp: new Date().toISOString() };
        })
      )
    );

    return { processed: results.length, results };
  }
);

export const createUser = inngest.createFunction(
    {id: 'create-user'},
    {event: 'user/create'},
    async ({event, step}) => {
        const {username, email} = event.data;
        const user = await step.run('send-welcome-email', async () => {

            await new Promise((resolve) => setTimeout(resolve, 1000));
            return {
                username,
                email
            }
        })
        return user;
    }
)
