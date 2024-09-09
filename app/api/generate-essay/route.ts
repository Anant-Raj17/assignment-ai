import { NextResponse } from "next/server";
import { Groq } from "groq-sdk";
import { EssayRequest } from "../../../types/essay";

const groq = new Groq({
  apiKey: process.env.GROQ_API_KEY,
});

export async function POST(request: Request) {
  try {
    const body: EssayRequest = await request.json();
    const { topic, format, pages, handwriting } = body;

    if (!topic || !format || !pages || !handwriting) {
      return NextResponse.json(
        { error: "Missing required parameters" },
        { status: 400 },
      );
    }

    const wordsPerLine = handwriting === "big" ? 5 : 7;
    const totalWords = 32 * pages * wordsPerLine;

    let prompt = `Generate an essay on the topic "${topic}" with approximately ${totalWords} words. `;
    prompt +=
      format === "bullet"
        ? "Use headings and bullet points. "
        : "Use headings and multiple paragraphs. ";

    const completion = await groq.chat.completions.create({
      messages: [{ role: "user", content: prompt }],
      model: "llama3-70b-8192",
    });

    const essay = completion.choices[0]?.message?.content;

    if (!essay) {
      return NextResponse.json(
        { error: "No essay generated" },
        { status: 500 },
      );
    }

    return NextResponse.json({ essay });
  } catch (error) {
    console.error("Error generating essay:", error);
    return NextResponse.json(
      {
        error:
          "Error generating essay: " +
          (error instanceof Error ? error.message : String(error)),
      },
      { status: 500 },
    );
  }
}
