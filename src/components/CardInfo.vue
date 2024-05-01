<template>
  <div class="card">
    <h2 class="welcome-title">Welcome to The Tortured Poets Department!</h2>
    <input
      type="text"
      v-model="username"
      placeholder="Enter your Last.fm username"
      @keyup.enter="fetchAlbumStats"
      class="fancy-input"
    />

    <div class="spacing"></div>

    <button class="fancy-button" @click="fetchAlbumStats">See album stats</button>

    <div v-if="errorMessage" class="error-message">
      <span>{{ errorMessage }}</span>
    </div>

    <div ref="cardContent">
      <div v-if="customMessage && !errorMessage" class="custom-message">
        <p>{{ customMessage[0] }}</p>
        <p>{{ customMessage[1] }}</p>
      </div>
    </div>

    <div v-if="showSpotify" class="spotify-content">
      <iframe style="border-radius:12px"
        src="https://open.spotify.com/embed/album/5H7ixXZfsNMGbIE5OBSpcb?utm_source=generator"
        width="100%"
        height="80"
        frameBorder="0"
        allowfullscreen=""
        allow="autoplay; clipboard-write; encrypted-media; fullscreen; picture-in-picture"
        loading="lazy">
      </iframe>
    </div>

    <div v-if="showSaveButtons" class="save-buttons">
      <button class="fancy-button" @click="saveCardAsImage">Save as Image</button>
      <button class="fancy-button" @click="shareOnTwitter">Tweet</button>
    </div>
  </div>
  <footer class="footer">
    <a href="https://github.com/dev-aclara" target="_blank" class="github-link">
      Visit my GitHub profile: dev-aclara
    </a>
  </footer>
</template>

<script>
import { ref } from 'vue';
import html2canvas from 'html2canvas';
import { getAlbumInfo } from '@/services/lastfmService.ts';

const ALBUM_STANDARD = "The Tortured Poets Department";
const ALBUM_ANTHOLOGY = "The Tortured Poets Department: The Anthology";

export default {
  setup() {
    const username = ref(null);
    const errorMessage = ref(null);
    const customMessage = ref(null);
    const showSpotify = ref(false);
    const showSaveButtons = ref(false);
    const cardContent = ref(null);

    const fetchAlbumStats = async () => {
      errorMessage.value = null;
      customMessage.value = null;
      showSpotify.value = false;
      showSaveButtons.value = false;

      if (!username.value) {
        errorMessage.value = "Please enter a valid Last.fm username.";
        return;
      }

      try {
        const album1 = await getAlbumInfo(ALBUM_STANDARD, username.value);
        const album2 = await getAlbumInfo(ALBUM_ANTHOLOGY, username.value);

        if (album1.error || album2.error) {
          errorMessage.value = "User or albums not found. Please check the username and try again.";
          return;
        }

        const album1Playcount = album1.album.userplaycount || 0;
        const album2Playcount = album2.album.userplaycount || 0;

        if (album1Playcount + album2Playcount === 0) {
          errorMessage.value = "The user has no activity in these albums.";
          return;
        }

        const totalPlaycount = album1Playcount + album2Playcount;

        const randomTrack = album1.album.tracks.track[Math.floor(Math.random() * album1.album.tracks.track.length)];

        customMessage.value = [
          `You listened to 'The Anthology' and 'The Tortured Poets Department' a total of ${totalPlaycount} times.`,
          `The suggested song for you is '${randomTrack.name}'!`
        ];

        showSpotify.value = true;
        showSaveButtons.value = true;

      } catch (error) {
        errorMessage.value = error.response?.status === 404
          ? "User or albums not found. Please check the username and try again."
          : "An error occurred while fetching album information. Please try again later.";
      }
    };

    const saveCardAsImage = () => {
      if (cardContent.value) {
        html2canvas(cardContent.value).then((canvas) => {
          const link = document.createElement("a");
          link.download = "music_card.png";
          link.href = canvas.toDataURL();
          link.click();
        });
      }
    };

    const shareOnTwitter = () => {
      if (customMessage.value && customMessage.value.length > 0) {
        const firstMessage = customMessage.value[0];
        const playCountMatch = firstMessage.match(/total of (\d+) times/);

        if (playCountMatch && playCountMatch[1]) {
          const playCountText = playCountMatch[1];
          const tweetText = encodeURIComponent(`I listened 'The Tortured Poets Department' a total of ${playCountText} times. #TTPD`);
          window.open(`https://twitter.com/intent/tweet?text=${tweetText}`, "_blank");
        } else {
          console.error("Could not find play count in customMessage.");
        }
      }
    };

    return { username, errorMessage, customMessage, fetchAlbumStats, showSpotify, showSaveButtons, cardContent, saveCardAsImage, shareOnTwitter };
  }
};
</script>

<style scoped>
.card {
  padding: 40px;
  border-radius: 8px;
  max-width: 400px;
  margin: 20px auto;
  display: flex;
  flex-direction: column;
}

.welcome-title {
  font-size: 24px;
  font-family: 'Times New Roman', serif;
  color: white;
  margin-bottom: 20px;
}

.spacing {
  height: 10px;
}

.fancy-input {
  border: 2px solid #aaa;
  padding: 10px;
  border-radius: 6px;
  font-family: 'Courier New', Courier, monospace;
  background-color: #f9f9f9;
  transition: all 0.3s ease;
}

.fancy-input:focus {
  border-color: #888;
}

.fancy-button {
  background-color: #555;
  color: white;
  border-radius: 6px;
  padding: 10px 15px;
  border: none;
  cursor: pointer;
  transition: background-color 0.3s ease;
}

.fancy-button:hover {
  background-color: #333;
}

.error-message {
  color: red;
  font-weight: bold;
  margin-top: 10px;
}

.custom-message {
  color: #3e3e3e;
  background-color: #f1f1f1;
  padding: 10px;
  border: 2px sólido #ccc;
  border-radius: 6px;
  font-size: 16px;
  margin-top: 10px;
}

.spotify-content {
  margin-top: 20px;
  margin-bottom: 20px;
}

.save-buttons {
  display: flex;
  gap: 10px;
  flex-wrap: wrap;
}

.footer {
  position: fixed;
  bottom: 0;
  left: 0;
  width: 100%;
  background-color: #333;
  padding: 10px 0;
  text-align: center;
}

.github-link {
  color: #888;
  text-decoration: underline;
  cursor: pointer;
  font-size: 16px;
}
</style>