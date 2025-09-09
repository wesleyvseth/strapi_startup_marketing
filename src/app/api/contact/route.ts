import { NextRequest, NextResponse } from "next/server";
import { Client } from "postmark";

// Initialize Postmark client
const client = new Client(process.env.POSTMARK_API_TOKEN || "");

export async function POST(request: NextRequest) {
  try {
    // Check if API token is configured
    if (!process.env.POSTMARK_API_TOKEN) {
      console.error("POSTMARK_API_TOKEN is not configured");
      return NextResponse.json(
        { error: "Email service is not configured" },
        { status: 500 }
      );
    }

    // Parse the request body
    const body = await request.json();
    const { name, email, company, message } = body;

    // Validate required fields
    if (!name || !email || !message) {
      return NextResponse.json(
        { error: "Name, email, and message are required" },
        { status: 400 }
      );
    }

    // Validate email format
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      return NextResponse.json(
        { error: "Invalid email format" },
        { status: 400 }
      );
    }

    // Prepare email content
    const emailContent = `
New contact form submission from website:

Name: ${name}
Email: ${email}
Company: ${company || "Not provided"}

Message:
${message}

---
This email was sent from the contact form.
    `.trim();

    // Send email using Postmark
    const result = await client.sendEmail({
      From: "INSERT_FROM_EMAIL",
      To: "INSERT_TO_EMAIL",
      Subject: `New Contact Form Submission from ${name}`,
      TextBody: emailContent,
      ReplyTo: email, // Allow direct replies to the contact person
    });

    console.log("Email sent successfully:", result.MessageID);

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
