"use client";
import MediaCard from "@/components/MediaCard";
import Menu from "@/components/Menu";
import MusicTab from "@/components/MusicTab";
import SpotifyLogo from "@/components/SpotifyLogo";
import UserButton from "@/components/UserButton";
import { isDev } from "@/helpers/dev";
import { applyGradientFromAlbumImage } from "@/helpers/gradient";
import { setDefaultSettings } from "@/helpers/user";
import { User } from "@/types/User";
import { useEffect, useState } from "react";

export default function Home() {
  const [isLoggedIn, setIsLoggedIn] = useState<boolean | null>(null);
  const [userProfile, setUserProfile] = useState<User | null>(null);
  const [recentlyPlayed, setRecentlyPlayed] = useState<any[]>([]);
  const [loadingSongs, setLoadingSongs] = useState<boolean>(false);
  const [loadingUser, setLoadingUser] = useState<boolean>(false);
  const [playlistIndex, setPlaylistIndex] = useState<number>(0);
  const [menuOpen, setMenuOpen] = useState<boolean>(false);
  const [dynamicBackground, setDynamicBackground] = useState<boolean>(true);
  // const tokenRefreshInProgress = useRef(false);
  const [retries, setRetries] = useState(0);

  // Set up on initial page load
  useEffect(() => {
    setDefaultSettings();
    setDynamicBackground(localStorage.getItem("dynamicBackground") === "true");

    const getData = async () => {
      const token = localStorage.getItem("spotifyAccessToken");
      const refresh = localStorage.getItem("spotifyRefreshToken");
      const expiry = localStorage.getItem("spotifyTokenExpiry");

      if (token && refresh && expiry) {
        // Check if token has expired
        //console.log(Date.now(), parseInt(expiry));
        if (Date.now() > parseInt(expiry)) {
          console.log("Token expired. Refreshing...");
          const newToken = await handleTokenRefresh();
          if (newToken) {
            console.log(
              "Fetching user profile and recently played tracks with new token...",
            );
            await handleAuthenticatedFetch(newToken);
          }
        } else {
          console.log("Fetching user profile and recently played tracks...");
          await handleAuthenticatedFetch(token);
        }
      } else {
        handleLogout();
      }
    };

    getData().catch((error) => {
      console.error("Error during initial page load:", error);
      handleLogout();
    });
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

  useEffect(() => {
    if (retries > 5) {
      console.log("Too many retries. Logging out...");
      handleLogout();
    }
  }, [retries]);

  const handleAuthenticatedFetch = async (token: string) => {
    try {
      await fetchUserProfile(token);
      // await fetchRecentlyPlayed(token);
      setIsLoggedIn(true);
      console.log("Logged in successfully!");
    } catch (error) {
      console.error("Error during authenticated fetch:", error);
      handleLogout();
    }
  };

  const fetchUserProfile = async (token: string) => {
    setLoadingUser(true);
    try {
      const response = await fetch("https://api.spotify.com/v1/me", {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      if (response.ok) {
        const data = await response.json();
        setUserProfile(data);
        await fetchRecentlyPlayed(token);
      } else if (response.status === 401) {
        console.log(
          "Received 401 error while fetching user profile.\nRefreshing access token...",
        );
        const newToken = await handleTokenRefresh();
        if (newToken) {
          await fetchUserProfile(newToken);
          await fetchRecentlyPlayed(newToken);
        }
      } else {
        throw new Error("Error fetching user profile");
      }
    } catch (error) {
      throw new Error("Error fetching user profile");
    } finally {
      setLoadingUser(false);
    }
  };

  const fetchRecentlyPlayed = async (token: string) => {
    setLoadingSongs(true);
    try {
      const response = await fetch(
        `https://api.spotify.com/v1/me/player/recently-played?limit=25`, // limit=20 by default
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
          if (localStorage.getItem("getLatestSong") === "true") {
            setPlaylistIndex(0); // Latest track
          } else {
            setPlaylistIndex(Math.floor(Math.random() * data.items.length)); // Random track to start with
          }
        } else if (response.status === 401) {
          console.log(
            "401 error. not sure how this happened since it just worked for the fetchUserProfile",
          );
          // console.log("Received 401 error while fetching recently played tracks.\nRefreshing access token...");
          // // const newToken = await handleTokenRefresh();
          // const newToken = localStorage.getItem("spotifyAccessToken"); // We should have refreshed already from fetchUserProfile
          // console.log("New token:", newToken);
          // if (newToken) {
          //   await fetchRecentlyPlayed(newToken);
          // }
        } else {
          throw new Error("Error fetching recently played tracks");
        }
      }
    } catch (error) {
      console.error("error=", error);
      throw new Error("Error fetching recently played tracks");
    } finally {
      setLoadingSongs(false);
    }
  };

  const handleLogin = () => {
    // We shouldnt need to clear these here, but I am keeping these here just in case
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
    setRetries(0);
  };

  const handleTokenRefresh = async (): Promise<string | null> => {
    // if (tokenRefreshInProgress.current) return null;
    // tokenRefreshInProgress.current = true;

    const refreshToken = localStorage.getItem("spotifyRefreshToken");
    // Probably redundant
    if (!refreshToken) {
      console.log("No refresh token found in local storage. is this possible?");
      handleLogout();
      return null;
    }

    setRetries((prev) => prev + 1);

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
        // console.log("data", data);

        if (!newAccessToken) throw new Error("Invalid access token");

        localStorage.setItem("spotifyAccessToken", newAccessToken);

        // Reset expiry time to current time + new expiry time (which is 1 hour)
        localStorage.setItem(
          "spotifyTokenExpiry",
          String(Date.now() + data.expires_in * 1000),
        );

        console.log("Token refreshed successfully!", newAccessToken);
        return newAccessToken;
      } else {
        throw new Error("Error refreshing token");
      }
    } catch (error) {
      throw new Error("Error refreshing token");
    }
    // finally {
    //   tokenRefreshInProgress.current = false;
    //   console.log("handleTokenRefresh done");
    // }
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
