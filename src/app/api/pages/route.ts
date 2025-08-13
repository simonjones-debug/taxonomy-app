import { NextResponse } from 'next/server'
import { getAllPages } from '@/lib/contentful'

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url)
    const nodeId = searchParams.get('nodeId')

    if (!nodeId) {
      return NextResponse.json(
        { 
          success: false, 
          error: 'nodeId parameter is required' 
        },
        { status: 400 }
      )
    }

    const pages = await getAllPages(nodeId)
    return NextResponse.json({
      success: true,
      pages
    })
  } catch (error) {
    console.error('Error fetching pages:', error)
    return NextResponse.json(
      { 
        success: false, 
        error: error instanceof Error ? error.message : 'Unknown error' 
      },
      { status: 500 }
    )
  }
} 