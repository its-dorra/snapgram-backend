import db from "@/db";

export function getUser({ userId }: { userId: string }) {
  return db.query.users.findFirst({
    where: (t, { eq }) => eq(t.id, userId),
    columns: {
      id: true,
      bio: true,
      followersCount: true,
      followingsCount: true,
      image: true,
      name: true,
    },
  });
}
