

export function getTableName(
  table: 'transactions' | 'user',
  userId: string
) {
  return `gofinances:${table}:${userId}`
}