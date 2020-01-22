type SongInfo = {
  id: string;
  artists: Array<string>;
  imgUrl: string;
  name: string;
  audioUrl: string;
}

type ButtonEvent = EventTarget & {
  id?: string;
  parentElement?: HTMLElement;
}

(async function main() {
  const audioPlayer = new Audio()
  const nowPlayingEl = document.getElementById('song-info')
  const searchForm = document.getElementById('search')
  const searchInput: HTMLInputElement = document.getElementById('song-search') as HTMLInputElement
  const searchResultsEl = document.getElementById('search-results')
  const savedSongsEl = document.getElementById('saved-songs')

  async function toggleFave(id: string) {
    await fetch('api/songs/fave?id=' + id, { method: 'POST' })
    await updateSavedSongs()
  }

  const listSongs = (songs: SongInfo[], root: HTMLElement) => {
    songs.forEach((song: SongInfo) => {
      const songElem = document.createElement('li')
      const button = document.createElement('button')
      const songHTML = `
        <div class="song-info">
          <img src="${song.imgUrl}" alt="" />
          <div class="text-content">
            <h2>${song.name}</h2>
            <p>${song.artists.join(", ")}</p>
          </div>
        </div>
        <h4 hidden>${song.id}</h4>
      `
      button.innerHTML = songHTML
      button.onclick = () => {
        audioPlayer.src = song.audioUrl
        nowPlayingEl.innerHTML = songHTML
      }

      songElem.appendChild(button)
      root.appendChild(songElem)
    })
  }

  searchForm.onsubmit = async event => {
    event.preventDefault()

    const query = searchInput.value;

    const queryResult = await fetch('api/songs/search?query=' + query);
    const songs: SongInfo[] = await queryResult.json();

    // clear existing search results
    searchResultsEl.innerHTML = ""

    listSongs(songs, searchResultsEl)

    return false
  }

  const updateSavedSongs = async () => {
    const savedSongsResult = await fetch('api/songs/get-faves')
    const savedSongs: SongInfo[] = await savedSongsResult.json()
    savedSongsEl.innerHTML = ""
    listSongs(savedSongs, savedSongsEl)
  }
  updateSavedSongs()

  document.addEventListener('click', (event) => {
    const target: ButtonEvent = event.target
    if (target.id === 'play-song' || target.parentElement.id === 'play-song') {
      audioPlayer.paused ? audioPlayer.play() : audioPlayer.pause()
    } else if (target.id === 'fave') {
      console.log("hello")
      console.log(document.getElementById("song-info").getElementsByTagName('h4')[0].innerHTML)
      console.log("hey")
      toggleFave(document.getElementById("song-info").getElementsByTagName('h4')[0].innerHTML)
    }
  })
})()