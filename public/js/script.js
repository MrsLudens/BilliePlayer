const container = document.querySelector(".container"),
    musicImg = container.querySelector(".img-area img"),
    musicName = container.querySelector(".song-details .name"),
    musicArtist = container.querySelector(".song-details .artist"),
    mainAudio = container.querySelector("#main-audio"),
    playpauseBtn = container.querySelector(".play-pause"),
    nextBtn = container.querySelector("#next"),
    prevBtn = container.querySelector("#prev"),
    progressArea = container.querySelector(".progress-area"),
    progressBar = container.querySelector(".progress-bar"),
    musicList = container.querySelector(".music-list"),
    moreMusicBtn = container.querySelector("#more-music"),
    closemoreMusic = container.querySelector("#close"),
    favoriteBtn = container.querySelector(".top-bar i:first-child"),
    darkModeToggleBtn = document.getElementById("dark-mode-toggle"),
    darkModeIcon = darkModeToggleBtn.querySelector(".material-icons"),
    body = document.body;


let isDarkMode = false;
let isFavorite = false;
let musicIndex = Math.floor((Math.random() * allMusic.length) + 1);
let volume_slider = document.querySelector('.volume_slider');

window.addEventListener("load", () => {
    loadMusic(musicIndex);
    playingSong();
})

// Carrega a musica

function loadMusic(indexNumb) {
    musicName.innerText = allMusic[indexNumb - 1].name;
    musicArtist.innerText = allMusic[indexNumb - 1].artist;
    musicImg.src = `images/${allMusic[indexNumb - 1].img}.jpg`;
    mainAudio.src = `songs/${allMusic[indexNumb - 1].src}.mp3`;
}


// tocar a musica e girar imagem
function playMusic() {
    container.classList.add("paused");
    playpauseBtn.querySelector("i").innerText = "pause";
    mainAudio.play();
    musicImg.classList.remove("playing"); // adiciona a animaçao
}

// pausar a musica
function pauseMusic() {
    container.classList.remove("paused");
    playpauseBtn.querySelector("i").innerText = "play_arrow";
    mainAudio.pause();
    musicImg.classList.add("playing"); // remove a  a animação
}

// favorito 
favoriteBtn.addEventListener("click", () => {
    isFavorite = !isFavorite; // alternar o estado do favorito

    if (isFavorite) {
        favoriteBtn.innerText = "favorite"; // preencher o ícone
    } else {
        favoriteBtn.innerText = "favorite_border"; // desmarcar o ícone
    }
});


// proxima musica
function nextMusic() {
    musicIndex++;
    // Se o musicIndex for maior que o array entao vai voltar a 1 e tocar a primeira musica
    musicIndex > allMusic.length ? musicIndex = 1 : musicIndex = musicIndex;
    loadMusic(musicIndex);
    playMusic();
    playingSong();
}
// voltar musica
function prevMusic() {
    musicIndex--;
    // Se o musicIndex for menor que o array entao vai voltar a 1 e tocar a primeira musica
    musicIndex < 1 ? musicIndex = allMusic.length : musicIndex = musicIndex;
    loadMusic(musicIndex);
    playMusic();
    playingSong();
}

// volume
function setVolume() {
    const volumeSlider = document.querySelector('.volume_slider');
    const volumeIcon = document.querySelector('.volume-icon');
    mainAudio.volume = volumeSlider.value / 100;

    // Atualiza o ícone de volume com base no nível de volume
    if (volumeSlider.value == 0) {
        volumeIcon.textContent = 'volume_off';
    } else if (volumeSlider.value <= 50) {
        volumeIcon.textContent = 'volume_down';
    } else {
        volumeIcon.textContent = 'volume_up';
    }
}

// botao de play e pause
playpauseBtn.addEventListener("click", () => {
    const isMusicPaused = container.classList.contains("paused");

    isMusicPaused ? pauseMusic() : playMusic();

});

// evento botao prox musica
nextBtn.addEventListener("click", () => {
    nextMusic();
});


// evento botao musica anterior
prevBtn.addEventListener("click", () => {
    prevMusic();
});

// atualizar barra de progresso de acordo com a musica
mainAudio.addEventListener("timeupdate", (e) => {
    const currentTime = e.target.currentTime; //obtem o tempo atual da musica
    const duration = e.target.duration; //obtem tempo total da musica
    let progressWidth = (currentTime / duration) * 100;
    progressBar.style.width = `${progressWidth}%`;



    let musicCurrentTime = container.querySelector(".current-time"),
        musicDuration = container.querySelector(".max-duration");
    mainAudio.addEventListener("loadeddata", () => {

        //  atualiza o tempo total da musica
        let mainAdDuration = mainAudio.duration;
        let totalMin = Math.floor(mainAdDuration / 60);
        let totalSec = Math.floor(mainAdDuration % 60);
        if (totalSec < 10) {
            totalSec = `0${totalSec}`;
        }

        musicDuration.innerText = `${totalMin}:${totalSec}`;

    });

    // atualiza o tempo atual da música em reprodução
    let currentMin = Math.floor(currentTime / 60);
    let currentSec = Math.floor(currentTime % 60);
    if (currentSec < 10) {
        currentSec = `0${currentSec}`;
    }

    musicCurrentTime.innerText = `${currentMin}:${currentSec}`;

});

