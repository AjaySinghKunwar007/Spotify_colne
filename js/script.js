let currentSong = new Audio();
let songs;
let currFolder;

function formatTime(seconds) {
  // if(isNan(seconds) || seconds < 0){
  //   return "00:00 / 00:00";
  // }
  // Round down to the nearest whole number
  const roundedSeconds = Math.floor(seconds);

  // Calculate minutes and remaining seconds
  const minutes = Math.floor(roundedSeconds / 60);
  const remainingSeconds = roundedSeconds % 60;

  // Pad with leading zeros if necessary
  const formattedMinutes = String(minutes).padStart(2, "0");
  const formattedSeconds = String(remainingSeconds).padStart(2, "0");

  // Return in mm:ss format
  return `${formattedMinutes}:${formattedSeconds}`;
}

async function getSongs(folder) {
  currFolder=folder;
  let a = await fetch(`/${folder}/`);
  let response = await a.text();

  let div = document.createElement("div");
  div.innerHTML = response;
  let as = div.getElementsByTagName("a");
  songs = []; 
  for (let i = 0; i < as.length; i++) {
    const element = as[i];
    if (element.href.endsWith(".mp3")) {
      songs.push(element.href.split(`/${folder}/`)[1]);
    }
  }

 //show all the songs in the playlist

 let songUL = document
 .querySelector(".songList")
 .getElementsByTagName("ul")[0];
 songUL.innerHTML='';
for (const song of songs) {
 songUL.innerHTML =
   songUL.innerHTML +
   `<li><img class="invert" src="img/music.svg" alt="">
           <div class="info">
             <div>${song.replaceAll("%20", " ")}</div>
             <div>Ajay</div>
           </div>
           <div class="playnow">
             <span>Play Now</span>
             <img class="invert" src="img/play.svg" alt="">
           </div></li>`;
}
// play the first song

// Attaching an event listener to each songs

Array.from(
 document.querySelector(".songList").getElementsByTagName("li")
).forEach((e) => {
 e.addEventListener("click", (element) => {
   playMusic(e.querySelector(".info").firstElementChild.innerHTML.trim());
   play.src = "img/pause.svg";
 });
});



return songs;

}
getSongs('songs/Angry_(mood)');

const playMusic = (track, pause = false) => {
  // let audio = new Audio("/songs/"+track);
  currentSong.src = `/${currFolder}/` + track;
  if (!pause) {
    currentSong.play();
    play.src = "img/pause.svg";
  }
  document.querySelector(".songinfo").innerHTML = decodeURI(track);
  document.querySelector(".songtime").innerHTML = "00:00 / 00:00";
};



async function displayAlbums() {
  let a = await fetch(`/songs/`);
  let response = await a.text();

  let div = document.createElement("div");
  div.innerHTML = response;
  let anchor =div.getElementsByTagName('a');
  let cardContainer= document.querySelector(".cardContainer");
let array =Array.from(anchor);
for(let index=0;index < array.length;index++){

  const e= array[index];
  
    if(e.href.includes('/songs/')&& !e.href.includes(".htaccess")){
      // let folder = e.href.split("/").slice(-1)[0];
      let folder = decodeURIComponent(e.href.split("/").filter(part => part !== "").slice(-1)[0]);

    

      // get the metadata of the folder
      let a = await fetch(`/songs/${folder}/info.json`);
     
      let response = await a.json();
      cardContainer.innerHTML=cardContainer.innerHTML+`<div data-folder="${folder}" class="card">
              <div class="play">
                <svg
                  class="pl-1"
                  xmlns="http://www.w3.org/2000/svg"
                  data-encore-id="icon"
                  role="img"
                  aria-hidden="true"
                  viewBox="0 0 24 24"
                  class="Svg-sc-ytk21e-0 bneLcE"
                >
                  <path
                    d="m7.05 3.606 13.49 7.788a.7.7 0 0 1 0 1.212L7.05 20.394A.7.7 0 0 1 6 19.788V4.212a.7.7 0 0 1 1.05-.606z"
                  ></path>
                </svg>
              </div>
              <img
                src="/songs/${folder}/cover.jpg"
                alt=""
              />
              <h3 style="letter-spacing: 1px">${response.title}</h3>
              <p class="disc">
                ${response.description}
              </p>
            </div>`
    }
  }
  // load the playlist whenever the card is clicked

Array.from(document.getElementsByClassName('card')).forEach(e=>{
  e.addEventListener('click',async item=>{
  songs =await getSongs(`songs/${item.currentTarget.dataset.folder}`)
  playMusic(songs[0]);
  })
})

}





async function main() {
  // gets the list of all the songs
  await getSongs('songs/Angry_(mood)');

  // sets  a default song to the player
  playMusic(songs[0], true);

 
// display all the albums on the page
displayAlbums();



  //  attaching event listeners to play , previous,next

  play.addEventListener("click", () => {
    if (currentSong.paused) {
      currentSong.play();
      play.src = "img/pause.svg";
    } else {
      currentSong.pause();
      play.src = "img/play.svg";
    }
  });

  // listen to time update event
  currentSong.addEventListener("timeupdate", () => {
    document.querySelector(".songtime").innerHTML = `${formatTime(
      currentSong.currentTime
    )} / ${formatTime(currentSong.duration)}`;
    document.querySelector(".circle").style.left = `${
      (currentSong.currentTime / currentSong.duration) * 100
    }%`;
  });
  // add event listner to the seekbar
  document.querySelector(".seekbar").addEventListener("click", (e) => {
    let percent = (e.offsetX / e.target.getBoundingClientRect().width) * 100;
    document.querySelector(".circle").style.left = percent + "%";
    currentSong.currentTime = (currentSong.duration * percent) / 100;
  });
  // add eventlistner to hamburger
  document.querySelector(".hamburger").addEventListener("click", () => {
    document.querySelector(".left").style.left = 0;
  });

  // add an eventlistner to closebutton
  document.querySelector(".close").addEventListener("click", () => {
    document.querySelector(".left").style.left = -120 + "%";
  });
  // add eventlistners to prev and next
  previous.addEventListener("click", () => {
    let index = songs.indexOf(currentSong.src.split("/").slice(-1)[0]);
    if (index - 1 > -1) {
      playMusic(songs[index - 1]);
    }
  });
  next.addEventListener("click", () => {
    let index = songs.indexOf(currentSong.src.split("/").slice(-1)[0]);
    if (index + 1 < songs.length) {
      playMusic(songs[index + 1]);
    }
  });

  //add an event to volume
document.querySelector(".range").getElementsByTagName('input')[0].addEventListener('change',(e)=>{
currentSong.volume = parseInt(e.target.value)/100;
if(currentSong.volume>0){
  document.querySelector(".volume>img").src= document.querySelector(".volume>img").src.replace("mute.svg","volume.svg");
}
})
//for textting git hub

// add eventlistner to mute the track

document.querySelector(".volume >img").addEventListener('click',(e)=>{
 
 if (e.target.src.includes("volume.svg")){
  e.target.src = e.target.src.replace("volume.svg","mute.svg");
  currentSong.volume=0;
  document.querySelector(".range").getElementsByTagName('input')[0].value=0;
}
else{
  
  e.target.src = e.target.src.replace("mute.svg","volume.svg");
  currentSong.volume=.3;
  document.querySelector(".range").getElementsByTagName('input')[0].value=25;
 }
})


}
main();
