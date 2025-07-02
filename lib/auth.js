import { cookies } from 'next/headers';
import { unsign } from 'cookie-signature';

export async function validateAuth() {

    const cookieStore = await cookies();
    const cookie = cookieStore.get('auth');
    const cookieValue = cookie?.value;
    const valid = cookie && unsign(cookieValue, process.env.COOKIE_SECRET);

    console.log(!!valid);
    return !!valid
}