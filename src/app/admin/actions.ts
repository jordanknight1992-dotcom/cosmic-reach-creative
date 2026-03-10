"use server";

import { updateSubmissionStatus, updateSubmissionNotes } from "@/lib/db";
import { revalidatePath } from "next/cache";

export async function setStatus(
  table: "contact" | "audit",
  id: number,
  status: string
) {
  await updateSubmissionStatus(table, id, status);
  revalidatePath("/admin");
}

export async function setNotes(
  table: "contact" | "audit",
  id: number,
  notes: string
) {
  await updateSubmissionNotes(table, id, notes);
  revalidatePath("/admin");
}
