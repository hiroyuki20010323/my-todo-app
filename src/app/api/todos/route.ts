import { NextRequest, NextResponse } from "next/server";
import { supabase } from "@/lib/supabase";
import type { CreateTodoInput } from "@/types/todo";

// 1) 作成：title を受け取り、is_done は false で登録する
export async function POST(request: NextRequest) {
  try {
    const body: CreateTodoInput = await request.json();

    if (!body.title || body.title.trim() === "") {
      return NextResponse.json(
        { error: "title is required" },
        { status: 400 }
      );
    }

    const { data, error } = await supabase
      .from("todos")
      .insert({ title: body.title.trim(), is_done: false })
      .select()
      .single();

    if (error) {
      return NextResponse.json({ error: error.message }, { status: 500 });
    }

    return NextResponse.json(data, { status: 201 });
  } catch {
    return NextResponse.json(
      { error: "Invalid request body" },
      { status: 400 }
    );
  }
}

// 2) 一覧取得：created_at の降順で全件取得する
export async function GET() {
  const { data, error } = await supabase
    .from("todos")
    .select("*")
    .order("created_at", { ascending: false });

  if (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }

  return NextResponse.json(data);
}

