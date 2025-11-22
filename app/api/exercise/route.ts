import { inngest } from "@/app/inngest/client";
import { NextResponse } from "next/server";

// Question one

// export async function POST(req: Request) {
//     const {email} = await req.json();

//     const user = { email };

//     await inngest.send({
//         name: 'email/send',
//         data: user

//     })

//     return NextResponse.json({success: true, user});

    
// }

// Question two

// export async function POST(req: Request) {
//     const {users} = await req.json();

//     await inngest.send({
//         name: 'process/data',
//         data: {users}
//     });

//     return NextResponse.json({success: true, users});
// }

// Question three

// export async function POST(req: Request) {
//     const {url} = await req.json();

//     await inngest.send({
//         name: 'api/fetch',
//         data: {url}
//     });
//     return NextResponse.json({success: true, url});
// }

// Question four
// export async function POST(req: Request) {
//     const { email } = await req.json();

//     await inngest.send({
//         name: "data/validate",
//         data: { email }
//     });
//     return NextResponse.json({ success: true, email });
// }

// Question five
// export async function POST(req: Request) {
//     const { message, delayMinutes } = await req.json();
//     await inngest.send({
//         name: 'reminder/schedule',
//         data: { message, delayMinutes }
//     });
//     return NextResponse.json({ success: true, message, delayMinutes });
// }

