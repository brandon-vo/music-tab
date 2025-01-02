import { applyGradientFromAlbumImage } from "@/helpers/gradient";
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
  return (
    <div className="flex justify-center items-center flex-col h-screen translate-y-[-8%] scale-80 md:scale-85 lg:scale-100 transition-all">
      <div className="flex flex-col justify-center items-center bg-black/[.5] shadow-xl rounded-sm max-w-[300px]">
        <img
          src={recentlyPlayed[playlistIndex]?.track.album.images[0]?.url}
          alt={recentlyPlayed[playlistIndex]?.track.album.name}
          className="w-[300px] h-[300px] select-none rounded-tr-sm"
        />
        <div className="flex flex-col justify-center items-center py-3">
          <a
            className="text-center px-3 hover:underline"
            href={recentlyPlayed[playlistIndex]?.track.external_urls.spotify}
            target="_blank"
          >
            <span className="text-[1rem]">
              {recentlyPlayed[playlistIndex]?.track.name}
            </span>
          </a>
          <span className="text-[0.7rem] text-bvLightGrey">
            {recentlyPlayed[playlistIndex]?.track.artists[0]?.name}
          </span>

          <div
            id="mediaControl"
            className="flex justify-center items-center gap-4 py-1 rounded-md"
          >
            <TbPlayerTrackPrevFilled
              className="w-[30px] h-[30px] text-bvGrey hover:scale-110"
              onClick={() =>
                setPlaylistIndex((prev) =>
                  prev === 0 ? recentlyPlayed.length - 1 : prev - 1,
                )
              }
            />
            <IoRefreshCircleSharp
              className="w-[30px] h-[30px] text-bvLightGrey hover:scale-110"
              onClick={() =>
                applyGradientFromAlbumImage(
                  recentlyPlayed[playlistIndex]?.track.album.images[0]?.url,
                )
              }
            />
            <TbPlayerTrackNextFilled
              className="w-[30px] h-[30px] text-bvGrey hover:scale-110"
              onClick={() =>
                setPlaylistIndex((prev) =>
                  prev === recentlyPlayed.length - 1 ? 0 : prev + 1,
                )
              }
            />
          </div>
        </div>
      </div>
    </div>
  );
};

export default MediaCard;
