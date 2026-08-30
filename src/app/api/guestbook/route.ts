import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

// Fetch approved comments
export async function GET() {
  try {
    const comments = await prisma.guestbookEntry.findMany({
      where: { isApproved: true },
      orderBy: { createdAt: "desc" },
    });
    return NextResponse.json(comments);
  } catch (error) {
    console.error("Error fetching guestbook:", error);
    return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
  }
}

// Submit a new comment (requires approval)
export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const { name, message } = body;

    if (!name || !message) {
      return NextResponse.json({ error: "Name and message are required" }, { status: 400 });
    }

    const entry = await prisma.guestbookEntry.create({
      data: {
        name,
        message,
        isApproved: false, // Default to false pending admin approval
      },
    });

    return NextResponse.json(entry, { status: 201 });
  } catch (error) {
    console.error("Error submitting guestbook entry:", error);
    return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
  }
}
