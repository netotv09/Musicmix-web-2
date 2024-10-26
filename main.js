const apiKey = 'AIzaSyA227ykrmObYmz19kT80CayebloBSTrnmk'; // Tu clave de API de YouTube
let currentVideoId = '';

// Cambia entre pantallas
function showScreen(screenId) {
  document.querySelectorAll('.screen').forEach(screen => {
    screen.classList.remove('active');
  });
  document.getElementById(screenId).classList.add('active');
}

// Obtener canciones recomendadas al iniciar
window.onload = function() {
  fetchRecommendedSongs();
};

// Obtener canciones recomendadas
function fetchRecommendedSongs() {
  fetch(`https://www.googleapis.com/youtube/v3/videos?part=snippet&chart=mostPopular&videoCategoryId=10&regionCode=US&maxResults=10&key=${apiKey}`)
    .then(response => response.json())
    .then(data => {
      const recommendedSongs = data.items;
      displaySongs(recommendedSongs, 'recommendedSongs');
    })
    .catch(error => console.error('Error al cargar recomendaciones:', error));
}

// Buscar canciones
function searchSongs() {
  const query = document.getElementById('searchQuery').value;
  fetch(`https://www.googleapis.com/youtube/v3/search?part=snippet&q=${query}&type=video&videoCategoryId=10&maxResults=10&key=${apiKey}`)
    .then(response => response.json())
    .then(data => {
      const searchResults = data.items;
      displaySongs(searchResults, 'searchResults');
    })
    .catch(error => console.error('Error en la búsqueda:', error));
}

// Mostrar canciones en la pantalla
function displaySongs(songs, containerId) {
  const container = document.getElementById(containerId);
  container.innerHTML = '';
  songs.forEach(song => {
    const songElement = document.createElement('div');
    songElement.className = 'song-item';
    songElement.innerHTML = `
            <img src="${song.snippet.thumbnails.default.url}" alt="${song.snippet.title}">
            <div>
                <h4>${song.snippet.title}</h4>
                <p>${song.snippet.channelTitle}</p>
            </div>
        `;
    songElement.onclick = () => playSong(song.id.videoId, song.snippet.title);
    container.appendChild(songElement);
  });
}

// Reproducir canción
function playSong(videoId, title) {
  currentVideoId = videoId;
  document.getElementById('currentSongTitle').innerText = `Reproduciendo: ${title}`;
  document.getElementById('player').src = `https://www.youtube.com/embed/${videoId}?autoplay=1`; // Cargar video en el reproductor de YouTube
  document.getElementById('musicPlayer').style.display = 'block'; // Mostrar reproductor
}

// Alternar minimización del reproductor
function togglePlayer() {
  const player = document.getElementById('musicPlayer');
  player.classList.toggle('collapsed');
  const isCollapsed = player.classList.contains('collapsed');
  document.getElementById('toggleIcon').innerText = isCollapsed ? 'play_arrow' : 'pause';
  player.style.display = isCollapsed ? 'none' : 'flex'; // Mostrar u ocultar el reproductor
}