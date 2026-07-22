"use server";
import { apiFetch } from "@/lib/api";
import { redirect } from "next/navigation";

export const registerAction = async (
  prevState: unknown,
  formData: FormData,
) => {
  const data = Object.fromEntries(formData.entries());
  console.log("DT", data);
  const res = await apiFetch("/users", {
    method: "POST",
    body: JSON.stringify({
      email: data.email,
      password: data.password,
      name: data.name,
    }),
  });

  if (!res.ok) {
    const body = await res.json();
    const message = Array.isArray(body.message)
      ? body.message.join(", ")
      : (body.message ?? "register deniend");
    return { error: message };
  }

  redirect("/login?registered=true");
};
