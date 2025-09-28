import axios, { AxiosError } from 'axios';
import { NextRequest, NextResponse } from 'next/server';
import { apiEndpoints } from '../endpoints';

export async function GET(request: NextRequest) {
  try {
    // Extract query parameters from the request URL
    const { searchParams } = new URL(request.url);
    const page = searchParams.get('page') || '1';
    const limit = searchParams.get('limit') || '10';

    // Construct the API URL with query parameters
    const apiUrl = `${process.env.NEXT_PUBLIC_BASE_API_URL}${apiEndpoints.getBooks}?page=${page}&limit=${limit}`;

    const response = await axios.get(apiUrl, {
      headers: {
        'Content-Type': 'application/json',
        accept: '*/*',
      },
    });

    console.log('Recommended books fetched successfully:', response.data);

    return NextResponse.json(response.data);
  } catch (error: unknown) {
    if (axios.isAxiosError(error)) {
      const err = error as AxiosError;
      const status = err.response?.status ?? 500;
      const payload = err.response?.data ?? { error: 'Internal Server Error' };
      console.error('Failed to fetch recommended books:', payload);
      return NextResponse.json({ error: payload }, { status });
    }

    const message = (error as Error)?.message ?? 'Internal Server Error';
    console.error('Failed to fetch recommended books:', message);
    return NextResponse.json({ error: message }, { status: 500 });
  }
}
