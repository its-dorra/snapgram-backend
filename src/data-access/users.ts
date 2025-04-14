import db from "@/db";

export function getUserInfo({ userId }: { userId: string }) {
  return db.query.users.findFirst({
    where: (t, { eq }) => eq(t.id, userId),
    columns: {
      email: false,
      emailVerified: false,
      createdAt: false,
      updatedAt: false,
    },
  })
}
