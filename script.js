const audioContext = new AudioContext();
const audioElement = document.querySelector(".Audio");

const playButton = document.querySelector(".Controls__Button--play-pause");
const backButton = document.querySelector(".Controls__Button--back");
const forwardButton = document.querySelector(".Controls__Button--forward");
const volumeControl = document.querySelector(".VolumeControl");
const songTitle = document.querySelector(".SongTitle");
const cover = document.querySelector(".Cover");
const progressBar = document.querySelector(".ProgressBar");
const progressBarCurrentProgress = document.querySelector(".ProgressBar__CurrentProgress");

const track = audioContext.createMediaElementSource(audioElement);
const gainNode = audioContext.createGain();
gainNode.gain.value = volumeControl.value;

track.connect(gainNode).connect(audioContext.destination);

const songs = ["hey", "summer", "ukulele"];
let songIndex = 0;
let timeOut;
let currentRotation = 0;

function updateProgress() {
  if (playButton.dataset.playing === "false") return;
  const progressRate = audioElement.currentTime / audioElement.duration || 0;
  progressBarCurrentProgress.style.transform = `scale(${progressRate}, 1)`;
  currentRotation += 20;
  cover.style.transform = `rotate(${currentRotation}deg)`;
  clearTimeout(timeOut);
  timeOut = setTimeout(updateProgress, 250);
}

function loadSong(songName) {
  audioElement.src = `./music/${songName}.mp3`;
  songTitle.textContent = songName;
  cover.src = `./img/${songName}.jpg`;
}

function playSong() {
  audioElement.play();
  cover.classList.add("Cover--rotate");

  updateProgress();
}

function pauseSong() {
  audioElement.pause();
  cover.classList.remove("Cover--rotate");
}

playButton.addEventListener("click", (e) => {
  // check if context is in suspended state (autoplay policy)
  if (audioContext.state === "suspended") {
    audioContext.resume();
  }

  // play or pause track depending on state
  if (e.target.dataset.playing === "false") {
    e.target.dataset.playing = "true";
    e.target.querySelector("img").src = "./svg/pause-solid.svg";
    playSong();
  } else if (e.target.dataset.playing === "true") {
    e.target.dataset.playing = "false";
    e.target.querySelector("img").src = "./svg/play-solid.svg";
    pauseSong();
  }
});

backButton.addEventListener("click", () => {
  songIndex -= 1;
  if (songIndex === -1) songIndex = 2;
  loadSong(songs[songIndex]);
  playSong();
});

forwardButton.addEventListener("click", () => {
  songIndex = (songIndex + 1) % songs.length;
  loadSong(songs[songIndex]);
  playSong();
});

progressBar.addEventListener("click", (e) => {
  const clickedProgressRate = e.offsetX / e.target.offsetWidth;
  audioElement.currentTime = audioElement.duration * clickedProgressRate;
  updateProgress();
});

audioElement.addEventListener("ended", () => {
  playButton.dataset.playing = "false";
  playButton.querySelector("img").src = "./svg/play-solid.svg";
  cover.classList.remove("Cover--rotate");
});

volumeControl.addEventListener("input", (e) => {
  gainNode.gain.value = e.target.value;
});

loadSong(songs[songIndex]);
