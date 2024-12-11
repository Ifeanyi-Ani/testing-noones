import { NextResponse, NextRequest } from "next/server";

const CLIENT_ID = process.env.CLIENT_ID;
const CLIENT_SECRET = process.env.SECRET_ID;
const REDIRECT_URI = process.env.REDIRECT_URI;
// const AUTH_URL = "https://auth.noones.com/oauth2/authorize";
const TOKEN_URL = "https://auth.noones.com/oauth2/token";

export async function GET(request: NextRequest) {
  const searchParams = request.nextUrl.searchParams;
  const code = searchParams.get("code");
  const storeState = request.cookies.get("oauth_state")?.value;

  if (!code || !storeState) {
    return NextResponse.redirect(
      "/error?message=Invalid state or missing code",
    );
  }

  try {
    const tokenResponse = await fetch(TOKEN_URL, {
      method: "POST",
      headers: {
        "Content-Type": "application/x-www-form-urlencoded",
      },
      body: new URLSearchParams({
        grant_type: "authorization_code",
        client_id: CLIENT_ID!,
        client_secret: CLIENT_SECRET!,
        redirect_uri: REDIRECT_URI!,
        code,
      }),
    });

    if (!tokenResponse.ok) {
      throw new Error("Failed to exchange code for token");
    }
    const data = await tokenResponse.json();
    const response = NextResponse.redirect("/");
    response.cookies.set("access_token", data.access_token, {
      httpOnly: true,
      secure: true,
      sameSite: "strict",
      maxAge: data.expires_in,
    });
  } catch (error) {
    console.error("Error exchanging code for token", error);
    return NextResponse.redirect("/error?message=Failed to authenticate");
  }
}
