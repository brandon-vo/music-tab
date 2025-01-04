"use client";
import { useEffect, useRef, useState } from "react";
import MusicTab from "@/components/MusicTab";
import UserButton from "@/components/UserButton";
import Menu from "@/components/Menu";
import SpotifyLogo from "@/components/SpotifyLogo";
import MediaCard from "@/components/MediaCard";
import { applyGradientFromAlbumImage } from "@/helpers/gradient";
import { User } from "@/types/User";
import { setDefaultSettings } from "@/helpers/user";
import { isDev } from "@/helpers/dev";

export default function Home() {
  const [isLoggedIn, setIsLoggedIn] = useState<boolean | null>(null);
  const [userProfile, setUserProfile] = useState<User | null>(null);
  const [recentlyPlayed, setRecentlyPlayed] = useState<any[]>([]);
  const [loading, setLoading] = useState<boolean>(false);
  const [playlistIndex, setPlaylistIndex] = useState<number>(0);
  const [menuOpen, setMenuOpen] = useState<boolean>(false);
  const [dynamicBackground, setDynamicBackground] = useState<boolean>(true);
  const tokenRefreshInProgress = useRef(false);

  useEffect(() => {
    setDefaultSettings();

    setDynamicBackground(localStorage.getItem("dynamicBackground") === "true");

    const token = localStorage.getItem("spotifyAccessToken");
    const refresh = localStorage.getItem("spotifyRefreshToken");
    const expiry = localStorage.getItem("spotifyTokenExpiry");

    if (token && refresh && expiry) {
      // Check if token has expired
      if (Date.now() > parseInt(expiry)) {
        console.log("Token expired. Refreshing...");
        handleTokenRefresh();
        return;
      }
      fetchUserProfile(token);
      fetchRecentlyPlayed(token);
      setIsLoggedIn(true);
    } else {
      handleLogout();
    }
  }, []);

  useEffect(() => {
    if (recentlyPlayed.length > 0) {
      const albumImageUrl =
        recentlyPlayed[playlistIndex]?.track.album.images[0]?.url;
      if (albumImageUrl && dynamicBackground) {
        applyGradientFromAlbumImage(albumImageUrl);
      }
    }
  }, [playlistIndex, recentlyPlayed]);

  const toggleMenu = () => {
    setMenuOpen((prev) => !prev);
  };

  const fetchUserProfile = async (token: string) => {
    try {
      const response = await fetch("https://api.spotify.com/v1/me", {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      if (response.ok) {
        const data = await response.json();
        setUserProfile(data);
      } else if (response.status === 401) {
        await handleTokenRefresh();
      } else {
        console.error("Error fetching user profile: response=", response);
      }
    } catch (error) {
      console.error("Error fetching user profile: error=", error);
    }
  };

  const fetchRecentlyPlayed = async (token: string) => {
    setLoading(true);
    try {
      const response = await fetch(
        `https://api.spotify.com/v1/me/player/recently-played?limit=50`, // limit=20 by default
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        },
      );
      if (response.ok) {
        const data = await response.json();
        setRecentlyPlayed(data.items); // All recently played tracks
        if (data.items.length > 0) {
          if (localStorage.getItem("latestSongMode") === "true") {
            setPlaylistIndex(0); // Latest track
          } else {
            setPlaylistIndex(Math.floor(Math.random() * data.items.length)); // Random track to start with
          }
        } else if (response.status === 401) {
          await handleTokenRefresh();
        } else {
          console.error("Error fetching recently played tracks:", response);
        }
      }
    } catch (error) {
      console.error("Error fetching recently played tracks:", error);
    } finally {
      setLoading(false);
    }
  };

  const handleLogin = () => {
    // We shouldnt need to clear these here, but just in case
    localStorage.removeItem("spotifyAccessToken");
    localStorage.removeItem("spotifyRefreshToken");
    localStorage.removeItem("spotifyTokenExpiry");

    const clientID = "40006b94c67d48e9a0ab175351281474";

    const redirectURI = isDev()
      ? "http://localhost:3000/login"
      : "https://musictab.netlify.app/login";

    const scopes = [
      "user-read-private",
      "user-read-recently-played",
      "user-read-playback-position",
    ].join(" ");

    const spotifyAuthURL =
      `https://accounts.spotify.com/authorize` +
      `?client_id=${clientID}` +
      `&response_type=code` +
      `&redirect_uri=${encodeURIComponent(redirectURI)}` +
      `&scope=${encodeURIComponent(scopes)}` +
      `&show_dialog=true`;

    window.location.href = spotifyAuthURL;
  };

  const handleLogout = () => {
    localStorage.removeItem("spotifyAccessToken");
    localStorage.removeItem("spotifyRefreshToken");
    localStorage.removeItem("spotifyTokenExpiry");
    setIsLoggedIn(false);
    setUserProfile(null);
    setRecentlyPlayed([]);
  };

  const handleTokenRefresh = async () => {
    if (tokenRefreshInProgress.current) return;
    tokenRefreshInProgress.current = true;

    const refreshToken = localStorage.getItem("spotifyRefreshToken");
    // Probably redundant
    if (!refreshToken) {
      handleLogout();
      return;
    }

    try {
      const response = await fetch("/api", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ refresh_token: refreshToken }),
      });

      if (response.ok) {
        const data = await response.json();
        const newAccessToken = data.access_token;

        if (!newAccessToken) throw new Error("Invalid access token");

        localStorage.setItem("spotifyAccessToken", newAccessToken);

        // Reset expiry time
        localStorage.setItem(
          "spotifyTokenExpiry",
          String(Date.now() + data.expires_in * 1000),
        );

        await Promise.all([
          fetchUserProfile(newAccessToken),
          fetchRecentlyPlayed(newAccessToken),
        ]);

        setIsLoggedIn(true);
      } else {
        console.error("Error refreshing token: response=", response);
        handleLogout();
      }
    } catch (error) {
      console.error("Error refreshing token: error=", error);
      handleLogout();
    } finally {
      tokenRefreshInProgress.current = false;
    }
  };

  // Loading state
  if (isLoggedIn === null || loading) {
    return <MusicTab />;
  }

  if (!isLoggedIn) {
    return (
      <>
        <button
          className="absolute top-2.5 right-2.5 rounded-3xl text-bvWhite px-8 py-1.5 bg-spotify hover:bg-spotifyHover"
          onClick={handleLogin}
        >
          <span className="text-sm font-semibold">Login</span>
        </button>
        <MusicTab />
      </>
    );
  }

  return (
    <>
      <div
        id="background-overlay"
        className="fixed top-0 left-0 w-full h-full"
      />
      <UserButton
        userProfile={userProfile}
        toggleMenu={toggleMenu}
        menuOpen={menuOpen}
      />

      {menuOpen && <Menu handleLogout={handleLogout} />}

      <MediaCard
        recentlyPlayed={recentlyPlayed}
        playlistIndex={playlistIndex}
        setPlaylistIndex={setPlaylistIndex}
      />

      <SpotifyLogo colour={`${dynamicBackground ? "white" : "green"}`} />
    </>
  );
}
