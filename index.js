document.addEventListener ('DOMContentLoaded', ()=> {
    const movieDetails = document.getElementById('movie-details')
    const movieList = document.getElementById('films')
    const buyTicketsBtn = document.getElementById('buy-ticket')

    function loadFirstMovie () {
        fetch("http://localhost:3000/films/1")
        .then((response) => response.json())
        .then (movie => displayMovieDetails(movie))

    }

    function displayMovieDetails (movie) {
        document.getElementById('poster').src=movie.poster
        document.getElementById('title').textContent=movie.title
        document.getElementById('runtime').textContent=movie.runtime
        document.getElementById('showtime').textContent=movie.showtime

        let availableTickets = movie.capacity - movie.tickets_sold
        document.getElementById('available-tickets').textContent = availableTickets
        buyTicketsBtn.onclick=()=>buyTicket(movie, availableTickets)



    }

    function loadAllMovies () {
        fetch("http://localhost:3000/films")
        .then ((response) => response.json)
        .then (movies => {
            movieList.innerHTML=''
            movies.forEach (movie =>{
                let li = document.createElement('li')
                li.textContent = movie.title
                li.classList.add('film', 'item')
                li.onclick = ()=> fetch (`http://localhost:3000/films/${movie.id}`)
                                    .then (response => response.json())
                                    .then (displayMovieDetails)

                movieList.appendChild(li)
            })
    );
        })

    }


})
