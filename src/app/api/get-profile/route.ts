import axios from 'axios';
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
  } catch (error: any) {
    console.error(
      'Failed to fetch profile:',
      error.response?.data || error.message
    );
    return NextResponse.json(
      {
        error: error.response?.data || 'Internal Server Error',
      },
      { status: error.response?.status || 500 }
    );
  }
}
