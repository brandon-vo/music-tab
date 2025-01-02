interface SpotifyLogoProps {
  colour?: string;
}

const SpotifyLogo = ({ colour = "white" }: SpotifyLogoProps) => {
  return (
    <a href="http://www.spotify.com" target="_blank">
      <img
        className="absolute w-[80px] bottom-8 md:bottom-16 left-0 right-0 my-0 mx-auto select-none scale-80 md:scale-90 lg:scale-100 transiiton"
        src={`images/spotify_logo_${colour}.png`}
        alt="Spotify"
      />
    </a>
  );
};

export default SpotifyLogo;
