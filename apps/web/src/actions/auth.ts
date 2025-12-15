'use server'; 

import { cookies } from 'next/headers';
import { apiFetch } from '@medisync/logic'; 
import type { LoginInput, LoginResponse } from '@medisync/schema';

export async function loginAction(credentials: LoginInput) {
  try {
    const data = await apiFetch<LoginResponse>('/auth/login', {
      method: 'POST',
      body: JSON.stringify(credentials),
    });

    (await cookies()).set('token', data.access_token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      maxAge: 60 * 60 * 24 * 7, 
      path: '/',
      sameSite: 'lax',
    });

    return { success: true, user: data.user };

  } catch (error: any) {
    return { success: false, error: error.message };
  }
}

export async function logoutAction() {
  (await cookies()).delete('token');
  return { success: true };
}