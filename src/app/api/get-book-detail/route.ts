import axios from 'axios';
import { NextRequest, NextResponse } from 'next/server';
import { apiEndpoints } from '../endpoints';

export async function GET(request: NextRequest) {
  try {
    // Extract query parameters from the request URL
    const { searchParams } = new URL(request.url);
    const id = searchParams.get('id');

    // Check if ID is provided
    if (!id) {
      return NextResponse.json(
        { error: 'Book ID is required' },
        { status: 400 }
      );
    }

    // Construct the API URL with query parameters
    const apiUrl = `${
      process.env.NEXT_PUBLIC_BASE_API_URL
    }${apiEndpoints.getBookDetail.replace(':id', id)}`;

    const response = await axios.get(apiUrl, {
      headers: {
        'Content-Type': 'application/json',
        accept: '*/*',
      },
    });

    console.log('Books fetched successfully:', response.data);

    return NextResponse.json(response.data);
  } catch (error: any) {
    console.error(
      'Failed to fetch books:',
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
