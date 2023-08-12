// const options = {
//     method: 'GET',
//     headers: {
//       accept: 'application/json',
//       Authorization: 'Bearer eyJhbGciOiJIUzI1NiJ9.eyJhdWQiOiIyN2E1MzQ0NGJiNTlmOTFiZDY1MjJiZmM4Y2QzNWI4YyIsInN1YiI6IjY0OWMwNWQwOTYzODY0MDEwMDQxNTUxYyIsInNjb3BlcyI6WyJhcGlfcmVhZCJdLCJ2ZXJzaW9uIjoxfQ.jVNDt9j00lE0FCt0_3L14lOkCnqPN-n1xkSOdvdTEdM'
//     }
//   };
  
//   fetch('https://api.themoviedb.org/3/movie/550?api_key=27a53444bb59f91bd6522bfc8cd35b8c', options)
//     .then(response => response.json())
//     .then(response => console.log(response))
//     .catch(err => console.error(err));
// youtube api key = "AIzaSyAq3juqlSPavHDc4PgxtuwrwbmBa2Fz6PE"
  //  youtube api key 2 = "AIzaSyCsNSUw5QnKbL3F-1ueoeTC4hC-6_t7Uyk" 
const apikey = "27a53444bb59f91bd6522bfc8cd35b8c";
const apiendpoint = "https://api.themoviedb.org/3";
// const imgpath = "https://image.tmdb.org/t/p/original";
const imgpath = "https://image.tmdb.org/t/p/original";

const apipaths = {
  fetchALLCategories: `${apiendpoint}/genre/movie/list?api_key=${apikey}`,
  fetchMoviesList: (id) => `${apiendpoint}/discover/movie?api_key=${apikey}&with_genres=${id}`,
  searchOnYoutube: (query) => `https://www.googleapis.com/youtube/v3/search?part=snippet&q=${query}&key=AIzaSyAq3juqlSPavHDc4PgxtuwrwbmBa2Fz6PE`,
  fetchtrending: `${apiendpoint}/trending/all/day?api_key=${apikey}&language=en.US`
}



/* to check if it was running (alert) */
/* boots up the app */
function init(){
//   alert("Hi Ajay"); 
  // fetchAndBuildMovieSection(apipaths.fetchtrending,'Trending Now');
  fetchTrendingMovies();
  fetchAndBuildALLSections();
}

function fetchTrendingMovies(){
  fetchAndBuildMovieSection(apipaths.fetchtrending,'Trending Now')
  .then(list => {
    const randomIndex = parseInt(Math.random() * list.length);
    buildBannerSection(list[randomIndex]);
  }).catch(err => console.error(err));
}

function buildBannerSection(movie){
  const bannerContainer = document.getElementById('banner-section');
  bannerContainer.style.backgroundImage = `url('${imgpath}${movie.backdrop_path}')`;

  const div = document.createElement('div');
  div.innerHTML = `
  <h2 class="banner-title">${movie.title}</h2>
  <p class="banner-info">Trending In Movies | Released ${movie.release_date}</p>
  <p class="banner-overview">${movie.overview && movie.overview.length > 200 ? movie.overview.slice(0,300).trim()+'...':movie.overview}</p>
  <div class="action-btn">
      <button class="btn"><i class="fa-solid fa-play"></i>Play</button>
      <button class="btn"><i class="fa-solid fa-circle-info"></i>More Info</button>
  </div>
`; 
  div.className = "banner-content conatiner";    
  bannerContainer.append(div);
}


function fetchAndBuildALLSections(){
  fetch(apipaths.fetchALLCategories)
  .then(res => res.json())
  .then(res => {
    const categories = res.genres;
    if(Array.isArray(categories) && categories.length){
      categories/*.slice(0,2)*/.forEach(category => {
        fetchAndBuildMovieSection(apipaths.fetchMoviesList(category.id),category.name);
      });
    }
    // console.table(movies)     //bring api in table form
  })  
  .catch(err => console.error(err));
  }

  function fetchAndBuildMovieSection(fetchUrl,categoryName){
    console.log(fetchUrl,categoryName);
    return fetch(fetchUrl)
    .then(res => res.json())
    .then(res => {
      // console.table(res.results);
      const movies = res.results;
      if(Array.isArray(movies) && movies.length){
        BuildMoviesSection(movies.slice(0,6), categoryName);
      }
      return movies;
    })
      .catch(err => console.error(err))

  }

  function BuildMoviesSection(list,categoryName){
    console.log(list,categoryName);

    const moviesContainer = document.getElementById("movies-container");
    const movielistHTML = list.map(item => {
      return`
      <div class="movies-item" onmouseenter="searchMovieTrailer('${item.title}', 'yt${item.id}')">
      <img  class="movies-item-img" src="${imgpath}${item.backdrop_path}" alt="${item.title}" />
      <iframe width="245px" height="150px" src="" id="yt${item.id}"></iframe>
      </div>`;
    }).join('');
   

    const moviesSectionHTML = `
      <h2  class="heading">${categoryName}<span class="explore">Explore All</span></h2>
      <div class="movies-row">
        ${movielistHTML}
      </div>
    `
 console.log(movielistHTML);

const div = document.createElement('div');
div.className = "movies-section"
div.innerHTML = moviesSectionHTML;

//append HTML into movie conatiners
    moviesContainer.append(div);

  }


  function searchMovieTrailer(movieName, iframId){
    console.log(document.getElementById(iframId),iframId)
    if (!movieName) return;

    fetch(apipaths.searchOnYoutube(movieName))
    .then(res => res.json())
    .then(res => {
      // console.log(res.items[0]);
      const bestResult = res.items[0];
      const youtubeUrl = `https://www.youtube.com/watch?v=${bestResult.id.videoId}`;
      console.log(youtubeUrl);
      // window.open(youtubeUrl,'_blank');
      const elements = document.getElementById(iframId);
      elements.src = `https://www.youtube.com/embed/${bestResult.id.videoId}?autoplay=1&controls=0`;


    })
    .catch(err => console.log(err));
  }

window.addEventListener('load',function(){
  init();
  window.addEventListener('scroll', function(){
    //header UI Update
    const header = document.getElementById('header');
    if(window.scrollY > 5) header.classList.add('black-bg')
    else header.classList.remove('black-bg');
  })
})