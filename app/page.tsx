"use client";
import MusicTab from "@/components/MusicTab";
import { gothamMedium } from "@/constants/fonts";
import { fetchRecentlyPlayed, fetchUserProfile } from "@/helpers/spotifyAPI";
import { useEffect, useState } from "react";
import { IoRefreshCircleSharp } from "react-icons/io5";
import {
  TbPlayerTrackPrevFilled,
  TbPlayerTrackNextFilled,
} from "react-icons/tb";
import { FaCaretDown } from "react-icons/fa";

export default function Home() {
  const [isLoggedIn, setIsLoggedIn] = useState<boolean | null>(null);
  const [user, setUser] = useState<any | null>(null);
  const [recentlyPlayed, setRecentlyPlayed] = useState<any[]>([]);
  const [loading, setLoading] = useState<boolean>(false);

  useEffect(() => {
    const token = localStorage.getItem("spotifyAccessToken");
    if (token) {
      setIsLoggedIn(true);
      fetchRecentlyPlayedData(token);
      fetchUserProfileData(token);
    } else {
      setIsLoggedIn(false);
    }
  }, []);

  const fetchUserProfileData = async (token: string) => {
    const data = await fetchUserProfile(token);
    if (data && !data.error) {
      setUser(data);
    } else {
      handleLogout();
    }
  };

  const fetchRecentlyPlayedData = async (token: string) => {
    setLoading(true);
    const data = await fetchRecentlyPlayed(token);
    if (data && !data.error) {
      setRecentlyPlayed(data);
    } else {
      handleLogout();
    }
    setLoading(false);
  };

  const handleLogin = () => {
    const clientID = "40006b94c67d48e9a0ab175351281474";
    const redirectURI = "http://localhost:3000/login"; // TODO: Update redirect URI
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
    setIsLoggedIn(false);
    setRecentlyPlayed([]);
  };

  if (isLoggedIn === null) {
    return <MusicTab />;
  }

  if (!isLoggedIn) {
    return (
      <>
        <button
          className="absolute top-2.5 right-2.5 rounded-3xl text-white px-8 py-1.5 bg-spotify hover:bg-spotifyHover"
          onClick={handleLogin}
        >
          <span className="text-sm">Login</span>
        </button>
        <MusicTab />
      </>
    );
  }

  return (
    <>
      <button className="absolute top-2.5 right-2.5 flex justify-center rounded-3xl text-white px-8 py-1.5">
        <img
          src={user?.images[0]?.url}
          alt={user?.display_name}
          className="w-[28px] h-[28px] rounded-[20px] absolute left-[4px]"
        />
        <span className={`${gothamMedium.className} pl-[13px]`}>
          {user?.display_name}
        </span>
        <FaCaretDown className="text-sm w-[20px] h-[20px] absolute right-[4px] bottom-[5px]" />
      </button>
      <div className="flex justify-center items-center flex-col h-screen translate-y-[-8%]">
        <img
          src={recentlyPlayed[0]?.track.album.images[0]?.url}
          alt={recentlyPlayed[0]?.track.album.name}
          className="w-[300px] h-[300px] pb-[5px] shadow-album"
        />
        <a
          className="focus:underline"
          href={recentlyPlayed[0]?.track.external_urls.spotify}
          target="_blank"
        >
          <span className="text-[1rem]">{recentlyPlayed[0]?.track.name}</span>
        </a>
        <span className="text-[0.7rem] text-bv-dark-grey">
          {recentlyPlayed[0]?.track.artists[0]?.name}
        </span>
        {/* refresh */}

        <div
          id="mediaControl"
          className="flex justify-center items-center mt-4 gap-4"
        >
          <TbPlayerTrackPrevFilled
            className="w-[30px] h-[30px] bg-bv-dark-grey"
            onClick={() => alert("prev")}
          />
          <IoRefreshCircleSharp
            className="w-[30px] h-[30px]"
            onClick={() => alert("refresh")}
          />
          <TbPlayerTrackNextFilled
            className="w-[30px] h-[30px]"
            onClick={() => alert("next")}
          />
        </div>
      </div>

      <a className="" href="http://www.spotify.com" target="_blank">
        <img
          className="absolute w-[80px] bottom-16 left-0 right-0 my-0 mx-auto"
          src="images/spotify_logo_green.png"
          alt="Spotify"
        />
      </a>
    </>
  );
}
