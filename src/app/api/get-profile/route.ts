import axios, { AxiosError } from 'axios';
import { NextRequest, NextResponse } from 'next/server';
import { apiEndpoints } from '../endpoints';

export async function GET(request: NextRequest) {
  try {
    // Get the Authorization header from the incoming request
    const authHeader = request.headers.get('authorization');

    if (!authHeader) {
      return NextResponse.json(
        { error: 'Authorization header is required' },
        { status: 401 }
      );
    }

    // Construct the API URL
    const apiUrl = `${process.env.NEXT_PUBLIC_BASE_API_URL}${apiEndpoints.getProfile}`;

    const response = await axios.get(apiUrl, {
      headers: {
        accept: '*/*',
        Authorization: authHeader,
      },
    });

    console.log('Profile fetched successfully:', response.data);

    return NextResponse.json(response.data);
  } catch (error: unknown) {
    if (axios.isAxiosError(error)) {
      const err = error as AxiosError;
      const status = err.response?.status ?? 500;
      const payload = err.response?.data ?? { error: 'Internal Server Error' };
      console.error('Failed to fetch profile:', payload);
      return NextResponse.json({ error: payload }, { status });
    }

    const message = (error as Error)?.message ?? 'Internal Server Error';
    console.error('Failed to fetch profile:', message);
    return NextResponse.json({ error: message }, { status: 500 });
  }
}
