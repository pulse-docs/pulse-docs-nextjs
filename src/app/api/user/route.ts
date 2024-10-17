import { getKindeServerSession} from "@kinde-oss/kinde-auth-nextjs/server";
import { NextResponse } from "next/server";
import {useKindeAuth} from "@kinde-oss/kinde-auth-nextjs";

export async function GET() {
  const { getUser, getOrganization, getClaim, isAuthenticated } = getKindeServerSession();

  if (!(await isAuthenticated())) {
    return new Response("Unauthorized", { status: 401 });
  }

  const user = await getUser();
  const organization = await getOrganization();
  const roles = await getClaim("roles");

  return NextResponse.json({ user, organization, roles });
}