// atualizar a musica de acordo com a barra de progrewsso

progressArea.addEventListener("click", (e) => {
    let progressWidth = progressArea.clientWidth;
    let clickedOffsetX = e.offsetX;
    let songDuration = mainAudio.duration;

    mainAudio.currentTime = (clickedOffsetX / progressWidth) * songDuration;
    playMusic();

});

// altera o ícone de loop, embaralhar, repetir ao clicar
const repeatBtn = container.querySelector("#repeat-plist");
repeatBtn.addEventListener("click", () => {
    let getText = repeatBtn.innerText; //pega o texto interno da tag
    switch (getText) {
        case "repeat":
            repeatBtn.innerText = "repeat_one";
            repeatBtn.setAttribute("title", "song looped");
            break;
        case "repeat_one":
            repeatBtn.innerText = "shuffle";
            repeatBtn.setAttribute("title", "playback shuffled");
            break;
        case "shuffle":
            repeatBtn.innerText = "repeat";
            repeatBtn.setAttribute("title", "playlist looped");
            break;

    }

});


mainAudio.addEventListener("ended", () => {
    let getText = repeatBtn.innerText;
    switch (getText) {
        case "repeat":
            nextMusic();
            break;
        case "repeat_one":
            mainAudio.currentTime = 0;
            loadMusic(musicIndex);
            playMusic();
            break;
        case "shuffle":
            let randIndex = Math.floor((Math.random() * allMusic.length) + 1);
            do {
                randIndex = Math.floor((Math.random() * allMusic.length) + 1);
            } while (musicIndex == randIndex);
            musicIndex = randIndex;
            loadMusic(musicIndex);
            playMusic();
            playingSong();
            break;
    }
});

// mostrar a lista de músicas ao clicar no ícone de música
moreMusicBtn.addEventListener("click", () => {
    musicList.classList.toggle("show");
});
closemoreMusic.addEventListener("click", () => {
    moreMusicBtn.click();
});


const ulTag = container.querySelector("ul");

/// criar tags li de acordo com o comprimento da matriz para a lista
for (let i = 0; i < allMusic.length; i++) {
    let liTag = `<li li-index="${i + 1}">
    <div class="row">
      <span>${allMusic[i].name}</span>
      <p>${allMusic[i].artist}</p>
    </div>
    <audio class="${allMusic[i].src} " src="songs/${allMusic[i].src}.mp3"></audio>
    <span id="${allMusic[i].src}" class="audio-duration">1:45</span>
  </li>`;
    ulTag.insertAdjacentHTML("beforeend", liTag);

    let liAudioDurationTag = ulTag.querySelector(`#${allMusic[i].src}`);
    let liAudioTag = ulTag.querySelector(`.${allMusic[i].src}`);

    liAudioTag.addEventListener("loadeddata", () => {
        let duration = liAudioTag.duration;
        let totalMin = Math.floor(duration / 60);
        let totalSec = Math.floor(duration % 60);
        if (totalSec < 10) {
            totalSec = `0${totalSec}`;
        }

        liAudioDurationTag.innerText = `${totalMin}:${totalSec}`;

        liAudioDurationTag.setAttribute("t-duration", `${totalMin}:${totalSec}`);
    });

}
// reproduzir música específica da lista ao clicar na tag li
const allLiTags = ulTag.querySelectorAll("li");

function playingSong() {
    for (let j = 0; j < allLiTags.length; j++) {
        let audioTag = allLiTags[j].querySelector(".audio-duration");
        // remover a classe playing de todas as outras li, exceto a última clicada
        if (allLiTags[j].classList.contains("playing")) {
            allLiTags[j].classList.remove("playing");
            let adDuration = audioTag.getAttribute("t-duration");
            audioTag.innerText = adDuration;
        }
        if (allLiTags[j].getAttribute("li-index") == musicIndex) {
            allLiTags[j].classList.add("playing");
            audioTag.innerText = "Playing";
        }
        allLiTags[j].setAttribute("onclick", "clicked(this)");
    }
}

// tocar ao clicar
function clicked(element) {
    let getLiIndex = element.getAttribute("li-index");
    musicIndex = getLiIndex;
    loadMusic(musicIndex);
    playMusic();
    playingSong();
}

// dark mode
darkModeToggleBtn.addEventListener("click", () => {
    isDarkMode = !isDarkMode;

    if (isDarkMode) {
        body.classList.add("dark-mode");
        darkModeIcon.innerText = "wb_sunny"; // Ícone de sol
    } else {
        body.classList.remove("dark-mode");
        darkModeIcon.innerText = "brightness_2"; // Ícone de lua
    }
});