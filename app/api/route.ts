import { NextResponse } from "next/server";

export async function POST(request: Request) {
  const { code } = await request.json();

  if (!code) {
    return NextResponse.json(
      { error: "Authorization code is required" },
      { status: 400 },
    );
  }

  const clientID = process.env.SPOTIFY_CLIENT_ID!;
  const clientSecret = process.env.SPOTIFY_CLIENT_SECRET!;
  const redirectURI = process.env.SPOTIFY_REDIRECT_URI!;

  const basicAuth = Buffer.from(`${clientID}:${clientSecret}`).toString(
    "base64",
  );

  try {
    const tokenResponse = await fetch(
      "https://accounts.spotify.com/api/token",
      {
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
      },
    );

    if (!tokenResponse.ok) {
      const error = await tokenResponse.json();
      return NextResponse.json({ error }, { status: tokenResponse.status });
    }

    const tokenData = await tokenResponse.json();
    console.log("Token data", tokenData);
    return NextResponse.json(tokenData);
  } catch (error) {
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 },
    );
  }
}
