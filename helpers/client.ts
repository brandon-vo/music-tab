import { isDev } from "./utils";

export const handleTokenRefresh = async () => {
  try {
    const response = await fetch("/api", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        refresh_token: localStorage.getItem("spotifyRefreshToken"),
      }),
    });

    if (response.ok) {
      const data = await response.json();
      const newAccessToken = data.access_token;

      if (!newAccessToken) throw new Error("Invalid access token");

      if (newAccessToken === localStorage.getItem("spotifyAccessToken")) {
        console.log("Somehow got the same token after refreshing... ???");
      } else {
        const newExpiry = String(Date.now() + data.expires_in * 1000);
        localStorage.setItem("spotifyTokenExpiry", newExpiry);

        localStorage.setItem("spotifyAccessToken", newAccessToken);
        console.log("Token refreshed successfully!", newAccessToken);
      }
    } else {
      throw new Error("Error refreshing token");
    }
  } catch (error) {
    throw new Error("Error refreshing token");
  }
};

const checkTokenExpiry = async () => {
  const expiry = localStorage.getItem("spotifyTokenExpiry");
  const timeToRefresh = parseInt(expiry!) - Date.now();
  if (timeToRefresh <= 0) {
    const minutesExpired = timeToRefresh / -60000;
    if (minutesExpired > 60) {
      console.log(
        `Token expired ${(minutesExpired / 60).toFixed(1)} hour(s) ago. Refreshing...`,
      );
    } else {
      console.log(
        `Token expired ${minutesExpired.toFixed(0)} minutes ago. Refreshing...`,
      );
    }
    await handleTokenRefresh();
  } else {
    console.log(
      `Time until next refresh: ${(timeToRefresh / 60000).toFixed(0)} minutes`,
    );
  }
};

export const fetchUserProfile = async () => {
  await checkTokenExpiry();

  const token = localStorage.getItem("spotifyAccessToken");
  try {
    const response = await fetch("https://api.spotify.com/v1/me", {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });
    if (response.ok) {
      const data = await response.json();
      localStorage.setItem("userProfile", JSON.stringify(data));
      return data;
    } else {
      throw new Error("Failed to fetch user profile");
    }
  } catch (error) {
    throw new Error("Tried fetching user profile");
  }
};

export const fetchRecentlyPlayed = async (getLatestSong: boolean) => {
  const token = localStorage.getItem("spotifyAccessToken");
  try {
    const response = await fetch(
      `https://api.spotify.com/v1/me/player/recently-played?limit=25`,
      {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      },
    );
    if (response.ok) {
      const data = await response.json();
      localStorage.setItem("recentlyPlayed", JSON.stringify(data.items)); // All recently played tracks
      return {
        recentlyPlayed: data.items,
        playlistIndex: getLatestSong
          ? 0
          : Math.floor(Math.random() * data.items.length),
      };
    } else {
      throw new Error("Failed to fetch recently played tracks");
    }
  } catch (error) {
    throw error;
  }
};

export const usePreviouslyFetchedData = (
  setIsLoggedIn: React.Dispatch<React.SetStateAction<boolean | null>>,
  setUserProfile: React.Dispatch<React.SetStateAction<any>>,
  setRecentlyPlayed: React.Dispatch<React.SetStateAction<any[]>>,
) => {
  console.log("Using previously fetched data...");

  setUserProfile(JSON.parse(localStorage.getItem("userProfile")!));
  setRecentlyPlayed(JSON.parse(localStorage.getItem("recentlyPlayed")!));
  setIsLoggedIn(true);
};

export const handleLogin = () => {
  console.log("Logging in");

  const clientID = "40006b94c67d48e9a0ab175351281474";
  const redirectURI = isDev()
    ? "http://localhost:3000/login"
    : "https://musictab.netlify.app/login";
  const scopes = [
    "user-read-private",
    "user-read-recently-played",
    "user-read-playback-position",
  ].join(" ");

  const spotifyAuthURL =
    `https://accounts.spotify.com/authorize` +
    `?client_id=${clientID}` +
    `&response_type=code` +
    `&redirect_uri=${encodeURIComponent(redirectURI)}` +
    `&scope=${encodeURIComponent(scopes)}` +
    `&show_dialog=true`;

  window.location.href = spotifyAuthURL;
};

export const handleLogout = (
  setIsLoggedIn: React.Dispatch<React.SetStateAction<boolean | null>>,
  setUserProfile: React.Dispatch<React.SetStateAction<any>>,
  setRecentlyPlayed: React.Dispatch<React.SetStateAction<any[]>>,
) => {
  console.log("Logging out");

  // Clear local storage
  localStorage.removeItem("spotifyAccessToken");
  localStorage.removeItem("spotifyRefreshToken");
  localStorage.removeItem("spotifyTokenExpiry");
  localStorage.removeItem("userProfile");
  localStorage.removeItem("recentlyPlayed");

  // Reset state in the component
  setIsLoggedIn(false);
  setUserProfile(null);
  setRecentlyPlayed([]);
};
