import { NextResponse } from 'next/server';

export async function POST(request) {
  try {
    const { email, name } = await request.json();

    // Verificar en nuestra base de datos
    const response = await fetch(`${process.env.BACKEND_URL || 'http://localhost:3001'}/api/auth/verify-google`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ email, name }),
    });

    const data = await response.json();

    if (data.success) {
      return NextResponse.json({
        success: true,
        user: data.user
      });
    } else {
      return NextResponse.json({
        success: false,
        message: data.message || 'Usuario no autorizado'
      });
    }

  } catch (error) {
    console.error('Error verificando usuario Google:', error);
    return NextResponse.json({
      success: false,
      message: 'Error interno del servidor'
    }, { status: 500 });
  }
} 