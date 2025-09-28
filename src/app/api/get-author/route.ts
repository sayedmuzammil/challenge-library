import axios, { AxiosError } from 'axios';
import { NextResponse } from 'next/server';
import { apiEndpoints } from '../endpoints';

export async function GET() {
  try {
    const response = await axios.get(
      `${process.env.NEXT_PUBLIC_BASE_API_URL}${apiEndpoints.getAuthor}`,
      {
        headers: {
          'Content-Type': 'application/json',
          accept: '*/*',
        },
      }
    );

    console.log('Authors fetched successfully:', response.data);

    return NextResponse.json(response.data);
  } catch (error: unknown) {
    // Properly narrow unknown -> AxiosError
    if (axios.isAxiosError(error)) {
      const axiosErr = error as AxiosError;
      const status = axiosErr.response?.status ?? 500;
      const payload = axiosErr.response?.data ?? {
        error: 'Internal Server Error',
      };
      console.error('Failed to fetch authors:', payload);
      return NextResponse.json({ error: payload }, { status });
    }

    // Non-Axios error fallback
    const message = (error as Error)?.message ?? 'Internal Server Error';
    console.error('Failed to fetch authors:', message);
    return NextResponse.json({ error: message }, { status: 500 });
  }
}
