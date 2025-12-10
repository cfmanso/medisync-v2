import { cookies } from 'next/headers';
import { NextRequest, NextResponse } from 'next/server';

const API_BASE_URL = process.env.API_URL || 'http://localhost:3001';

interface ProxyOptions {
  request: NextRequest;
  endpoint: string;
  method: string;
  data?: any;
}

export async function proxyHandler({ request, endpoint, method, data }: ProxyOptions) {
  try {
    const cookieStore = cookies();
    const token = (await cookieStore).get('token')?.value;

    const headers: Record<string, string> = {
      'Content-Type': 'application/json',
    };

    if (token) {
      headers['Authorization'] = `Bearer ${token}`;
    }

    const searchParams = request.nextUrl.search; 
    const url = `${API_BASE_URL}/${endpoint}${searchParams}`;

    const response = await fetch(url, {
      method,
      headers,
      body: data ? JSON.stringify(data) : undefined,
      cache: 'no-store', 
    });

    let responseData = null;
    const contentType = response.headers.get('content-type');
    
    if (contentType && contentType.includes('application/json')) {
      responseData = await response.json();
    } else {
      responseData = await response.text();
    }

    return NextResponse.json(responseData, { status: response.status });

  } catch (error: any) {
    console.error(`[Proxy Error] ${method} ${endpoint}:`, error);
    return NextResponse.json(
      { message: 'Erro interno no servidor Proxy', error: error.message },
      { status: 500 }
    );
  }
}