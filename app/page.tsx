"use client";
import MediaCard from "@/components/MediaCard";
import Menu from "@/components/Menu";
import MusicTab from "@/components/MusicTab";
import SpotifyLogo from "@/components/SpotifyLogo";
import UserButton from "@/components/UserButton";
import {
  fetchRecentlyPlayed,
  fetchUserProfile,
  handleLogin,
  handleLogout,
  handleTokenRefresh,
  usePreviouslyFetchedData,
} from "@/helpers/client";
import {
  applyGradientFromAlbumImage,
  setDefaultSettings,
} from "@/helpers/utils";
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
  const [getLatestSong, setGetLatestSong] = useState<boolean>(false);

  // Set up on initial page load
  useEffect(() => {
    setDefaultSettings();

    const token = localStorage.getItem("spotifyAccessToken");
    const refresh = localStorage.getItem("spotifyRefreshToken");
    const expiry = localStorage.getItem("spotifyTokenExpiry");

    setDynamicBackground(localStorage.getItem("dynamicBackground") === "true");
    setGetLatestSong(localStorage.getItem("getLatestSong") === "true");

    const fetchData = async () => {
      setLoadingUser(true);
      setLoadingSongs(true);
      fetchUserProfile()
        .then((userProfileData) => {
          setUserProfile(userProfileData);
          return fetchRecentlyPlayed(getLatestSong);
        })
        .then((recentlyPlayedData) => {
          setRecentlyPlayed(recentlyPlayedData.recentlyPlayed);
          setPlaylistIndex(recentlyPlayedData.playlistIndex);
          setIsLoggedIn(true);
        })
        .catch((error) => {
          console.error("Error during data fetch:", error);
          usePreviouslyFetchedData(
            setIsLoggedIn,
            setUserProfile,
            setRecentlyPlayed,
          );

          console.log("Attempting to refresh token...");
          handleTokenRefresh();
        })
        .finally(() => {
          setLoadingSongs(false);
          setLoadingUser(false);
        });
    };

    if (token && refresh && expiry) {
      fetchData();
    } else {
      setIsLoggedIn(false);
    }
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

      {menuOpen && (
        <Menu
          handleLogout={() =>
            handleLogout(setIsLoggedIn, setUserProfile, setRecentlyPlayed)
          }
        />
      )}

      <MediaCard
        recentlyPlayed={recentlyPlayed}
        playlistIndex={playlistIndex}
        setPlaylistIndex={setPlaylistIndex}
      />

      <SpotifyLogo colour={`${dynamicBackground ? "white" : "green"}`} />
    </>
  );
}
