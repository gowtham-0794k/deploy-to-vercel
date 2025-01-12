import { NextRequest, NextResponse } from "next/server";
import { postAxios } from "shared";
import { GET_TENENTS } from "shared/constants/routerUrls";

export async function GET(request: NextRequest) {
  const url = new URL(request.url);

  const domain = url.host;
  if (!domain) {
    return NextResponse.json({ error: "Domain is required" }, { status: 400 });
  }
  const organizationResponse = await postAxios({
    url: GET_TENENTS,
    values: {
      url: domain,
    },
  });
  const tenant = organizationResponse?.data;

  if (!tenant) {
    return NextResponse.json({ error: "Domain not found" }, { status: 404 });
  }

  return NextResponse.json(tenant);
}
