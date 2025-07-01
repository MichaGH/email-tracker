import { NextResponse } from "next/server";
import { serialize } from "cookie";
import cookieSignature from "cookie-signature";


export async function POST(request) {
    const { password } = await request.json();
    const SECRET = process.env.COOKIE_SECRET;

    console.log('password:', password)
    if( password === process.env.ADMIN_PASSWORD) {
        const signed = cookieSignature.sign('yes', process.env.COOKIE_SECRET);

        const cookie = serialize('auth', signed, {
            path: '/',
            httpOnly: true,
            maxAge: 60*60*24*7,
            sameSite: 'strict',
            secure: process.env.NODE_ENV === 'production',
        })
        
        const response = NextResponse.json({ success: true });
        response.headers.set('Set-Cookie', cookie);
        return response;
    } else {
        return NextResponse.json({ error: 'unauthorized', status: 401 })
    }
}