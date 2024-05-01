import api from '@/services/api.ts';

const VUE_APP_LASTFM_API_KEY = process.env.VUE_APP_LASTFM_API_KEY;

const ARTIST_NAME = "Taylor Swift";

export const getAlbumInfo = async (album: string, username: string) => {
  if (!username) {
    return {
      error: true,
      message: "Username cannot be null or undefined.",
    };
  }

  try {
    const response = await api.get(
      `/?method=album.getinfo&artist=${encodeURIComponent(ARTIST_NAME)}&album=${encodeURIComponent(album)}&user=${encodeURIComponent(username)}&api_key=${VUE_APP_LASTFM_API_KEY}&format=json`
    );

    if (response.data.album) {
      return {
        error: false,
        album: response.data.album,
      };
    } else {
      return {
        error: true,
        message: "User not found or album unavailable.",
      };
    }

  } catch (error) {
    return {
      error: true,
      message: error.response?.status === 404
        ? "User or album not found."
        : "Error fetching album information.",
    };
  }
};