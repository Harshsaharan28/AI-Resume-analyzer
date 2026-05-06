import { readFile, writeFile, readdir } from 'fs/promises'
import { join } from 'path'

const ANALYSIS_FILE = join(process.cwd(), 'data', 'analysis-results.json')

export interface AnalysisResult {
  resumeId: string
  analysis: any
  extractedText: string
  timestamp: string
  score: number
}

export async function saveAnalysisResult(result: AnalysisResult): Promise<void> {
  try {
    // Ensure data directory exists
    await writeFile(join(process.cwd(), 'data', '.gitkeep'), '', { flag: 'a' })

    // Read existing results
    let results: AnalysisResult[] = []
    try {
      const data = await readFile(ANALYSIS_FILE, 'utf8')
      results = JSON.parse(data)
    } catch {
      // File doesn't exist or is empty, start with empty array
    }

    // Check if analysis already exists for this resume
    const existingIndex = results.findIndex(r => r.resumeId === result.resumeId)

    if (existingIndex >= 0) {
      // Update existing analysis
      results[existingIndex] = result
    } else {
      // Add new analysis
      results.push(result)
    }

    // Save back to file
    await writeFile(ANALYSIS_FILE, JSON.stringify(results, null, 2))
  } catch (error) {
    console.error('Failed to save analysis result:', error)
    throw error
  }
}

export async function getAnalysisResult(resumeId: string): Promise<AnalysisResult | null> {
  try {
    const data = await readFile(ANALYSIS_FILE, 'utf8')
    const results: AnalysisResult[] = JSON.parse(data)
    return results.find(r => r.resumeId === resumeId) || null
  } catch {
    return null
  }
}

export async function getAllAnalysisResults(): Promise<AnalysisResult[]> {
  try {
    const data = await readFile(ANALYSIS_FILE, 'utf8')
    return JSON.parse(data)
  } catch {
    return []
  }
}

export async function getDashboardStats() {
  const results = await getAllAnalysisResults()

  // Count uploaded files
  const uploadsDir = join(process.cwd(), 'uploads')
  let uploadedFiles: string[] = []
  try {
    uploadedFiles = await readdir(uploadsDir)
  } catch {
    // Directory doesn't exist yet
  }

  const totalResumes = uploadedFiles.length
  const analyzedResumes = results.filter(r => r.analysis && r.score).length
  const averageScore = analyzedResumes > 0
    ? Math.round(results.reduce((sum, r) => sum + r.score, 0) / analyzedResumes)
    : 0

  return {
    totalResumes,
    analyzedResumes,
    averageScore
  }
}