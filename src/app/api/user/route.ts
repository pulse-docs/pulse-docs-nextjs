import { getKindeServerSession} from "@kinde-oss/kinde-auth-nextjs/server";
import { NextResponse } from "next/server";

export async function GET() {
  const { getUser, isAuthenticated } = getKindeServerSession();

  if (!(await isAuthenticated())) {
    return new Response("Unauthorized", { status: 401 });
  }

  const user = await getUser();

  return NextResponse.json({ user });
}