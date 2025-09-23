import { NextRequest, NextResponse } from "next/server";
import { Client } from "postmark";
import { JSDOM } from "jsdom";
import DOMPurify from "dompurify";

// Initialize Postmark client
const client = new Client(process.env.POSTMARK_API_TOKEN || "");

// Simple rate limiting store (in production, use Redis or database)
const rateLimitStore = new Map<string, { count: number; resetTime: number }>();

// Initialize DOMPurify for server-side use
const window = new JSDOM("").window;
const purify = DOMPurify(window as any);

// Comprehensive input sanitization using DOMPurify
function sanitizeInput(input: string): string {
  if (typeof input !== "string") return "";

  // First trim and limit length
  const trimmed = input.trim().slice(0, 5000);

  // Use DOMPurify to sanitize - strip all HTML and dangerous content
  const sanitized = purify.sanitize(trimmed, {
    ALLOWED_TAGS: [], // No HTML tags allowed
    ALLOWED_ATTR: [], // No attributes allowed
    KEEP_CONTENT: true, // Keep text content, remove tags
    FORBID_TAGS: ["script", "style", "iframe", "object", "embed"],
    FORBID_ATTR: ["onerror", "onload", "onclick", "onmouseover"],
  });

  return sanitized.trim();
}

// Validate input lengths and patterns
function validateInput(
  name: string,
  email: string,
  company: string,
  message: string
) {
  // Check required fields
  if (!name || !email || !message) {
    return { valid: false, error: "Name, email, and message are required" };
  }

  // Length validations
  if (name.length > 100) {
    return { valid: false, error: "Name must be less than 100 characters" };
  }

  if (email.length > 254) {
    return { valid: false, error: "Email must be less than 254 characters" };
  }

  if (company.length > 100) {
    return { valid: false, error: "Company must be less than 100 characters" };
  }

  if (message.length > 2000) {
    return { valid: false, error: "Message must be less than 2000 characters" };
  }

  // Email format validation
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  if (!emailRegex.test(email)) {
    return { valid: false, error: "Invalid email format" };
  }

  // Basic spam detection
  const suspiciousPatterns = [
    /http[s]?:\/\//gi, // URLs
    /\b(buy|click|free|money|cash|prize|winner)\b/gi, // Common spam words
  ];

  const fullText = `${name} ${email} ${company} ${message}`;
  const urlMatches = (fullText.match(/http[s]?:\/\//gi) || []).length;
  const spamWords = suspiciousPatterns
    .slice(1)
    .some((pattern) => pattern.test(fullText));

  if (urlMatches > 2 || spamWords) {
    return { valid: false, error: "Message appears to be spam" };
  }

  return { valid: true };
}

// Simple rate limiting
function checkRateLimit(ip: string): { allowed: boolean; error?: string } {
  const now = Date.now();
  const windowMs = 15 * 60 * 1000; // 15 minutes
  const maxRequests = 5; // 5 requests per 15 minutes

  const current = rateLimitStore.get(ip);

  if (!current || now > current.resetTime) {
    rateLimitStore.set(ip, { count: 1, resetTime: now + windowMs });
    return { allowed: true };
  }

  if (current.count >= maxRequests) {
    return {
      allowed: false,
      error: "Too many requests. Please try again later.",
    };
  }

  current.count++;
  return { allowed: true };
}

export async function POST(request: NextRequest) {
  try {
    // Rate limiting
    const ip =
      request.headers.get("x-forwarded-for") ||
      request.headers.get("x-real-ip") ||
      "unknown";
    const rateCheck = checkRateLimit(ip);
    if (!rateCheck.allowed) {
      return NextResponse.json({ error: rateCheck.error }, { status: 429 });
    }

    // Check if API token is configured
    if (!process.env.POSTMARK_API_TOKEN) {
      console.error("POSTMARK_API_TOKEN is not configured");
      return NextResponse.json(
        { error: "Email service is not configured" },
        { status: 500 }
      );
    }

    // Parse and validate request body size
    const body = await request.json();

    if (JSON.stringify(body).length > 10000) {
      // 10KB limit
      return NextResponse.json({ error: "Request too large" }, { status: 413 });
    }

    let { name, email, company, message } = body;

    // Sanitize inputs
    name = sanitizeInput(name);
    email = sanitizeInput(email);
    company = sanitizeInput(company);
    message = sanitizeInput(message);

    // Validate inputs
    const validation = validateInput(name, email, company, message);
    if (!validation.valid) {
      return NextResponse.json({ error: validation.error }, { status: 400 });
    }

    // Prepare email content (inputs are already sanitized)
    const emailContent = `
New contact form submission from website:

Name: ${name}
Email: ${email}
Company: ${company || "Not provided"}

Message:
${message}

---
This email was sent from the contact form on ${new Date().toISOString()}.
IP: ${ip}
    `.trim();

    // Send email using Postmark
    const result = await client.sendEmail({
      From: "INSERT_FROM_EMAIL",
      To: "INSERT_TO_EMAIL",
      Subject: `New Contact Form Submission from ${name}`,
      TextBody: emailContent,
      ReplyTo: email, // Allow direct replies to the contact person
    });

    return NextResponse.json({
      success: true,
      message: "Message sent successfully",
      messageId: result.MessageID,
    });
  } catch (error) {
    console.error("Error sending email:", error);

    // Handle specific Postmark errors
    if (error instanceof Error) {
      return NextResponse.json(
        { error: "Failed to send message. Please try again later." },
        { status: 500 }
      );
    }

    return NextResponse.json(
      { error: "An unexpected error occurred" },
      { status: 500 }
    );
  }
}
