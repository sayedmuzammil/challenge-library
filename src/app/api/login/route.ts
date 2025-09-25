import axios from 'axios';
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
    console.log(response.data);

    return NextResponse.json(response.data);
  } catch (error: any) {
    console.error('Failed to login : ', error.response?.data || error.message);
    return NextResponse.json(
      {
        error: error.response?.data || 'Internal Server Error',
      },
      { status: error.response?.status || 500 }
    );
  }
}
