import { createClient } from "@/lib/supabase/server"
import { type NextRequest, NextResponse } from "next/server"

export async function POST(request: NextRequest) {
  try {
    const supabase = await createClient()

    // Check authentication
    const {
      data: { user },
      error: authError,
    } = await supabase.auth.getUser()
    if (authError || !user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    const formData = await request.formData()
    const file = formData.get("file") as File

    if (!file) {
      return NextResponse.json({ error: "No file provided" }, { status: 400 })
    }

    // Validate file size (10MB limit)
    if (file.size > 10 * 1024 * 1024) {
      return NextResponse.json({ error: "File size too large. Maximum 10MB allowed." }, { status: 400 })
    }

    // Validate file type
    const allowedTypes = [
      "application/pdf",
      "application/msword",
      "application/vnd.openxmlformats-officedocument.wordprocessingml.document",
      "text/plain",
      "image/jpeg",
      "image/png",
      "image/jpg",
    ]

    if (!allowedTypes.includes(file.type)) {
      return NextResponse.json({ error: "Invalid file type" }, { status: 400 })
    }

    // Create unique filename
    const timestamp = Date.now()
    const filename = `${user.id}/${timestamp}-${file.name}`

    // Convert file to buffer
    const bytes = await file.arrayBuffer()
    const buffer = Buffer.from(bytes)

    // For now, we'll simulate file upload and return a mock URL
    // In a real implementation, you would upload to a storage service
    const mockFileUrl = `https://storage.example.com/${filename}`

    // Extract text content based on file type
    let extractedText = ""

    if (file.type === "text/plain") {
      extractedText = buffer.toString("utf-8")
    } else if (file.type.startsWith("image/")) {
      // For images, we'll simulate OCR text extraction
      extractedText =
        "This is extracted text from the uploaded image. In a real implementation, this would use OCR services like Google Vision API or AWS Textract to extract text from images."
    } else if (file.type === "application/pdf" || file.type.includes("word")) {
      // For PDFs and Word docs, simulate text extraction
      extractedText =
        "This is extracted text from the uploaded document. In a real implementation, this would use libraries like pdf-parse for PDFs or mammoth for Word documents to extract text content."
    }

    return NextResponse.json({
      success: true,
      fileUrl: mockFileUrl,
      extractedText: extractedText.substring(0, 2000), // Limit to 2000 characters
      fileName: file.name,
      fileSize: file.size,
      fileType: file.type,
    })
  } catch (error) {
    console.error("Upload error:", error)
    return NextResponse.json({ error: "Upload failed" }, { status: 500 })
  }
}
