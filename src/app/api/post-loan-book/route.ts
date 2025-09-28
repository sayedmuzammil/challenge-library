import axios, { AxiosError } from 'axios';
import { NextRequest, NextResponse } from 'next/server';
import { apiEndpoints } from '../endpoints';

export async function POST(request: NextRequest) {
  try {
    // const body = (await request.json()) as { bookId: number; days: number };

    const body = await request.json();
    // const { bookId, days } = body;

    if (!body?.bookId || !body?.days) {
      return NextResponse.json(
        { error: 'bookId and days are required' },
        { status: 400 }
      );
    }
    console.log('DEBUG incoming auth header:', body);

    const apiUrl = `${process.env.NEXT_PUBLIC_BASE_API_URL}${apiEndpoints.postLoanBook}`;
    console.log('DEBUG incoming auth header:', apiUrl);

    // 🔑 forward the client’s token
    const auth = request.headers.get('authorization') ?? '';

    // 👇 debug log BEFORE the axios call
    console.log('DEBUG incoming auth header:', auth);

    const { data, status } = await axios.post(apiUrl, body, {
      headers: {
        'Content-Type': 'application/json',
        accept: '*/*',
        ...(auth ? { Authorization: auth } : {}),
      },
    });

    return NextResponse.json(data, { status });
  } catch (error: unknown) {
    if (axios.isAxiosError(error)) {
      const err = error as AxiosError;
      const status = err.response?.status ?? 500;
      const payload = err.response?.data ?? { error: 'Internal Server Error' };
      console.error('Failed to post loan:', payload);
      return NextResponse.json({ error: payload }, { status });
    }

    const message = (error as Error)?.message ?? 'Internal Server Error';
    console.error('Failed to post loan:', message);
    return NextResponse.json({ error: message }, { status: 500 });
  }
}
