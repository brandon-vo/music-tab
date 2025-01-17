import { Vibrant } from "node-vibrant/browser";

export const applyGradientFromAlbumImage = async (imgSrc: string) => {
  try {
    const palette = await Vibrant.from(imgSrc).getPalette();
    const muted = palette.Muted?.hex || "#181818";
    const lightMuted = palette.LightMuted?.hex || "#181818";
    const darkMuted = palette.DarkMuted?.hex || "#181818";
    const vibrant = palette.Vibrant?.hex || "#181818";
    const lightVibrant = palette.LightVibrant?.hex || "#181818";
    const darkVibrant = palette.DarkVibrant?.hex || "#181818";

    const stops =
      Math.random() > 0.5
        ? Math.random() > 0.5
          ? [`${lightMuted} 0%`, `${muted} 50%`, `${darkVibrant} 100%`]
          : [`${lightVibrant} 0%`, `${vibrant} 50%`, `${darkMuted} 100%`]
        : Math.random() > 0.5
          ? [`${lightVibrant} 0%`, `${vibrant} 50%`, `${darkVibrant} 100%`]
          : [`${lightMuted} 0%`, `${muted} 50%`, `${darkMuted} 100%`];

    const gradientType =
      Math.random() > 0.5 ? "linear-gradient" : "radial-gradient";
    const randomAngle = Math.floor(Math.random() * 360);

    const gradientPattern =
      gradientType === "linear-gradient"
        ? `${gradientType}(${randomAngle}deg, ${stops.join(", ")})`
        : `${gradientType}(circle, ${stops.join(", ")})`;

    const overlay = document.getElementById("background-overlay");
    if (overlay) {
      const duration = parseInt(
        localStorage.getItem("fadeInBackgroundDuration") || "750",
      );
      overlay.style.background = gradientPattern;
      overlay.style.transition = `opacity ${duration / 1000}s ease-out`;

      setTimeout(() => {
        overlay.style.opacity = "1";
      }, duration);
    }
  } catch (err) {
    console.error("Error extracting colors:", err);
  }
};

export const isDev = () => {
  return window.location.hostname === "localhost";
};

export const sleep = (ms: number) =>
  new Promise((resolve) => setTimeout(resolve, ms));

export const setDefaultSettings = () => {
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
  if (!localStorage.getItem("getLatestSong")) {
    localStorage.setItem("getLatestSong", "false");
  }
  if (!localStorage.getItem("fadeInBackgroundDuration")) {
    localStorage.setItem("fadeInBackgroundDuration", "750");
  }
};
