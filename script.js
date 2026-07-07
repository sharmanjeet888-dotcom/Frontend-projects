console.log("helo")

let currSong = null
const audio = new Audio()
let icon = document.querySelector(".changeIcon");
const playBar = document.querySelector(".playbar");

async function getSongs() {
    let a = await fetch("http://127.0.0.1:5500/songs/")
    let response = await a.text()
    let div = document.createElement("div")

    div.innerHTML = response

    let as = div.getElementsByTagName("a")
    let songs = []

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


        if(!currSong) return;

        if(audio.paused) {
            audio.play()
            icon.src = "icons/pause-stroke-rounded.svg"
        } else {
            audio.pause()
            icon.src = "icons/play-stroke-rounded (1).svg"
        }

    })
}



function displaySongs(songs) {
    let songul = document.querySelector(".songsList ul")

    for(const song of songs) {
        let li = document.createElement("li")
        let name = decodeURIComponent(song.split("/").pop())
            .replace(/\([^)]*\)/g, "")
            .replace(/\[[^\]]*\]/g, "")
            .replace(/\.[^/.]+$/, "") 
            .trim()


        li.innerHTML = `<img  class="invert" src="icons/music-note-03-stroke-rounded.svg" alt="">
                            <div class="info">
                                <div class="songName">${name}</div>
                                <div class="artistName">Karan Aujla</div>
                            </div>
                            <div class="playIcons">
                                <img  style="height: 19px; width: 19px;"  class="invert opacity" src="icons/play-list-add-stroke-rounded.svg" alt="">
                                <img style="height: 20px; width: 20px;"  class="invert" src="icons/download-02-stroke-rounded.svg" alt="">
                            </div>`

        songul.append(li)

        li.addEventListener("click",() => {
            playMusic(song)
            
        })
    }


    function playMusic(song) {
    
        if(currSong === song) {
            if(audio.paused) {
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

}



async function main() {
    let songs = await getSongs()
    displaySongs(songs)
    setUpEventListners()
    
}

main()