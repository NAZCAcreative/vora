// Used for aggregate inputs that must include every row; visible lists use pages.
export async function collectPages<T>(fetchPage: (from: number, to: number) => PromiseLike<{ data: T[] | null; error: { message: string } | null }>): Promise<T[]> {
  const rows: T[] = [];
  const size = 500;
  for (let offset = 0; ; offset += size) {
    const { data, error } = await fetchPage(offset, offset + size - 1);
    if (error) throw new Error(error.message);
    rows.push(...(data || []));
    if (!data || data.length < size) return rows;
  }
}
