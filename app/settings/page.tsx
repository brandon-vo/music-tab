"use client";

import Link from "next/link";
import { useEffect, useState } from "react";

export default function Settings() {
  const [dynamicBackground, setDynamicBackground] = useState<boolean>(true);
  const [showCardBackground, setShowCardBackground] = useState<boolean>(true);
  const [showTrackNumber, setShowTrackNumber] = useState<boolean>(false);
  const [showAnimations, setShowAnimations] = useState<boolean>(true);

  useEffect(() => {
    // redirect to login page if not logged in
    const token = localStorage.getItem("spotifyAccessToken");
    if (!token) {
      window.location.href = "/";
    }

    const dynamicBg = localStorage.getItem("dynamicBackground") === "true";
    const showCardBackground =
      localStorage.getItem("showCardBackground") === "true";
    const trackNumber = localStorage.getItem("showTrackNumber") === "true";
    const animations = localStorage.getItem("showAnimations") === "true";

    setDynamicBackground(dynamicBg);
    setShowCardBackground(showCardBackground);
    setShowTrackNumber(trackNumber);
    setShowAnimations(animations);
  }, []);

  const toggleDynamicBackground = () => {
    const newValue = !dynamicBackground;
    setDynamicBackground(!dynamicBackground);
    localStorage.setItem("dynamicBackground", String(newValue));
  };

  const toggleShowCardBackground = () => {
    const newValue = !showCardBackground;
    setShowCardBackground(!showCardBackground);
    localStorage.setItem("showCardBackground", String(newValue));
  };

  const toggleShowTrackNumber = () => {
    const newValue = !showTrackNumber;
    setShowTrackNumber(!showTrackNumber);
    localStorage.setItem("showTrackNumber", String(newValue));
  };

  const toggleShowAnimations = () => {
    const newValue = !showAnimations;
    setShowAnimations(!showAnimations);
    localStorage.setItem("showAnimations", String(newValue));
  };

  return (
    <div className="flex justify-center items-center h-dvh">
      <div className="transition-all bg-black/[.5] shadow-xl rounded-lg w-[90%] lg:w-[30%] h-[50%] min-h-fit min-w-fit px-8 py-6 md:px-12 md:py-8">
        <div className="flex items-center justify-between border-b-[1px] border-bvLightGrey pb-2 mb-2">
          <h1>Settings</h1>
          <Link href="/">Go Back</Link>
        </div>
        <div className="flex justify-between items-center py-2">
          <span>Dynamic Background</span>
          <button
            className={`${dynamicBackground ? "bg-spotify hover:bg-spotifyHover" : "bg-bvLightGrey hover:bg-bvGrey"}`}
            onClick={toggleDynamicBackground}
          >
            {dynamicBackground ? "Enabled" : "Disabled"}
          </button>
        </div>
        <div className="flex justify-between items-center py-2">
          <span>Show Card Background</span>
          <button
            className={`${showCardBackground ? "bg-spotify hover:bg-spotifyHover" : "bg-bvLightGrey hover:bg-bvGrey"}`}
            onClick={toggleShowCardBackground}
          >
            {showCardBackground ? "Enabled" : "Disabled"}
          </button>
        </div>
        <div className="flex justify-between items-center py-2">
          <span>Show Track Number</span>
          <button
            className={`${showTrackNumber ? "bg-spotify hover:bg-spotifyHover" : "bg-bvLightGrey hover:bg-bvGrey"}`}
            onClick={toggleShowTrackNumber}
          >
            {showTrackNumber ? "Enabled" : "Disabled"}
          </button>
        </div>
        <div className="flex justify-between items-center py-2">
          <span>Show Animations</span>
          <button
            className={`${showAnimations ? "bg-spotify hover:bg-spotifyHover" : "bg-bvLightGrey hover:bg-bvGrey"}`}
            onClick={toggleShowAnimations}
          >
            {showAnimations ? "Enabled" : "Disabled"}
          </button>
        </div>
      </div>
    </div>
  );
}
