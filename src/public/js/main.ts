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
  const audioPlayer = document.createElement('audio')
  let audioContext: AudioContext = null
  audioPlayer.crossOrigin = 'anonymous'
  const nowPlayingEl = document.getElementById('song-info')
  const searchForm = document.getElementById('search')
  const searchInput: HTMLInputElement = document.getElementById('song-search') as HTMLInputElement
  const searchResultsEl = document.getElementById('search-results')

  const setAudioAnalyzer = async (audioUrl: string) => {
    audioPlayer.src = audioUrl
    audioContext = new AudioContext()
    const source = audioContext.createMediaElementSource(audioPlayer)
    
    const analyser = audioContext.createAnalyser()
    source.connect(analyser)
    analyser.connect(audioContext.destination)
    analyser.fftSize = 64

    console.log(analyser.frequencyBinCount)

    const frequencyData = new Uint8Array(analyser.frequencyBinCount);

    const updateVisualizer = () => {
      // Schedule the next update
      requestAnimationFrame(updateVisualizer);
  
      // Get the new frequency data
      analyser.getByteFrequencyData(frequencyData);
  
      // Update the visualisation
      console.log(frequencyData.join(', '))
    }
    updateVisualizer()
  }

  searchForm.onsubmit = async event => {
    event.preventDefault()

    const query = searchInput.value;

    const queryResult = await fetch('api/songs/search?query=' + query);
    const songs: SongInfo[] = await queryResult.json();

    // clear existing search results
    searchResultsEl.innerHTML = ""

    songs.forEach(song => {
      const searchResult = document.createElement('li')
      const button = document.createElement('button')
      const songHTML = `
        <div class="song-info">
          <img src="${song.imgUrl}" alt="" />
          <div class="text-content">
            <h2>${song.name}</h2>
            <p>${song.artists.join(", ")}</p>
          </div>
        </div>
      `
      button.innerHTML = songHTML
      button.onclick = () => {
        setAudioAnalyzer(song.audioUrl)
        nowPlayingEl.innerHTML = songHTML
      }

      searchResult.appendChild(button)
      searchResultsEl.appendChild(searchResult)
    })

    return false
  }

  document.addEventListener('click', (event) => {
    const target: ButtonEvent = event.target
    if (target.id === 'play-song' || target.parentElement.id === 'play-song') {
      console.log(audioPlayer.src)
      audioPlayer.paused ? audioPlayer.play() : audioPlayer.pause()
    }
  })
})()