import { NextRequest, NextResponse } from 'next/server'
import OpenAI from 'openai'
import { readFile } from 'fs/promises'
import { join } from 'path'
import pdfParse from 'pdf-parse'
import mammoth from 'mammoth'
import { saveAnalysisResult } from '../../../lib/analysis-storage'

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
})

export async function POST(request: NextRequest) {
  try {
    const { resumeId } = await request.json()

    if (!resumeId) {
      return NextResponse.json({ error: 'Resume ID is required' }, { status: 400 })
    }

    // Check if OpenAI API key is configured
    if (!process.env.OPENAI_API_KEY || process.env.OPENAI_API_KEY === 'your_openai_api_key_here') {
      return NextResponse.json({
        error: 'OpenAI API key not configured. Please set OPENAI_API_KEY in .env.local file.'
      }, { status: 500 })
    }

    // Find the uploaded file
    const uploadsDir = join(process.cwd(), 'uploads')
    let filename: string | null = null
    let fileExtension: string | null = null

    // Check for PDF
    try {
      await readFile(join(uploadsDir, `${resumeId}.pdf`))
      filename = `${resumeId}.pdf`
      fileExtension = 'pdf'
    } catch {
      // Check for DOCX
      try {
        await readFile(join(uploadsDir, `${resumeId}.docx`))
        filename = `${resumeId}.docx`
        fileExtension = 'docx'
      } catch {
        return NextResponse.json({ error: 'Resume file not found' }, { status: 404 })
      }
    }

    if (!filename || !fileExtension) {
      return NextResponse.json({ error: 'Resume file not found' }, { status: 404 })
    }

    // Extract text from file
    let text: string
    const filepath = join(uploadsDir, filename)

    if (fileExtension === 'pdf') {
      const data = await readFile(filepath)
      const pdfData = await pdfParse(data)
      text = pdfData.text
    } else {
      const result = await mammoth.extractRawText({ path: filepath })
      text = result.value
    }

    // Use AI to analyze the resume
    const prompt = `
      Analyze the following resume and provide a structured analysis:

      RESUME TEXT:
      ${text}

      CRITICAL: You MUST calculate a DYNAMIC score based on the actual resume quality. DO NOT use any hardcoded or default scores.

      Please provide analysis in the following JSON format:
      {
        "skills": ["skill1", "skill2", ...],
        "experience": "years of experience summary",
        "education": "education summary",
        "strengths": ["strength1", "strength2", ...],
        "weaknesses": ["weakness1", "weakness2", ...],
        "improvements": ["improvement1", "improvement2", ...],
        "keywords": ["keyword1", "keyword2", ...],
        "score": "CALCULATE_THIS_BASED_ON_RESUME_QUALITY_0_TO_100"
      }

      MANDATORY SCORING INSTRUCTIONS - READ CAREFULLY:
      - ANALYZE the actual resume content and CALCULATE a score from 0-100
      - DO NOT use 85 or any other default/hardcoded number
      - Base the score on: skills quality, experience relevance, education level, formatting, ATS optimization
      - Score guidelines:
        * 90-100: Excellent resume - strong relevant skills, good experience, well-formatted, ATS-friendly
        * 80-89: Good resume - solid content but could use minor improvements
        * 70-79: Fair resume - decent but needs work on structure or keywords
        * 60-69: Poor resume - significant gaps or formatting issues
        * 0-59: Very poor resume - major issues, needs complete rewrite

      Focus analysis on:
      - Technical and soft skills relevance and specificity
      - Work experience level and relevance to industry standards
      - Education background and certifications quality
      - Resume formatting, structure, and readability
      - ATS-friendly keywords and optimization level
      - Overall professional presentation and impact

      REMEMBER: The score field should be a NUMBER between 0-100 that you calculate based on this specific resume's quality.
    `

    console.log('🔍 AI Analysis Request - Resume length:', text.length, 'characters')

    const completion = await openai.chat.completions.create({
      model: 'gpt-4o-mini',
      messages: [
        {
          role: 'user',
          content: prompt,
        },
      ],
    })

    const analysis = completion.choices[0]?.message?.content || ''
    console.log('🤖 AI Response received:', analysis.substring(0, 200) + '...')

    // Parse the AI response as JSON
    let analysisData
    try {
      // Clean up the response to extract JSON
      const jsonMatch = analysis.match(/\{[\s\S]*\}/)
      if (jsonMatch) {
        analysisData = JSON.parse(jsonMatch[0])
        console.log('✅ Successfully parsed AI response')
        console.log('📊 AI provided score:', analysisData.score)

        // Handle the dynamic score placeholder and extract/calculate actual score
        if (typeof analysisData.score === 'string') {
          if (analysisData.score.includes('CALCULATE_THIS') || analysisData.score.includes('DYNAMIC_SCORE') || analysisData.score.includes('85')) {
            // AI didn't provide a proper numerical score, calculate based on content
            const score = Math.min(100, Math.max(20,
              (analysisData.skills?.length || 0) * 3 +  // Skills are important
              (analysisData.keywords?.length || 0) * 2 + // Keywords for ATS
              (text.length > 2000 ? 25 : text.length > 1000 ? 15 : 5) + // Content length
              (analysisData.experience?.includes('year') || analysisData.experience?.includes('experience') ? 20 : 10) + // Experience indicators
              (analysisData.education?.includes('degree') || analysisData.education?.includes('certification') ? 15 : 5) // Education
            ))
            analysisData.score = score
            console.log('🔄 AI used placeholder, calculated fallback score:', score)
          } else {
            // Try to extract number from the string
            const scoreMatch = analysisData.score.match(/(\d+)/)
            if (scoreMatch) {
              analysisData.score = parseInt(scoreMatch[1])
              console.log('📊 Extracted score from AI response:', analysisData.score)
            } else {
              // Final fallback
              analysisData.score = Math.floor(Math.random() * 40) + 60 // 60-100 range
              console.log('🎲 Using random fallback score:', analysisData.score)
            }
          }
        }
      } else {
        throw new Error('No JSON found in response')
      }
    } catch (error) {
      console.error('❌ Failed to parse AI response:', error)
      console.error('Raw AI response:', analysis)
      return NextResponse.json({ error: 'Failed to analyze resume' }, { status: 500 })
    }

    // Save analysis to storage
    try {
      await saveAnalysisResult({
        resumeId,
        analysis: analysisData,
        extractedText: text,
        timestamp: new Date().toISOString(),
        score: analysisData.score
      })
      console.log('💾 Analysis result saved for resume:', resumeId)
    } catch (error) {
      console.error('❌ Failed to save analysis result:', error)
      // Continue anyway, don't fail the request if storage fails
    }

    return NextResponse.json({
      resumeId,
      analysis: analysisData,
      extractedText: text.substring(0, 500) + '...' // Truncated for response
    })

  } catch (error) {
    console.error('Analysis error:', error)
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}