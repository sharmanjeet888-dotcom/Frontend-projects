let currSong = null
const audio = new Audio()
let songs = []
let currIndex = -1;
let icon = document.querySelector(".changeIcon");
let playBar = document.querySelector(".playbar");
let cross = document.querySelector(".cross");

const leftTime = document.querySelector(".leftTime");
const rightTime = document.querySelector(".rightTime");
const seekbar = document.getElementById("seekbar");

const tooltipTime = document.querySelector(".tooltipTime")

const nextSongbtn = document.querySelector(".nextSong")
const prevSongbtn = document.querySelector(".prevSong")




function updateSeekbar(hoverPercent = null) {

    if (!audio.duration) return;

    const playedPercent = (audio.currentTime / audio.duration) * 100;

    if (hoverPercent !== null && hoverPercent > playedPercent) {

        seekbar.style.background = `
        linear-gradient(to right,
            rgb(0,132,255) 0%,
            rgb(0,132,255) ${playedPercent}%,

            #000000 ${playedPercent}%,
            #000000 ${hoverPercent}%,

            grey ${hoverPercent}%,
            grey 100%)
        `;

    } else {

        seekbar.style.background = `
        linear-gradient(to right,
            rgb(0,132,255) 0%,
            rgb(0,132,255) ${playedPercent}%,
            grey ${playedPercent}%,
            grey 100%)
        `;
    }
}

function highlightSong (index) {
    const items = document.querySelectorAll(".songsList li")

    items.forEach(item => {
        item.style.backgroundColor =  ""
    });

    items[index].style.backgroundColor = "#2E2E2E4"


}

function formatTime(seconds) {
    let min = Math.floor(seconds / 60)
    let sec = Math.floor(seconds % 60)

    return `${min}:${sec.toString().padStart(2, "0")}`

}

async function getSongs() {
    let a = await fetch("http://127.0.0.1:5500/songs/")
    let response = await a.text()
    let div = document.createElement("div")

    div.innerHTML = response

    let as = div.getElementsByTagName("a")
    

    for (let index = 0; index < as.length; index++) {
        const element = as[index];

        if (element.href.endsWith(".mp3")) {
            songs.push(element.href)
        }
    }
    return songs
}


function setUpEventListners() {
    icon.addEventListener("click", () => {
        console.log("icon clciked")
        console.log("currSong:", currSong);
        console.log("paused:", audio.paused);


        if (!currSong) return;

        if (audio.paused) {
            audio.play()
            icon.src = "icons/pause-stroke-rounded.svg"
        } else {
            audio.pause()
            icon.src = "icons/play-stroke-rounded (1).svg"
        }
    })

    cross.addEventListener("click", () => {
        playBar.style.display = "none"
        audio.pause()
        currSong = null
    })

    audio.addEventListener("loadedmetadata", () => {
        rightTime.textContent = formatTime(audio.duration)
    })

    audio.addEventListener("timeupdate", () => {

        if (!audio.duration) return;

        leftTime.textContent = formatTime(audio.currentTime);

        seekbar.value = (audio.currentTime / audio.duration) * 100;

        updateSeekbar(hoverPercent);

    });

    seekbar.addEventListener("input", () => {
        audio.currentTime = (seekbar.value / 100) * audio.duration
    })

    audio.addEventListener("ended", () => {
        audio.currentTime = 0;
        seekbar.value = 0;

        leftTime.textContent = "0:00";
        icon.src = "icons/play-stroke-rounded (1).svg";
    })

    seekbar.addEventListener("mouseenter", () => {
        tooltipTime.style.display = "block"
    })
    seekbar.addEventListener("mouseleave", () => {
        tooltipTime.style.display = "none"
        hoverPercent = null;
        updateSeekbar()

    })


   seekbar.addEventListener("mousemove", (e) => {

    const rect = seekbar.getBoundingClientRect();
    const x = e.clientX - rect.left;

    tooltipTime.style.left = `${x}px`;

    const percent = x / rect.width;

    hoverPercent = percent * 100;

    updateSeekbar(hoverPercent);

    const preview = percent * audio.duration;

    tooltipTime.textContent = formatTime(preview);

})

    nextSongbtn.addEventListener("click",() => {
        if(currIndex === -1) return;
        currIndex++;

        if(currIndex < songs.length ) {
            playMusic(songs[currIndex])
            highlightSong(currIndex);
        }
        
    })

    prevSongbtn.addEventListener("click",() => {
        if(currIndex === -1) return;
        currIndex--;

        if(currIndex > -1 ) {
            playMusic(songs[currIndex])
            highlightSong(currIndex);
        }
        
    })


}

function playMusic(song) {

    if (currSong === song) {
        if (audio.paused) {
            audio.play();
            icon.src = "icons/pause-stroke-rounded.svg";

        } else {
            audio.pause()
            icon.src = "icons/play-stroke-rounded (1).svg";
        }

        return;
    }

    currSong = song;
    audio.src = song;
    audio.play()
    icon.src = "icons/pause-stroke-rounded.svg";
    playBar.style.display = "flex"
}


function displaySongs(songs) {
    let songul = document.querySelector(".songsList ul")

    for (let i = 0; i < songs.length; i++ ) {
        let li = document.createElement("li")
        let name = decodeURIComponent(songs[i].split("/").pop())
            .replace(/\([^)]*\)/g, "")
            .replace(/\[[^\]]*\]/g, "")
            .replace(/\.[^/.]+$/, "")
            .trim()


        li.innerHTML = `<img  class="invert" src="icons/music-note-03-stroke-rounded.svg" alt="">
                            <div class="info">
                                <div class="songName">${name}</div>
                                <div class="artistName">Unknown artist</div>
                            </div>
                            <div class="playIcons">
                                <img  style="height: 19px; width: 19px;"  class="invert opacity" src="icons/play-list-add-stroke-rounded.svg" alt="">
                                <img style="height: 20px; width: 20px;"  class="invert" src="icons/download-02-stroke-rounded.svg" alt="">
                            </div>`

        songul.append(li)

        li.addEventListener("click", () => {

            
            playMusic(songs[i])
            currIndex = i;
            highlightSong(currIndex);

        })
    }
}



async function main() {
    songs = await getSongs()
    displaySongs(songs)
    setUpEventListners()

}

main()