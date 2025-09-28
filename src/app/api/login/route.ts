import axios, { AxiosError } from 'axios';
import { NextRequest, NextResponse } from 'next/server';
import { apiEndpoints } from '../endpoints';

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { email, password } = body;
    const response = await axios.post(
      `${process.env.NEXT_PUBLIC_BASE_API_URL}${apiEndpoints.login}`,
      { email, password },
      {
        headers: {
          'Content-Type': 'application/json',
          accept: '*/*',
        },
      }
    );
    console.log(response);

    console.log(response.data);

    return NextResponse.json(response.data);
  } catch (error: unknown) {
    if (axios.isAxiosError(error)) {
      const err = error as AxiosError;
      const status = err.response?.status ?? 500;
      const payload = err.response?.data ?? { error: 'Internal Server Error' };
      console.error('Failed to login:', payload);
      return NextResponse.json({ error: payload }, { status });
    }

    const message = (error as Error)?.message ?? 'Internal Server Error';
    console.error('Failed to login:', message);
    return NextResponse.json({ error: message }, { status: 500 });
  }
}
