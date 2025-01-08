import { NextRequest, NextResponse } from "next/server";
import { postAxios } from "shared";
import { GET_TENENTS } from "shared/constants/routerUrls";

export async function GET(request: NextRequest) {
  // Use the URL from the request to get search params
  const { searchParams } = new URL(request.url);
  const domain = searchParams.get("domain")?.toLowerCase();
  if (!domain) {
    return NextResponse.json({ error: "Domain is required" }, { status: 400 });
  }
  const organizationResponse = await postAxios({
    url: GET_TENENTS,
    values: {
      domainName: domain,
    },
  });
  const tenant = organizationResponse?.data;

  if (!tenant) {
    return NextResponse.json({ error: "Tenant not found" }, { status: 404 });
  }

  return NextResponse.json(tenant);
}
