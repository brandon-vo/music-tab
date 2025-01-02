import { applyGradientFromAlbumImage } from "@/helpers/gradient";
import { use, useEffect, useState } from "react";
import { IoRefreshCircleSharp } from "react-icons/io5";
import {
  TbPlayerTrackNextFilled,
  TbPlayerTrackPrevFilled,
} from "react-icons/tb";

interface MediaCardProps {
  recentlyPlayed: any[];
  playlistIndex: number;
  setPlaylistIndex: React.Dispatch<React.SetStateAction<number>>;
}

const MediaCard = ({
  recentlyPlayed,
  playlistIndex,
  setPlaylistIndex,
}: MediaCardProps) => {
  const [trackName, setTrackName] = useState(
    recentlyPlayed[playlistIndex]?.track.name,
  );
  const [titleFontSize, setTitleFontSize] = useState("text-[1rem]");
  const [showCardBackground, setShowCardBackground] = useState<boolean>(
    localStorage.getItem("showCardBackground") === "true",
  );
  const [showTrackNumber, setShowTrackNumber] = useState<boolean>(
    localStorage.getItem("showTrackNumber") === "true",
  );
  const [showAnimations, setShowAnimations] = useState<boolean>(
    localStorage.getItem("showAnimations") === "true",
  );
  const [dynamicBackground, setDynamicBackground] = useState<boolean>(
    localStorage.getItem("dynamicBackground") === "true",
  );
  const [swipeDirection, setSwipeDirection] = useState<string | null>(null);
  const [isAnimating, setIsAnimating] = useState(false);

  useEffect(() => {
    const trackNameLength = trackName?.length;
    if (trackName && trackNameLength > 30) {
      setTitleFontSize("text-sm");
    }
    if (trackName && trackNameLength > 65) {
      setTrackName(trackName.slice(0, 65) + "...");
    }
  }, []);

  useEffect(() => {
    setTrackName(recentlyPlayed[playlistIndex]?.track.name);
  }, [playlistIndex]);

  const handleSwipe = (direction: "prev" | "next") => {
    if (!showAnimations) {
      setPlaylistIndex((prev) =>
        direction === "prev"
          ? prev === 0
            ? recentlyPlayed.length - 1
            : prev - 1
          : prev === recentlyPlayed.length - 1
            ? 0
            : prev + 1,
      );
      return;
    }
    if (isAnimating) return;
    if (!dynamicBackground) document.body.style.background = "#181818";
    setSwipeDirection(direction);
    setIsAnimating(true);

    setTimeout(() => {
      setSwipeDirection(null);
      setPlaylistIndex((prev) =>
        direction === "prev"
          ? prev === 0
            ? recentlyPlayed.length - 1
            : prev - 1
          : prev === recentlyPlayed.length - 1
            ? 0
            : prev + 1,
      );
      setIsAnimating(false);
    }, 400);
  };

  return (
    <div className="flex justify-center items-center flex-col h-dvh translate-y-[-8%] scale-80 sm:scale-85 md:scale-90 lg:scale-100 xl:scale-110 transition-all">
      <div
        className={`relative flex flex-col justify-center items-center ${!showCardBackground ? "bg-transparent" : "bg-black/[.5] shadow-xl"} rounded-lg max-w-[300px]`}
      >
        <div
          className={`relative w-[300px] h-[300px] overflow-hidden rounded-t-lg ${!showCardBackground && "rounded-b-lg"}`}
        >
          <img
            src={recentlyPlayed[playlistIndex]?.track.album.images[0]?.url}
            alt={recentlyPlayed[playlistIndex]?.track.album.name}
            className={`absolute w-full h-full object-cover rounded-t-lg ${!showCardBackground && "rounded-b-lg"} transition-transform duration-400 
              ${
                swipeDirection === "prev"
                  ? "animate-swipeOutRight"
                  : swipeDirection === "next"
                    ? "animate-swipeOutLeft"
                    : "opacity-100"
              }`}
          />
          {swipeDirection && (
            <img
              src={
                recentlyPlayed[
                  swipeDirection === "prev"
                    ? (playlistIndex === 0
                        ? recentlyPlayed.length
                        : playlistIndex) - 1
                    : (playlistIndex + 1) % recentlyPlayed.length
                ]?.track.album.images[0]?.url
              }
              alt="Next Image"
              className={`absolute w-full h-full object-cover rounded-t-lg ${!showCardBackground && "rounded-b-lg"} transition-transform duration-400 
                ${
                  swipeDirection === "prev"
                    ? "animate-swipeInRight"
                    : "animate-swipeInLeft"
                }`}
            />
          )}
        </div>

        <div className="flex flex-col justify-center items-center py-2">
          <a
            id="trackName"
            className={`text-bvWhite drop-shadow-lg text-center ${trackName?.length > 30 ? "px-2" : "px-3"} hover:underline`}
            href={recentlyPlayed[playlistIndex]?.track.external_urls.spotify}
            target="_blank"
          >
            <span className={`${titleFontSize}`}>{trackName}</span>
          </a>
          <span
            className={`text-[0.7rem] ${!showCardBackground ? "text-bvWhite drop-shadow-md" : "text-bvLightGrey"}`}
          >
            {recentlyPlayed[playlistIndex]?.track.artists[0]?.name}
          </span>

          <div
            id="mediaControl"
            className="flex justify-center items-center gap-4 py-2 rounded-md"
          >
            <TbPlayerTrackPrevFilled
              className={`w-[30px] h-[30px] ${!showCardBackground ? "text-bvWhite drop-shadow-md" : "text-bvGrey"} hover:scale-110 active:scale-95 transition duration-50`}
              onClick={() => handleSwipe("prev")}
            />
            <IoRefreshCircleSharp
              className={`w-[30px] h-[30px] ${!showCardBackground ? "text-bvWhite drop-shadow-md" : "text-bvLightGrey"} hover:scale-110 active:scale-95 transition duration-50`}
              onClick={() =>
                applyGradientFromAlbumImage(
                  recentlyPlayed[playlistIndex]?.track.album.images[0]?.url,
                )
              }
            />
            <TbPlayerTrackNextFilled
              className={`w-[30px] h-[30px] ${!showCardBackground ? "text-bvWhite drop-shadow-md" : "text-bvGrey"} hover:scale-110 active:scale-95 transition duration-50`}
              onClick={() => handleSwipe("next")}
            />
          </div>
          {showTrackNumber && (
            <span
              className={`absolute ${!showCardBackground ? "text-bvWhite drop-shadow-md" : "text-bvLightGrey"} text-[0.7rem] bottom-1 right-2 select-none`}
            >
              {playlistIndex + 1}/{recentlyPlayed.length}
            </span>
          )}
        </div>
      </div>
    </div>
  );
};

export default MediaCard;
