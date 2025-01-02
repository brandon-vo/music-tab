import { NextResponse } from "next/server";

async function exchangeCodeForTokens(code: string) {
  const clientID = process.env.SPOTIFY_CLIENT_ID!;
  const clientSecret = process.env.SPOTIFY_CLIENT_SECRET!;
  const redirectURI = process.env.SPOTIFY_REDIRECT_URI!;

  const basicAuth = Buffer.from(`${clientID}:${clientSecret}`).toString(
    "base64",
  );

  const tokenResponse = await fetch("https://accounts.spotify.com/api/token", {
    method: "POST",
    headers: {
      Authorization: `Basic ${basicAuth}`,
      "Content-Type": "application/x-www-form-urlencoded",
    },
    body: new URLSearchParams({
      grant_type: "authorization_code",
      code: code,
      redirect_uri: redirectURI,
    }),
  });

  if (!tokenResponse.ok) {
    const error = await tokenResponse.json();
    throw new Error(`Token exchange failed: ${error.error_description}`);
  }

  const tokenData = await tokenResponse.json();
  return tokenData;
}

async function refreshAccessToken(refreshToken: string) {
  const clientID = process.env.SPOTIFY_CLIENT_ID!;
  const clientSecret = process.env.SPOTIFY_CLIENT_SECRET!;

  const basicAuth = Buffer.from(`${clientID}:${clientSecret}`).toString(
    "base64",
  );

  const refreshResponse = await fetch(
    "https://accounts.spotify.com/api/token",
    {
      method: "POST",
      headers: {
        Authorization: `Basic ${basicAuth}`,
        "Content-Type": "application/x-www-form-urlencoded",
      },
      body: new URLSearchParams({
        grant_type: "refresh_token",
        refresh_token: refreshToken,
      }),
    },
  );

  if (!refreshResponse.ok) {
    const error = await refreshResponse.json();
    throw new Error(`Token refresh failed: ${error.error_description}`);
  }

  const refreshData = await refreshResponse.json();
  return refreshData;
}

export async function POST(request: Request) {
  const { code, refresh_token } = await request.json();

  if (!code && !refresh_token) {
    return NextResponse.json(
      { error: "Authorization code or refresh token is required" },
      { status: 400 },
    );
  }

  try {
    if (code) {
      const tokenData = await exchangeCodeForTokens(code);
      return NextResponse.json(tokenData);
    }

    if (refresh_token) {
      const newTokens = await refreshAccessToken(refresh_token);
      return NextResponse.json(newTokens);
    }
  } catch (error) {
    return NextResponse.json({ error: error }, { status: 500 });
  }
}
