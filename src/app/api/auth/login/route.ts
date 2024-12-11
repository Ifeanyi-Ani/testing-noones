import { NextResponse } from "next/server";
import { v4 as uuidv4 } from "uuid";

const CLIENT_ID = process.env.CLIENT_ID;
const REDIRECT_URI = process.env.REDIRECT_URI;
const AUTH_URL = "https://auth.noones.com/oauth2/authorize";

export async function GET() {
  const state = uuidv4();
  const url = new URL(AUTH_URL);
  url.searchParams.append("response_type", "code");
  url.searchParams.append("client_id", CLIENT_ID as string);
  url.searchParams.append("redirect_uri", REDIRECT_URI as string);
  url.searchParams.append("scope", "trade.create trade.read");

  const response = NextResponse.redirect(url.toString());
  response.cookies.set("oauth_state", state, { httpOnly: true, secure: true });

  return response;
}
