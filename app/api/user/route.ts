import { inngest } from '@/app/inngest/client';
import { NextResponse} from 'next/server';

export async function POST(req: Request) {
    const {usename, email} = await req.json();

    const user = {id: "user_123", usename, email};

    await inngest.send({
        name: 'user/create',
        data: user
    });

    return NextResponse.json({success: true, user});
}