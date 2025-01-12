"use client";
import MediaCard from "@/components/MediaCard";
import Menu from "@/components/Menu";
import MusicTab from "@/components/MusicTab";
import SpotifyLogo from "@/components/SpotifyLogo";
import UserButton from "@/components/UserButton";
import {
  applyGradientFromAlbumImage,
  isDev,
  setDefaultSettings,
} from "@/helpers";
import { User } from "@/types/User";
import { useEffect, useState } from "react";

export default function Home() {
  const [accessToken, setAccessToken] = useState<string | null>(null);
  const [refreshToken, setRefreshToken] = useState<string | null>(null);
  const [tokenExpiry, setTokenExpiry] = useState<string | null>(null);
  const [isLoggedIn, setIsLoggedIn] = useState<boolean | null>(null);
  const [userProfile, setUserProfile] = useState<User | null>(null);
  const [recentlyPlayed, setRecentlyPlayed] = useState<any[]>([]);
  const [loadingSongs, setLoadingSongs] = useState<boolean>(false);
  const [loadingUser, setLoadingUser] = useState<boolean>(false);
  const [playlistIndex, setPlaylistIndex] = useState<number>(0);
  const [menuOpen, setMenuOpen] = useState<boolean>(false);
  const [dynamicBackground, setDynamicBackground] = useState<boolean>(true);
  const [getLatestSong, setGetLatestSong] = useState<boolean>(false);

  // Set up on initial page load
  useEffect(() => {
    setDefaultSettings();
    setDynamicBackground(localStorage.getItem("dynamicBackground") === "true");
    setGetLatestSong(localStorage.getItem("getLatestSong") === "true");
    setAccessToken(localStorage.getItem("spotifyAccessToken"));
    setRefreshToken(localStorage.getItem("spotifyRefreshToken"));
    setTokenExpiry(localStorage.getItem("spotifyTokenExpiry"));
  }, []);

  // Playlist change switches the background
  useEffect(() => {
    if (!dynamicBackground) return;
    if (recentlyPlayed.length > 0) {
      const albumImageUrl =
        recentlyPlayed[playlistIndex]?.track.album.images[0]?.url;
      if (albumImageUrl) {
        applyGradientFromAlbumImage(albumImageUrl);
      }
    }
  }, [playlistIndex, recentlyPlayed, dynamicBackground]);

  // Fetch user profile and recently played tracks
  useEffect(() => {
    const fetchData = async () => {
      const timeToRefresh = parseInt(tokenExpiry!) - Date.now();

      if (timeToRefresh <= 0) {
        const minutesExpired = timeToRefresh / -60000;
        if (minutesExpired > 60) {
          console.log(
            `Token expired ${(minutesExpired / 60).toFixed(1)} hour(s) ago. Refreshing...`,
          );
        } else {
          console.log(
            `Token expired ${minutesExpired.toFixed(0)} minutes ago. Refreshing...`,
          );
        }
        handleTokenRefresh()
          .then(() => fetchUserProfile())
          .then(() => fetchRecentlyPlayed())
          .then(() => setIsLoggedIn(true))
          .catch((error) => {
            console.error("Error during token refresh or data fetch:", error);
            handleLogout();
          });
      } else {
        console.log(
          `Time until next refresh: ${(timeToRefresh / 60000).toFixed(0)} minutes`,
        );
        fetchUserProfile()
          .then(() => fetchRecentlyPlayed())
          .then(() => setIsLoggedIn(true))
          .catch((error) => {
            console.error("Error during data fetch:", error);
            handleLogout();
          });
      }
    };
    if (accessToken && refreshToken && tokenExpiry) {
      fetchData();
    } else {
      setIsLoggedIn(false);
    }
  }, [accessToken, refreshToken, tokenExpiry]);

  const fetchUserProfile = async () => {
    setLoadingUser(true);
    try {
      const response = await fetch("https://api.spotify.com/v1/me", {
        headers: {
          Authorization: `Bearer ${accessToken}`,
        },
      });
      if (response.ok) {
        const data = await response.json();
        setUserProfile(data);
      } else {
        throw new Error("Failed to fetch user profile after retries");
      }
    } catch (error) {
      throw new Error("Tried fetching user profile");
    } finally {
      setLoadingUser(false);
    }
  };

  const fetchRecentlyPlayed = async () => {
    setLoadingSongs(true);
    try {
      const response = await fetch(
        `https://api.spotify.com/v1/me/player/recently-played?limit=25`,
        {
          headers: {
            Authorization: `Bearer ${accessToken}`,
          },
        },
      );
      if (response.ok) {
        const data = await response.json();
        setRecentlyPlayed(data.items); // All recently played tracks
        if (data.items.length > 0) {
          if (getLatestSong) {
            setPlaylistIndex(0); // Latest track
          } else {
            setPlaylistIndex(Math.floor(Math.random() * data.items.length)); // Random track to start with
          }
        } else {
          throw new Error(
            "Failed to fetch recently played tracks after retries",
          );
        }
      }
    } catch (error) {
      throw new Error("Tried fetching recently played tracks");
    } finally {
      setLoadingSongs(false);
    }
  };

  const handleTokenRefresh = async () => {
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

        const newExpiry = String(Date.now() + data.expires_in * 1000);

        localStorage.setItem("spotifyAccessToken", newAccessToken);
        setAccessToken(newAccessToken);

        localStorage.setItem("spotifyTokenExpiry", newExpiry);
        setTokenExpiry(newExpiry);

        console.log("Token refreshed successfully!", newAccessToken);
      } else {
        throw new Error("Error refreshing token");
      }
    } catch (error) {
      throw new Error("Error refreshing token");
    }
  };

  const handleLogin = () => {
    console.log("Logging in");

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
    console.log("Logging out");
    localStorage.removeItem("spotifyAccessToken");
    localStorage.removeItem("spotifyRefreshToken");
    localStorage.removeItem("spotifyTokenExpiry");
    setAccessToken(null);
    setRefreshToken(null);
    setTokenExpiry(null);
    setIsLoggedIn(false);
    setUserProfile(null);
    setRecentlyPlayed([]);
  };

  // Loading state
  if (isLoggedIn === null || loadingSongs || loadingUser) {
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
        toggleMenu={() => setMenuOpen((prev) => !prev)}
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
