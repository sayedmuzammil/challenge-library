import axios from 'axios';
import { NextRequest, NextResponse } from 'next/server';
import { apiEndpoints } from '../endpoints';

export async function GET(request: NextRequest) {
  try {
    const response = await axios.get(
      `${process.env.NEXT_PUBLIC_BASE_API_URL}${apiEndpoints.getCategories}`,
      {
        headers: {
          'Content-Type': 'application/json',
          accept: '*/*',
        },
      }
    );

    console.log('Categories fetched successfully:', response.data);

    return NextResponse.json(response.data);
  } catch (error: any) {
    console.error(
      'Failed to fetch categories:',
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
