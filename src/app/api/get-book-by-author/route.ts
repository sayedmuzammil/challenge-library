import axios from 'axios';
import { NextRequest, NextResponse } from 'next/server';
import { apiEndpoints } from '../endpoints';

export async function GET(request: NextRequest) {
  try {
    // Extract query parameters from the request URL
    const { searchParams } = new URL(request.url);
    const authorId = searchParams.get('authorId'); // Changed from 'id' to 'authorId'

    // Check if authorId is provided
    if (!authorId) {
      return NextResponse.json(
        { error: 'Author ID is required' },
        { status: 400 }
      );
    }

    // Construct the API URL with the authorId parameter
    const apiUrl = `${
      process.env.NEXT_PUBLIC_BASE_API_URL
    }${apiEndpoints.getBookByAuthor.replace(':id', authorId)}`;

    const response = await axios.get(apiUrl, {
      headers: {
        'Content-Type': 'application/json',
        accept: '*/*',
      },
    });

    console.log('Author Books fetched successfully:', response.data);

    return NextResponse.json(response.data);
  } catch (error: any) {
    console.error(
      'Failed to fetch author books:',
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
