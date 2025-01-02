import { Vibrant } from "node-vibrant/browser";

let firstLoad = true;

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
      overlay.style.background = gradientPattern;

      if (firstLoad) {
        setTimeout(() => {
          overlay.style.opacity = "1";
          firstLoad = false;
        }, 500);
      }
    }
  } catch (err) {
    console.error("Error extracting colors:", err);
  }
};
