const audioContext = new AudioContext();
const audioElement = document.querySelector(".Audio");

const playButton = document.querySelector(".Controls__Button--play-pause");
const backButton = document.querySelector(".Controls__Button--back");
const forwardButton = document.querySelector(".Controls__Button--forward");
const volumeControl = document.querySelector(".VolumeControl");
const songTitle = document.querySelector(".SongTitle");
const cover = document.querySelector(".Cover");

const track = audioContext.createMediaElementSource(audioElement);
const gainNode = audioContext.createGain();

track.connect(gainNode).connect(audioContext.destination);

const songs = ["hey", "summer", "ukulele"];
let songIndex = 0;

function loadSong(songName) {
  audioElement.src = `./music/${songName}.mp3`;
  songTitle.textContent = songName;
  cover.src = `./img/${songName}.jpg`;
}

playButton.addEventListener("click", (e) => {
  // check if context is in suspended state (autoplay policy)
  if (audioContext.state === "suspended") {
    audioContext.resume();
  }

  // play or pause track depending on state
  if (e.target.dataset.playing === "false") {
    audioElement.play();
    e.target.dataset.playing = "true";
    e.target.querySelector("img").src = "./svg/pause-solid.svg";
    cover.classList.add("Cover--rotate");
  } else if (e.target.dataset.playing === "true") {
    audioElement.pause();
    e.target.dataset.playing = "false";
    e.target.querySelector("img").src = "./svg/play-solid.svg";
    cover.classList.remove("Cover--rotate");
  }
});

backButton.addEventListener("click", () => {
  songIndex -= 1;
  if (songIndex === -1) songIndex = 2;
  loadSong(songs[songIndex]);
});

forwardButton.addEventListener("click", () => {
  songIndex = (songIndex + 1) % songs.length;
  loadSong(songs[songIndex]);
});

audioElement.addEventListener("ended", (e) => {
  playButton.dataset.playing = "false";
  e.target.querySelector("img").src = "./svg/play-solid.svg";
  cover.classList.remove("Cover--rotate");
});

volumeControl.addEventListener("input", (e) => {
  gainNode.gain.value = e.target.value;
});

loadSong(songs[songIndex]);
