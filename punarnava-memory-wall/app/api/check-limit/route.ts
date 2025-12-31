import { NextRequest, NextResponse } from 'next/server';
import { createClient } from '@supabase/supabase-js';
import { headers } from 'next/headers';

// Initialize Supabase Admin Client for server-side operations
const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!;
const supabaseKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!; 
const supabase = createClient(supabaseUrl, supabaseKey);

export async function POST(req: NextRequest) {
  // FIXED: Added 'await' because in Next.js 15 headers are async
  const headersList = await headers();
  
  // Try to get IP from various headers
  let ip = headersList.get('x-forwarded-for') || headersList.get('x-real-ip') || 'unknown-ip';
  
  // If multiple IPs, grab the first one
  if (ip.includes(',')) {
    ip = ip.split(',')[0];
  }

  // 1. Check existing count for this IP
  let { data: logData, error: fetchError } = await supabase
    .from('upload_logs')
    .select('upload_count')
    .eq('ip_address', ip)
    .single();

  const currentCount = logData?.upload_count || 0;

  if (currentCount >= 5) {
    // Limit reached
    return NextResponse.json({ allowed: false, message: "Limit reached (5/5 allowed)" }, { status: 429 });
  }

  // 2. If allowed, increment the count in the database
  const newCount = currentCount + 1;
  const { error: upsertError } = await supabase
    .from('upload_logs')
    .upsert({ 
      ip_address: ip, 
      upload_count: newCount, 
      last_upload_at: new Date().toISOString() 
    });

  if (upsertError) {
    console.error("Error updating log:", upsertError);
  }

  // Return success and remaining count
  return NextResponse.json({ allowed: true, remaining: 5 - newCount });
}