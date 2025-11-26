import { invoke } from "@tauri-apps/api/core";
import { Book } from "./types";

export async function addBook(
  title: string,
  author: string | null,
  filePath: string,
  totalPages: number
): Promise<number> {
  return await invoke<number>("add_book", {
    title,
    author,
    filePath,
    totalPages,
  });
}

export async function getBooks(): Promise<Book[]> {
  return await invoke<Book[]>("get_books");
}

export async function deleteBook(id: number): Promise<void> {
  return await invoke<void>("delete_book", { id });
}
