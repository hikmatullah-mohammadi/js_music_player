/**
 * @author Hikmatullah Mohammadi <hikmatullah.m80@gmail.com>
 */

// music list
var myMusics = [
  {
    path: "/musics/ForestWalk.mp3",
    name: "ForestWalk",
  },
  {
    path: "./musics/Kevin_MacLeod_-_Canon_in_D_Major.mp3",
    name: "Kevin_MacLeod_-_Canon_in_D_Major",
  },
  {
    path: "./musics/purrple-cat-lullaby.mp3",
    name: "purrple-cat-lullaby",
  },
  {
    path: "./musics/Rain-Sound-and-Rainforest.mp3",
    name: "Rain-Sound-and-Rainforest",
  },
];

$(document).ready( () => {
  var music_index = 0;
  const MUSIC_ELEM = document.getElementById("currentMusic");
  const DURATION_BAR = document.getElementById("duration-bar");
  const MUSIC_CAPTION = document.getElementById("music-caption");
  const CURRENT_TIME = document.getElementById("currentTime");
  var music_duration;
  const ANIMATED_BARS = document.getElementsByClassName("animatedBar");

  $("#menu-btn").click(() => {
    $("#menu-bar").slideToggle("fast");
  });

  const load_music = async music_index => {
    await new Promise(async(resolve, reject) => {
      try{
        await MUSIC_ELEM.setAttribute("src", myMusics[music_index].path);
        resolve()
      } catch(err) {reject()}
    })
    $("#musicName").text(myMusics[music_index].name);
    
    // format and set the music's duration
    MUSIC_ELEM.addEventListener("loadedmetadata", () => {
      music_duration = parseInt(MUSIC_ELEM.duration);
      DURATION_BAR.max = music_duration;
      $("#duration").text(format_duration(music_duration));
    });
  }

  // called  to format the music duration: mm:ss
  const format_duration = sec => {
    // minutes:seconds
    var sec = Math.floor(sec);
    if (sec >= 60) {
      var minutes = Math.floor(sec / 60);
      var seconds = sec % 60;
      if (minutes < 10) {
        minutes = "0" + minutes;
      }
      if (seconds < 10) {
        seconds = "0" + seconds;
      }
      return minutes + ":" + seconds;
    }
    if (sec < 10) {
      sec = "0" + sec;
    }
    return "00:" + sec;
  }

  const play_or_continue_the_music = async() => {
    // if no music is currently paused, play a new one
    if (!MUSIC_ELEM.getAttribute("src")) {
      await load_music(music_index);
    }
    MUSIC_ELEM.play();
    MUSIC_CAPTION.style.animationPlayState = "running";
    for (i = 0; i < 6; i++) {
      ANIMATED_BARS[i].style.animationPlayState = "running";
    }
    $(".play-pause-btns").toggle();
  }

  const pause_the_music = () => {
    MUSIC_CAPTION.style.animationPlayState = "paused";
    for (i = 0; i < 6; i++) {
      ANIMATED_BARS[i].style.animationPlayState = "paused";
    }
    MUSIC_ELEM.pause();
    $(".play-pause-btns").toggle();
  }

  $("#play-btn").click(() => {
    play_or_continue_the_music();
  });

  $("#pause-btn").click(() => {
    pause_the_music();
  });

  const reset_caption_animation = () => {
    MUSIC_CAPTION.style.animationName = "none"; // stop
    // restart
    setTimeout(() => {
      MUSIC_CAPTION.style.animationName = "music-caption-rotate";
    }, 1);
  }

  // go to next music
  $("#next-btn").click(async() => {
    if (music_index == myMusics.length - 1) {
      alert("The current music is the last one in the list.");
      return;
    }
    music_index += 1;
    await load_music(music_index);
    MUSIC_ELEM.play();
    $("#pause-btn").show();
    $("#play-btn").hide();
    reset_caption_animation();
    for (i = 0; i < 6; i++) {
      ANIMATED_BARS[i].style.animationPlayState = "running";
    }
  });

  // go to previous music
  $("#prev-btn").click(async() => {
    if (music_index == 0) {
      alert("The current music is the first one in the list");
      return;
    }
    music_index -= 1;
    await load_music(music_index);
    MUSIC_ELEM.play();

    $("#pause-btn").show();
    $("#play-btn").hide();
    reset_caption_animation();
    for (i = 0; i < 6; i++) {
      ANIMATED_BARS[i].style.animationPlayState = "running";
    }
  });

  $("#forward-btn").click(() => {
    MUSIC_ELEM.currentTime += 10;
  });
  $("#backward-btn").click(() => {
    MUSIC_ELEM.currentTime -= 10;
  });

  // action listeners

  // update current time and duration bar
  MUSIC_ELEM.addEventListener("timeupdate", function () {
    CURRENT_TIME.innerHTML = format_duration(this.currentTime);
    DURATION_BAR.style.backgroundSize =
      ((this.currentTime * 100) / music_duration).toFixed(2) + "%";
    DURATION_BAR.value = this.currentTime;
  });

  // change the volume
  var volume_slider = document.getElementById("volumeSlider");
  volume_slider.addEventListener("input", function () {
    MUSIC_ELEM.volume = this.value;
    this.style.backgroundSize = this.value * 100 + "%";
  });

  // forword or backword
  DURATION_BAR.addEventListener("input", function () {
    MUSIC_ELEM.currentTime = this.value;
  });

  MUSIC_ELEM.addEventListener("ended", () => {
    reset_caption_animation();
    pause_the_music();
  });
});
