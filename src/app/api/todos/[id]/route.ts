import { NextRequest, NextResponse } from "next/server";
import { supabase } from "@/lib/supabase";
import type { UpdateTodoInput } from "@/types/todo";

type Params = Promise<{ id: string }>;

// 3) 更新：id を指定して title を更新できる
export async function PATCH(
  request: NextRequest,
  { params }: { params: Params }
) {
  try {
    const { id } = await params;
    const body: UpdateTodoInput = await request.json();

    if (!body.title || body.title.trim() === "") {
      return NextResponse.json(
        { error: "title is required" },
        { status: 400 }
      );
    }

    const { data, error } = await supabase
      .from("todos")
      .update({
        title: body.title.trim(),
        updated_at: new Date().toISOString(),
      })
      .eq("id", id)
      .select()
      .single();

    if (error) {
      return NextResponse.json({ error: error.message }, { status: 500 });
    }

    if (!data) {
      return NextResponse.json({ error: "Todo not found" }, { status: 404 });
    }

    return NextResponse.json(data);
  } catch {
    return NextResponse.json(
      { error: "Invalid request body" },
      { status: 400 }
    );
  }
}

// 5) 削除：id を指定して削除できる
export async function DELETE(
  _request: NextRequest,
  { params }: { params: Params }
) {
  const { id } = await params;

  const { data, error } = await supabase
    .from("todos")
    .delete()
    .eq("id", id)
    .select()
    .single();

  if (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }

  if (!data) {
    return NextResponse.json({ error: "Todo not found" }, { status: 404 });
  }

  return NextResponse.json(data);
}

