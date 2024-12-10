"use server";
import { v4 as uuidv4 } from "uuid";

const CLIENT_ID = process.env.Next_CLIENT_ID;
const CLIENT_SECRET = process.env.Next_CLIENT_SECRET;
const REDIRECT_URI = process.env.Next_REDIRECT_URI;
const AUTH_URL = "https://auth.noones.com/oauth2/authorize";
const TOKEN_URL = "https://auth.noones.com/oauth2/token";

export const generateAuthUrl = async (scopes: string[]) => {
  console.log(AUTH_URL, { CLIENT_ID });
  const state = uuidv4();
  const url = new URL(AUTH_URL);
  url.searchParams.append("client_id", CLIENT_ID as string);
  url.searchParams.append("redirect_uri", REDIRECT_URI as string);
  url.searchParams.append("response_type", "code");
  url.searchParams.append("scope", scopes.join(" "));
  url.searchParams.append("state", state);

  return url.toString();
};

export const exchangeCodeForToken = async (code: string) => {
  console.log(TOKEN_URL);
  const response = await fetch(TOKEN_URL, {
    method: "POST",
    headers: {
      "Content-Type": "application/x-www-form-urlencoded",
    },
    body: new URLSearchParams({
      grant_type: "authorization_code" as string,
      client_id: CLIENT_ID as string,
      client_secret: CLIENT_SECRET as string,
      redirect_uri: REDIRECT_URI as string,
      code,
    }),
  });

  if (!response.ok) {
    throw new Error("Failed to exchange code for token");
  }

  return response.json();
};