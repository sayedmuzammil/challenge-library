import axios, { AxiosError } from 'axios';
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
  } catch (error: unknown) {
    if (axios.isAxiosError(error)) {
      const err = error as AxiosError;
      const status = err.response?.status ?? 500;
      const payload = err.response?.data ?? { error: 'Internal Server Error' };
      console.error('Failed to fetch book reviews:', payload);
      return NextResponse.json({ error: payload }, { status });
    }

    const message = (error as Error)?.message ?? 'Internal Server Error';
    console.error('Failed to fetch book reviews:', message);
    return NextResponse.json({ error: message }, { status: 500 });
  }
}
