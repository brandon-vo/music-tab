"use client";
import { useEffect, useState } from "react";
import MusicTab from "@/components/MusicTab";
import UserButton from "@/components/UserButton";
import Menu from "@/components/Menu";
import SpotifyLogo from "@/components/SpotifyLogo";
import MediaCard from "@/components/MediaCard";
import { applyGradientFromAlbumImage } from "@/helpers/gradient";
import { User } from "@/types/User";
import { gothamBook } from "@/constants/fonts";

export default function Home() {
  const [isLoggedIn, setIsLoggedIn] = useState<boolean | null>(null);
  const [userProfile, setUserProfile] = useState<User | null>(null);
  const [recentlyPlayed, setRecentlyPlayed] = useState<any[]>([]);
  const [loading, setLoading] = useState<boolean>(false);
  const [playlistIndex, setPlaylistIndex] = useState<number>(0);
  const [menuOpen, setMenuOpen] = useState<boolean>(false);
  const [dynamicBackground, setDynamicBackground] = useState<boolean>(true);

  useEffect(() => {
    // Default values for settings
    if (!localStorage.getItem("dynamicBackground")) {
      localStorage.setItem("dynamicBackground", "true");
    }
    if (!localStorage.getItem("showCardBackground")) {
      localStorage.setItem("showCardBackground", "true");
    }
    if (!localStorage.getItem("showTrackNumber")) {
      localStorage.setItem("showTrackNumber", "false");
    }
    if (!localStorage.getItem("showAnimations")) {
      localStorage.setItem("showAnimations", "true");
    }

    const token = localStorage.getItem("spotifyAccessToken");
    const refresh = localStorage.getItem("spotifyRefreshToken");

    if (localStorage.getItem("dynamicBackground") === "false") {
      setDynamicBackground(false);
    }

    if (token && refresh) {
      fetchUserProfile(token);
      fetchRecentlyPlayed(token);
      setIsLoggedIn(true);
    } else {
      setIsLoggedIn(false);
    }
  }, []);

  useEffect(() => {
    // console.log(userProfile);
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
      }
    } catch (error) {
      console.error("Error fetching user profile:", error);
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
        setRecentlyPlayed(data.items);
        if (data.items.length > 0) {
          setPlaylistIndex(Math.floor(Math.random() * data.items.length));
        }
      } else if (response.status === 401) {
        await handleTokenRefresh();
      }
    } catch (error) {
      console.error("Error fetching recently played tracks:", error);
    } finally {
      setLoading(false);
    }
  };

  const handleLogin = () => {
    const clientID = "40006b94c67d48e9a0ab175351281474";
    // const redirectURI = "http://localhost:3000/login"; // TODO: Update redirect URI
    const redirectURI = "https://musictab.netlify.app/login";
    const scopes = [
      "user-read-private",
      "user-read-recently-played",
      "user-read-playback-position",
    ].join(" ");

    const spotifyAuthURL =
      `https://accounts.spotify.com/authorize` +
      "?client_id=" +
      clientID +
      "&response_type=code" +
      "&redirect_uri=" +
      encodeURI(redirectURI) +
      "&scope=" +
      scopes;

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
    const refreshToken = localStorage.getItem("spotifyRefreshToken");
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
        localStorage.setItem("spotifyAccessToken", newAccessToken);
        fetchUserProfile(newAccessToken);
        fetchRecentlyPlayed(newAccessToken);
      } else {
        handleLogout();
      }
    } catch (error) {
      console.error("Error refreshing token:", error);
      handleLogout();
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
          <span className={`text-sm font-semibold ${gothamBook.className}`}>
            Login
          </span>
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
