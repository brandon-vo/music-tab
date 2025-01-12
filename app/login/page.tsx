"use client";

import { isDev } from "@/helpers";
import { useRouter } from "next/navigation";
import { useEffect } from "react";

export default function Login() {
  const router = useRouter();

  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    const code = params.get("code");

    if (code) {
      fetch("/api", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ code }),
      })
        .then((response) => {
          if (!response.ok) {
            console.error("Failed to login. response=", response);
          }
          return response.json();
        })
        .then((data) => {
          isDev() && console.log("Logged in:", data);
          localStorage.setItem("spotifyAccessToken", data.access_token);
          localStorage.setItem("spotifyRefreshToken", data.refresh_token);
          localStorage.setItem(
            "spotifyTokenExpiry",
            String(Date.now() + data.expires_in * 1000),
          );
          router.push("/");
        })
        .catch((error) => {
          console.error("Failed to login", error);
        });
    } else {
      console.error("Authorization code not found");
    }
  }, [router]);

  return (
    <div className="flex justify-center items-center h-dvh">
      <h1>Logging in...</h1>
    </div>
  );
}
