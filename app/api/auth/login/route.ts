import { NextRequest, NextResponse } from 'next/server'

export async function POST(request: NextRequest) {
  try {
    const { email, password } = await request.json()

    if (!email || !password) {
      return NextResponse.json({ error: 'Email and password are required' }, { status: 400 })
    }

    // Mock authentication - in real app, verify against database
    if (email === 'demo@example.com' && password === 'demo123') {
      // Generate a mock JWT token
      const token = Buffer.from(JSON.stringify({ userId: '1', email })).toString('base64')

      return NextResponse.json({
        token,
        user: {
          id: '1',
          email,
          name: 'Demo User',
        }
      })
    } else {
      return NextResponse.json({ error: 'Invalid credentials' }, { status: 401 })
    }

  } catch (error) {
    console.error('Login error:', error)
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}