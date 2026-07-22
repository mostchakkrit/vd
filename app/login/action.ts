"use server";
import { apiFetch } from "@/lib/api";
import { cookies } from "next/headers";
import { redirect } from "next/navigation";

export const loginAction = async (prevState: unknown, formData: FormData) => {
  const data = Object.fromEntries(formData.entries());

  const res = await apiFetch("/auth/login", {
    method: "POST",
    body: JSON.stringify({
      email: data.email,
      password: data.password,
    }),
  });

  if (!res.ok) {
    const body = await res.json();
    const message = Array.isArray(body.message)
      ? body.message.join(", ")
      : (body.message ?? "Login deniend");
    return { error: message };
  }

  const objData = await res.json();
  console.log(objData);
  const cookieStore = await cookies();
  cookieStore.set("accessToken", objData.data.accessToken, {
    httpOnly: true,
    secure: true,
    sameSite: "lax",
    path: "/",
    maxAge: 60 * 60,
  });

  redirect("/chat");
};
