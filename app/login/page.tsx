"use client";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardAction,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import Link from "next/link";
import { useActionState } from "react";
import { loginAction } from "./action";
import { AlertCircle } from "lucide-react";

export default function Login() {
  const [state, formAction, pending] = useActionState(loginAction, null);
  return (
    <div className="flex w-full max-w-sm flex-col items-center">
      <img src="/icon.svg" alt="Demo Chat" className="mb-4 h-20 w-20" />
      <Card className="w-full">
        <CardHeader>
          <CardTitle>เข้าสู่ระบบ Vd - Demo live chat</CardTitle>
          <CardDescription></CardDescription>
          <CardAction>
            <Link href="register">
              <Button className="cursor-pointer" variant="link">
                ลงทะเบียน
              </Button>
            </Link>
          </CardAction>
        </CardHeader>
        <form action={formAction}>
          <CardContent>
            <div className="flex flex-col gap-6">
              <div className="grid gap-2">
                <Label htmlFor="email">อีเมล</Label>
                <Input
                  id="email"
                  name="email"
                  type="email"
                  placeholder="m@example.com"
                  required
                />
              </div>
              <div className="grid gap-2 pb-4">
                <div className="flex items-center">
                  <Label htmlFor="password">พาสเวิร์ด</Label>
                </div>
                <Input id="password" name="password" type="password" required />
                {state?.error && (
                  <div className="flex items-center gap-2 rounded-lg bg-destructive/10 px-3 py-2 text-sm text-destructive">
                    <AlertCircle className="size-4 shrink-0" />
                    {state.error}
                  </div>
                )}
              </div>
            </div>
          </CardContent>
          <CardFooter className="flex-col gap-2 ">
            <Button
              variant={"icon"}
              type="submit"
              className="w-full py-5 cursor-pointer"
            >
              {pending ? "กำลังโหลด..." : "เข้าสู่ระบบ"}
            </Button>
          </CardFooter>
        </form>
      </Card>
    </div>
  );
}
