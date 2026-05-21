const api="http://www.omdbapi.com/?i=tt3896198&apikey=8b2a6e8c"
const searchBtn=document.getElementById("searchbtn");
const searchInput=document.getElementById("searchInput") as HTMLInputElement;
const movieResults=document.getElementById("movieResults") as HTMLElement;
const favourites=document.getElementById("favourites") as HTMLElement;
const prevBtn=document.getElementById("prevBtn") as HTMLButtonElement;
const nextBtn=document.getElementById("nextBtn") as HTMLButtonElement;
const pageInfo=document.getElementById("pageInfo") as HTMLElement;
type fav = {
  id: string;
  title: string;
  poster: string;
  year: string;
};

let favouriteMovies: fav[]=JSON.parse(localStorage.getItem("favourite") || "[]");
let currentQuery="";
let currentPage=1;
let totalPages=1;

async function fetchMovies(query: string,page=1){  
    try{
        const response=await fetch(`${api}&s=${encodeURIComponent(query)}&page=${page}`);
        const data=await response.json();

        if(data.Response==="True"){
            //console.log(data.Search);
            currentQuery=query;
            currentPage=page;
            totalPages=Math.ceil(Number(data.totalResults)/10);
            displayMovies(data.Search);
            updatePaginationControls();
        } else{
            movieResults.innerHTML=`<p>No movies found</p>`;
            currentQuery="";
            currentPage=1;
            totalPages=1;
            updatePaginationControls();
        }
    } catch(error){
        movieResults.innerHTML=`<p>No movies found</p>`
    }
    
}
function displayMovies(movies: any){
    movieResults.innerHTML="";
    movies.forEach((movie: any)=>{
    const movieCard=document.createElement('div');
    movieCard.innerHTML=`
    <img src="${movie.Poster}" alt="${movie.Title}">
    <h3>${movie.Title}</h3>
    <p>${movie.Year}</p>
    <button type="button">Add to favourites</button>
    `;
    movieCard.classList="movie-card"
    const favouriteButton=movieCard.querySelector("button");
    favouriteButton?.addEventListener("click",()=>{
        addToFavourite(movie.imdbID,movie.Title,movie.Poster,movie.Year);
    })
    movieResults.appendChild(movieCard);
   })
}   
function addToFavourite(id: any, title: any, poster: any, year: any){
    if(favouriteMovies.some((movie)=>movie.id===id)){
        return;
    }

    favouriteMovies.push({id,title,poster,year});
    localStorage.setItem('favourite',JSON.stringify(favouriteMovies));
    displayFavouriteMovies();
}

function removeFromFavourite(id: string){
    favouriteMovies=favouriteMovies.filter((movie)=>movie.id!==id);
    localStorage.setItem('favourite',JSON.stringify(favouriteMovies));
    displayFavouriteMovies();
}

searchBtn?.addEventListener("click",()=>{
    const value=searchInput.value.trim();
    if(value) {
        fetchMovies(value,1);
    }
})

nextBtn?.addEventListener("click",()=>{
    if(currentQuery && currentPage<totalPages){
        fetchMovies(currentQuery,currentPage+1);
    }
})

prevBtn?.addEventListener("click",()=>{
    if(currentQuery && currentPage>1){
        fetchMovies(currentQuery,currentPage-1);
    }
})

function updatePaginationControls(){
    pageInfo.textContent=`Page ${currentPage}`;
    prevBtn.disabled=currentPage<=1;
    nextBtn.disabled=!currentQuery || currentPage>=totalPages;
}

function displayFavouriteMovies(){
    favourites.innerHTML="";
    favouriteMovies.forEach((movie: any)=>{
    const movieCard=document.createElement('div');
    movieCard.innerHTML=`
    <img src="${movie.poster}" alt="${movie.title}">
    <h3>${movie.title}</h3>
    <p>${movie.year}</p>
    <button onclick="removeFavourite('${movie.id}');">Remove</button>
    `;
    movieCard.classList="movie-card";
    favourites.appendChild(movieCard);
   })
}

function removeFavourite(id: any){
    favouriteMovies=favouriteMovies.filter((movie)=>{
        return movie.id!==id
    })
    localStorage.setItem('favourite',JSON.stringify(favouriteMovies));
    displayFavouriteMovies();   
}
updatePaginationControls();
displayFavouriteMovies();
