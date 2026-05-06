import { NextRequest, NextResponse } from 'next/server'
import { readdir } from 'fs/promises'
import { join } from 'path'
import { getAllAnalysisResults, getDashboardStats } from '../../../lib/analysis-storage'

export async function GET(request: NextRequest) {
  try {
    const uploadsDir = join(process.cwd(), 'uploads')

    // Get all uploaded files
    let files: string[] = []
    try {
      files = await readdir(uploadsDir)
    } catch (error) {
      // Directory doesn't exist yet
    }

    // Get analysis results from storage
    const analysisResults = await getAllAnalysisResults()

    // Create resume objects with real analysis data
    const resumes = files.map((file) => {
      const resumeId = file.split('.')[0]
      const analysis = analysisResults.find(r => r.resumeId === resumeId)

      return {
        id: resumeId,
        name: file,
        status: analysis ? 'analyzed' : 'pending',
        date: analysis
          ? new Date(analysis.timestamp).toISOString().split('T')[0]
          : new Date(Date.now() - Math.random() * 7 * 24 * 60 * 60 * 1000).toISOString().split('T')[0],
        score: analysis ? analysis.score : null,
      }
    })

    // Get real stats from analysis storage
    const stats = await getDashboardStats()

    return NextResponse.json({
      stats,
      resumes: resumes.slice(0, 10), // Limit to 10 for dashboard
    })

  } catch (error) {
    console.error('Dashboard error:', error)
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}