"use client";

import Switch from "@/components/Switch";
import { ToggleSettingsLabels } from "@/constants/SettingsLabels";
import { ToggleSettingsType } from "@/types/Settings";
import Link from "next/link";
import { redirect } from "next/navigation";
import { useEffect, useState } from "react";

export default function Settings() {
  const [toggleSettings, setToggleSettings] = useState<ToggleSettingsType>({
    dynamicBackground: true,
    showCardBackground: true,
    showTrackNumber: false,
    getLatestSong: false,
    showAnimations: true,
  });
  const [minDuration, maxDuration] = [0, 2500];
  const [duration, setDuration] = useState(750);

  useEffect(() => {
    // redirect to login page if not logged in
    const token = localStorage.getItem("spotifyAccessToken");
    if (!token) {
      redirect("/");
    }

    const storedSettings = {
      dynamicBackground: localStorage.getItem("dynamicBackground") === "true",
      showCardBackground: localStorage.getItem("showCardBackground") === "true",
      showTrackNumber: localStorage.getItem("showTrackNumber") === "true",
      getLatestSong: localStorage.getItem("getLatestSong") === "true",
      showAnimations: localStorage.getItem("showAnimations") === "true",
    };

    const storedDuration = parseInt(
      localStorage.getItem("fadeInBackgroundDuration") || "750",
    );

    setToggleSettings(storedSettings);
    setDuration(storedDuration);
  }, []);

  const handleToggle = (settingKey: keyof ToggleSettingsType) => {
    const newSettings = {
      ...toggleSettings,
      [settingKey]: !toggleSettings[settingKey],
    };
    setToggleSettings(newSettings);
    localStorage.setItem(settingKey, String(newSettings[settingKey]));
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const newDuration = Math.max(
      minDuration,
      Math.min(maxDuration, parseInt(e.target.value)),
    );
    setDuration(newDuration);
    localStorage.setItem("fadeInBackgroundDuration", String(newDuration));
  };

  return (
    <div className="flex justify-center items-center h-dvh">
      <div className="transition-all bg-black/[.4] shadow-xl rounded-lg w-[90%] lg:w-[50%] xl:w-[40%] 2xl:w-[25%] min-w-[30vw] min-h-fit min-w-fit px-12 py-8">
        <div className="flex items-center justify-between border-b-[1px] border-bvLightGrey pb-2 mb-2">
          <h1>Settings</h1>
          <Link href="/">Go Back</Link>
        </div>
        {Object.entries(toggleSettings).map(([key, value]) => (
          <Switch
            key={key}
            isOn={value}
            handleToggle={() => handleToggle(key as keyof ToggleSettingsType)}
            label={ToggleSettingsLabels[key as keyof ToggleSettingsType]}
          />
        ))}
        <div className="flex flex-col gap-4 mt-2">
          <div className="flex justify-between">
            <span>Fade In Background</span>
            <span>{duration}ms</span>
          </div>
          <input
            className="
              appearance-none w-full h-2 bg-spotify rounded-lg
              focus:outline-none
              accent-white
              transition-all duration-300
            "
            type="range"
            step="50"
            min={minDuration}
            max={maxDuration}
            value={duration}
            onChange={handleChange}
          />
        </div>
      </div>
    </div>
  );
}
