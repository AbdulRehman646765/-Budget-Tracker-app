import { NextRequest, NextResponse } from 'next/server';

let inMemoryBudgetData: any = null;

export async function GET() {
  return NextResponse.json({
    status: 'success',
    timestamp: new Date().toISOString(),
    data: inMemoryBudgetData,
    message: 'Monthly Budget Tracker REST API operational.',
  });
}

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    inMemoryBudgetData = body;
    return NextResponse.json({
      status: 'success',
      timestamp: new Date().toISOString(),
      message: 'Budget state stored in API memory.',
      receivedCount: {
        customExpenses: body.customExpenses?.length || 0,
        subscriptions: body.subscriptions?.length || 0,
        history: body.history?.length || 0,
      },
    });
  } catch (error) {
    return NextResponse.json(
      { status: 'error', message: 'Invalid JSON payload' },
      { status: 400 }
    );
  }
}
