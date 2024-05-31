let currentSong = new Audio()
let songs
let currFolder;
function getCurrTime()
{
    let du = currentSong.currentTime;
    let minutes = Math.floor(du/60);
    let seconds = Math.floor(du%60);
    seconds = seconds < 10 ? '0' + seconds : seconds;
    return `${minutes}:${seconds}`

}
function getTotalTime()
{
    let du = currentSong.duration;
    let minutes = Math.floor(du/60);
    let seconds = Math.floor(du%60);
    seconds = seconds < 10 ? '0' + seconds : seconds;
    return `${minutes}:${seconds}`

}
async function getSongs(folder)
{
    let a = await fetch(`/${folder}/`)
    currFolder = folder
    let response = await a.text()
    let div = document.createElement('div')
    div.innerHTML = response;
    let as = div.getElementsByTagName("a")
    let songs = []
    for(let i= 0;i<as.length;i++)
    {
        const element = as[i]
        if(element.href.endsWith(".mp3"))
            {
                songs.push(element.href.split(`/${folder}/`)[1])
            }
    }
    let songUL = document.querySelector(".songList").getElementsByTagName("ul")[0]
    songUL.innerHTML = ""
    let unval = 1;
    for (const song of songs) 
    {
        songUL.innerHTML+=`<li><img class="invert" width="34" src="svgFiles/music.svg" alt="">
        <div class="info">
            <div id="#songNameDiv">${(song.replaceAll("%20", " ")).split(".")[0]}</div>
            <div>--By Sanjay Kumar</div>
        </div>
        <div class="playnow">
            <img class="invert" src="svgFiles/play.svg" alt="">
        </div> </li>`;
        unval++; 
    }  
    Array.from(document.querySelector(".songList").getElementsByTagName("li")).forEach((e)=>{
        e.addEventListener("click",element=>{
            PlayMusic(e.querySelector(".info").firstElementChild.innerHTML)
        })
    })
    return songs;
}
const PlayMusic = (track)=>{
    if(track && track.indexOf(".") !== -1)
    {
        track = track.split(".")[0]
    }
    currentSong.src = `/${currFolder}/`+track+".mp3"
    currentSong.play()
    play.src = "svgFiles/pause.svg"
    document.querySelector(".songinfo").innerHTML = track.replaceAll("%20"," ");
}
async function displayAllAlbums()
{
    let a = await fetch(`/songs/`)
    let response = await a.text()
    let div = document.createElement('div')
    div.innerHTML = response;
    let anchors = div.getElementsByTagName("a")
    let array = Array.from(anchors)
    for (let index = 0; index < array.length; index++) 
    {
        const e = array[index];
        if(e.href.includes("/songs/"))
        {
            let folder = (e.href.split("/songs/")[1])
            let a = await fetch(`songs/${folder}/info.json`)
            let response = await a.json()
            let cc = document.querySelector(".cardContainer")
            cc.innerHTML = cc.innerHTML+ `
            <div class="card " data-folder="${folder}">
                    <div class="play">
                        <img src="songs/${folder}/Img.jpeg">
                        <h2>${response.title}</h2>
                        <p>${response.description}</p>
                    </div>
                </div>
            `
        }
    }
    Array.from(document.getElementsByClassName("card")).forEach( e => { 
        e.addEventListener("click", async item => {
            songs = await getSongs(`songs/${item.currentTarget.dataset.folder}`)  
            PlayMusic(songs[0])

        })
    })
} 
async function main()
{
    songs = await getSongs(`songs/tamil`)
    console.log("currFolder",currFolder)
    await displayAllAlbums()
    let play = document.getElementById("play");
    play.addEventListener("click",(e)=>{
        if(currentSong.paused)
        {
            currentSong.play()
            play.src = "svgFiles/pause.svg"
        }
        else
        {
            currentSong.pause()
            play.src = "svgFiles/play.svg"
        }
    })
    let next = document.getElementById("next")
    next.addEventListener("click",(e)=>{

    })

    currentSong.addEventListener("timeupdate", () => {
        if(currentSong.duration-currentSong.currentTime<=0)
        {
            let index = songs.indexOf((currentSong.src.split("/").slice(-1)[0]))
            if((index+1)>=songs.length-1)
            {
                PlayMusic(songs[0])
            }
            else
            {
                PlayMusic(songs[index+1])
            }
        }

        document.querySelector(".songtime").innerHTML = `${getCurrTime()} / ${getTotalTime()}`;
        let time_portion = ((currentSong.currentTime/currentSong.duration))*100;
        document.querySelector(".circle").style.left = `${time_portion}%`
    });

    document.querySelector(".seekbar").addEventListener(("click"),(e)=>{
        let v = (e.offsetX/e.target.getBoundingClientRect().width)
        let movesong_val =  v*currentSong.duration;
        currentSong.currentTime = movesong_val;
        document.querySelector(".circle").style.left = `${v*100}%`
    })

    document.querySelector(".hamburger").addEventListener(('click'),()=>{
        document.querySelector(".left").style.left ="0%"; 
    })
    document.querySelector(".backbutton").addEventListener("click",(e)=>{
        document.querySelector(".left").style.left ="-120%";
    })
    document.getElementById("previous").addEventListener(("click"),()=>{
        let index = songs.indexOf(currentSong.src.split("/").slice(-1)[0])
        if((index-1)<0)
        {
            PlayMusic(songs[songs.length-1])
        }
        else
        {
            PlayMusic(songs[index-1])
        }
    })
    document.getElementById("next").addEventListener(("click"),()=>{
        let index = songs.indexOf((currentSong.src.split("/").slice(-1)[0]))

        if((index+1)>songs.length-1)
        {
            PlayMusic(songs[0])
        }
        else
        {
            PlayMusic(songs[index+1])
        }
   })
} 
main()
