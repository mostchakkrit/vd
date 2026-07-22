import { cookies } from "next/headers";

export async function GET() {
  const cookieStore = await cookies();
  const token = cookieStore.get("accessToken")?.value;

  if (!token) {
    return new Response("Unauthorized", { status: 401 });
  }

  const payload = JSON.parse(
    Buffer.from(token.split(".")[1], "base64").toString("utf-8"),
  );

  return Response.json({ token, userId: payload.userId, name: payload.name });
}
