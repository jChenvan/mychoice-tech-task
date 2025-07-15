export interface Item {
  id: number,
  name: string,
  group: "PRIMARY" | "SECONDARY",
  "created_at": string,
  "updated_at": string,
}