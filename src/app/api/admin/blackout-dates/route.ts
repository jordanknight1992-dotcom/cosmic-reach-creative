import { NextRequest, NextResponse } from "next/server";
import {
  getBlackoutDates,
  addBlackoutDate,
  deleteBlackoutDate,
} from "@/lib/booking";

export async function GET() {
  try {
    const dates = await getBlackoutDates();
    return NextResponse.json({ dates });
  } catch (err) {
    console.error("Error fetching blackout dates:", err);
    return NextResponse.json(
      { error: "Failed to fetch blackout dates" },
      { status: 500 }
    );
  }
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { startDate, endDate, label } = body;

    if (!startDate || !endDate) {
      return NextResponse.json(
        { error: "startDate and endDate are required" },
        { status: 400 }
      );
    }

    const date = await addBlackoutDate({ startDate, endDate, label });
    return NextResponse.json({ success: true, date });
  } catch (err) {
    console.error("Error adding blackout date:", err);
    return NextResponse.json(
      { error: "Failed to add blackout date" },
      { status: 500 }
    );
  }
}

export async function DELETE(request: NextRequest) {
  try {
    const { id } = await request.json();
    if (!id) {
      return NextResponse.json({ error: "id is required" }, { status: 400 });
    }
    await deleteBlackoutDate(id);
    return NextResponse.json({ success: true });
  } catch (err) {
    console.error("Error deleting blackout date:", err);
    return NextResponse.json(
      { error: "Failed to delete blackout date" },
      { status: 500 }
    );
  }
}
