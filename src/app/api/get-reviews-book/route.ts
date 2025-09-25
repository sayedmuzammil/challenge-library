import axios from 'axios';
import { NextRequest, NextResponse } from 'next/server';
import { apiEndpoints } from '../endpoints';

export async function GET(request: NextRequest) {
  try {
    // Extract query parameters from the request URL
    const { searchParams } = new URL(request.url);
    const bookId = searchParams.get('bookId');
    const page = searchParams.get('page') || '1';
    const limit = searchParams.get('limit') || '10';

    // Validate required bookId parameter
    if (!bookId) {
      return NextResponse.json(
        {
          error: { success: false, message: 'Book ID is required' },
        },
        { status: 400 }
      );
    }

    // Construct the API URL with bookId and query parameters
    const apiUrl = `${
      process.env.NEXT_PUBLIC_BASE_API_URL
    }${apiEndpoints.getBookReview.replace(
      ':id',
      bookId
    )}?page=${page}&limit=${limit}`;

    const response = await axios.get(apiUrl, {
      headers: {
        'Content-Type': 'application/json',
        accept: '*/*',
      },
    });

    console.log('Book reviews fetched successfully:', response.data);

    return NextResponse.json(response.data);
  } catch (error: any) {
    console.error(
      'Failed to fetch book reviews:',
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
