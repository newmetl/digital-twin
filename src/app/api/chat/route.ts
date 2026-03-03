import { NextRequest, NextResponse } from 'next/server';
import { anthropic, CLAUDE_MODEL, MAX_TOKENS } from '@/lib/anthropic';
import { SYSTEM_PROMPT } from '@/lib/systemPrompt';
import { ChatRequest } from '@/types/chat';

export async function POST(request: NextRequest) {
  try {
    const body: ChatRequest = await request.json();
    const { messages } = body;

    if (!messages || messages.length === 0) {
      return NextResponse.json({ error: 'Keine Nachrichten übergeben' }, { status: 400 });
    }

    const response = await anthropic.messages.create({
      model: CLAUDE_MODEL,
      max_tokens: MAX_TOKENS,
      system: SYSTEM_PROMPT,
      messages: messages.map((m) => ({
        role: m.role,
        content: m.content,
      })),
    });

    const textContent = response.content.find((c) => c.type === 'text');
    const text = textContent?.type === 'text' ? textContent.text : '';

    return NextResponse.json({ text });
  } catch (error) {
    console.error('Chat API Fehler:', error);
    return NextResponse.json(
      { error: 'Es ist ein Fehler aufgetreten. Bitte versuche es erneut.' },
      { status: 500 }
    );
  }
}
