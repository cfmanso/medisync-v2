import { NextRequest } from 'next/server';
import { proxyHandler } from '@medisync/logic/server';

async function getBody(req: NextRequest) {
  try {
    const text = await req.text();
    return text ? JSON.parse(text) : undefined;
  } catch {
    return undefined;
  }
}

function getPath(params: { path: string[] }) {
  return params.path.join('/');
}

export async function GET(request: NextRequest, { params }: { params: { path: string[] } }) {
  return proxyHandler({
    request,
    method: 'GET',
    endpoint: getPath(params),
  });
}

export async function POST(request: NextRequest, { params }: { params: { path: string[] } }) {
  const body = await getBody(request);
  return proxyHandler({
    request,
    method: 'POST',
    endpoint: getPath(params),
    data: body,
  });
}

export async function PUT(request: NextRequest, { params }: { params: { path: string[] } }) {
  const body = await getBody(request);
  return proxyHandler({
    request,
    method: 'PUT',
    endpoint: getPath(params),
    data: body,
  });
}

export async function PATCH(request: NextRequest, { params }: { params: { path: string[] } }) {
  const body = await getBody(request);
  return proxyHandler({
    request,
    method: 'PATCH',
    endpoint: getPath(params),
    data: body,
  });
}

export async function DELETE(request: NextRequest, { params }: { params: { path: string[] } }) {
  return proxyHandler({
    request,
    method: 'DELETE',
    endpoint: getPath(params),
  });
}