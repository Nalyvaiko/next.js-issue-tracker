import { db } from '@/db'
import { issues } from '@/db/schema'
import { NextRequest, NextResponse } from 'next/server'

export const GET = async () => {
  try {
    const issues = await db.query.issues.findMany()
    return NextResponse.json({ data: { issues } })
  } catch (error) {
    console.error('Error fetching issues:', error)
    return NextResponse.json(
      { error: 'Failed to fetch issues' },
      { status: 500 }
    )
  }
}

export const POST = async (request: NextRequest) => {
  try {
    const data = await request.json()

    // Validate required fields
    if (!data.title || !data.userId) {
      return NextResponse.json(
        { error: 'Title and userId are required' },
        { status: 400 }
      )
    }

    // Create the issue
    const [newIssue] = await db
      .insert(issues)
      .values({
        title: data.title,
        description: data.description || null,
        status: data.status || 'backlog',
        priority: data.priority || 'medium',
        userId: data.userId,
      })
      .returning()

    return NextResponse.json(
      { message: 'Issue created successfully', data: newIssue },
      { status: 201 }
    )
  } catch (error) {
    console.error('Error creating issue:', error)
    return NextResponse.json(
      { error: 'Failed to create issue' },
      { status: 500 }
    )
  }
}
