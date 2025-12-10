import { NextRequest } from 'next/server';
import { proxyHandler } from '@medisync/logic/server';

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ path: string[] }> }
) {
  const { path } = await params;
  return proxyHandler({
    request,
    method: 'GET',
    endpoint: path.join('/'),
  });
}

export async function POST(
  request: NextRequest,
  { params }: { params: Promise<{ path: string[] }> }
) {
  const { path } = await params;
  const body = await request.json().catch(() => undefined);
  return proxyHandler({
    request,
    method: 'POST',
    endpoint: path.join('/'),
    data: body,
  });
}

export async function PUT(
  request: NextRequest,
  { params }: { params: Promise<{ path: string[] }> }
) {
  const { path } = await params;
  const body = await request.json().catch(() => undefined);
  return proxyHandler({
    request,
    method: 'PUT',
    endpoint: path.join('/'),
    data: body,
  });
}

export async function PATCH(
  request: NextRequest,
  { params }: { params: Promise<{ path: string[] }> }
) {
  const { path } = await params;
  const body = await request.json().catch(() => undefined);
  return proxyHandler({
    request,
    method: 'PATCH',
    endpoint: path.join('/'),
    data: body,
  });
}

export async function DELETE(
  request: NextRequest,
  { params }: { params: Promise<{ path: string[] }> }
) {
  const { path } = await params;
  return proxyHandler({
    request,
    method: 'DELETE',
    endpoint: path.join('/'),
  });
}