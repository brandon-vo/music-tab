export const fetchUserProfile = async (token: string) => {
  try {
    const response = await fetch("https://api.spotify.com/v1/me", {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });
    if (response.ok) {
      const data = await response.json();
      return data;
    } else if (response.status === 401) {
      throw new Error("Unauthorized");
    }
  } catch (error) {
    console.error("Error fetching user profile:", error);
    throw error;
  }
};

export const fetchRecentlyPlayed = async (token: string) => {
  try {
    const response = await fetch(
      "https://api.spotify.com/v1/me/player/recently-played",
      {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      },
    );
    if (response.ok) {
      const data = await response.json();
      return data.items; // Recently played tracks
    } else if (response.status === 401) {
      throw new Error("Unauthorized");
    }
  } catch (error) {
    console.error("Error fetching recently played tracks:", error);
    throw error;
  }
};
