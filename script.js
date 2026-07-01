console.log("helo")
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

async function main() {
    let songs = await getSongs()
    const audio = new Audio();



    let songul = document.querySelector(".songsList ul")

    let currSong = null;

    for (const song of songs) {

        let li = document.createElement("li")
        let name = decodeURIComponent(song.split("/").pop())
            .replace(/\([^)]*\)/g, "")
            .replace(/\[[^\]]*\]/g, "")
            .replace(/\.[^/.]+$/, "")
            .trim();
        li.innerHTML = `<img  class="invert" src="icons/music-note-03-stroke-rounded.svg" alt="">
                            <div class="info">
                                <div class="songName">${name}</div>
                                <div class="artistName">Karan Aujla</div>
                            </div>

                            <div class="playIcons">
                                
                                <img  style="height: 19px; width: 19px;"  class="invert opacity" src="icons/play-list-add-stroke-rounded.svg" alt="">
                                <img style="height: 20px; width: 20px;"  class="invert" src="icons/download-02-stroke-rounded.svg" alt="">
                            </div>`
        songul.appendChild(li);


        li.addEventListener("click", () => {

            if (currSong === song) {
                if (audio.paused) {
                    audio.play();
                } else {
                    audio.pause()
                }
                return;
            }

            currSong = song;
            audio.src = song;
            audio.play();
        })

    }



    audio.addEventListener('loadedmetadata', () => {
        console.log(audio.duration)
    });
}

main()