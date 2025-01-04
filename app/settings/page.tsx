"use client";

import Switch from "@/components/Switch";
import { SettingsLabels } from "@/constants/SettingsLabels";
import { SettingsType } from "@/types/Settings";
import Link from "next/link";
import { redirect } from "next/navigation";
import { useEffect, useState } from "react";

export default function Settings() {
  const [settings, setSettings] = useState<SettingsType>({
    dynamicBackground: true,
    showCardBackground: true,
    showTrackNumber: false,
    showAnimations: true,
    getLatestSong: false,
  });

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
      showAnimations: localStorage.getItem("showAnimations") === "true",
      getLatestSong: localStorage.getItem("latestSongMode") === "true",
    };

    setSettings(storedSettings);
  }, []);

  const handleToggle = (settingKey: keyof SettingsType) => {
    const newSettings = { ...settings, [settingKey]: !settings[settingKey] };
    setSettings(newSettings);
    localStorage.setItem(settingKey, String(newSettings[settingKey]));
  };

  return (
    <div className="flex justify-center items-center h-dvh">
      <div className="transition-all bg-black/[.5] shadow-xl rounded-lg w-[90%] lg:w-[30%] h-[50%] min-h-fit min-w-fit px-8 py-6 md:px-12 md:py-8">
        <div className="flex items-center justify-between border-b-[1px] border-bvLightGrey pb-2 mb-2">
          <h1>Settings</h1>
          <Link href="/">Go Back</Link>
        </div>
        {Object.entries(settings).map(([key, value]) => (
          <Switch
            key={key}
            isOn={value}
            handleToggle={() => handleToggle(key as keyof SettingsType)}
            label={SettingsLabels[key as keyof SettingsType]}
          />
        ))}
      </div>
    </div>
  );
}
