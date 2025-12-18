import { NextRequest, NextResponse } from "next/server";
import { supabase } from "@/lib/supabase";
import type { ToggleTodoInput } from "@/types/todo";

type Params = Promise<{ id: string }>;

// 4) 完了/未完了切替：id を指定して is_done を true/false で更新できる
export async function PATCH(
  request: NextRequest,
  { params }: { params: Params }
) {
  try {
    const { id } = await params;
    const body: ToggleTodoInput = await request.json();

    if (typeof body.is_done !== "boolean") {
      return NextResponse.json(
        { error: "is_done must be a boolean" },
        { status: 400 }
      );
    }

    const { data, error } = await supabase
      .from("todos")
      .update({
        is_done: body.is_done,
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

