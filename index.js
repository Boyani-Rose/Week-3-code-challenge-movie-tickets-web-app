document.addEventListener ('DOMContentLoaded', ()=> {
    const movieDetails = document.getElementById('movie-details')
    const movieList = document.getElementById('films')
    const buyTicketsBtn = document.getElementById('buy-ticket')

    function loadFirstMovie () {
        fetch("http://localhost:3000/films/1")
        .then((response) => response.json())
        .then (movie => displayMovieDetails(movie))

    }
})
