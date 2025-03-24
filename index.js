

document.addEventListener('DOMContentLoaded', () => {
    const movieDetails = document.getElementById('movie-details');
    const movieList = document.getElementById('films');
    const buyTicketsBtn = document.getElementById('buy-ticket');

    function loadFirstMovie() {
        fetch("http://localhost:3000/films/1")
            .then((response) => response.json())
            .then(movie => displayMovieDetails(movie));
    }

    function displayMovieDetails(movie) {
        document.getElementById('poster').src = movie.poster;
        document.getElementById('title').textContent = movie.title;
        document.getElementById('runtime').textContent = `${movie.runtime} minutes`;
        document.getElementById('showtime').textContent = movie.showtime;
        document.getElementById('description').textContent = movie.description;

        let availableTickets = movie.capacity - movie.tickets_sold;
        document.getElementById('available-tickets').textContent = availableTickets;
        buyTicketsBtn.textContent = "Buy Ticket";
        buyTicketsBtn.disabled = false;

        if (availableTickets === 0) {
            buyTicketsBtn.textContent = "Sold Out";
            buyTicketsBtn.disabled = true;
        }

        buyTicketsBtn.onclick = () => buyTicket(movie);
    }

    function loadAllMovies() {
        fetch("http://localhost:3000/films")
            .then((response) => response.json())
            .then(movies => {
                movieList.innerHTML = '';
                movies.forEach(movie => {
                    let li = document.createElement('li');
                    li.textContent = movie.title;
                    li.classList.add('film', 'item');
                    li.dataset.id = movie.id;

                    if (movie.capacity - movie.tickets_sold === 0) {
                        li.classList.add("sold-out");
                        li.style.textDecoration = "line-through";
                    }

                    li.onclick = () => fetch(`http://localhost:3000/films/${movie.id}`)
                        .then(response => response.json())
                        .then(displayMovieDetails);

                    let deleteBtn = document.createElement('button');
                    deleteBtn.textContent = "❌";
                    deleteBtn.style.marginLeft = "10px";
                    deleteBtn.onclick = (e) => {
                        e.stopPropagation();
                        deleteMovie(movie.id, li);
                    };
                    li.appendChild(deleteBtn);

                    movieList.appendChild(li);
                });
            });
    }

    function buyTicket(movie) {
        let availableTickets = movie.capacity - movie.tickets_sold;

        if (availableTickets > 0) {
            let updatedTicketsSold = movie.tickets_sold + 1;
            fetch(`http://localhost:3000/films/${movie.id}`, {
                method: 'PATCH',
                headers: {
                    'Content-Type': "application/json"
                },
                body: JSON.stringify({ tickets_sold: updatedTicketsSold })
            })
                .then(response => response.json())
                .then(updatedMovie => {
                    let newAvailableTickets = movie.capacity - updatedMovie.tickets_sold;
                    document.getElementById('available-tickets').textContent = newAvailableTickets;
                    if (newAvailableTickets === 0) {
                        buyTicketsBtn.textContent = 'Sold out!';
                        buyTicketsBtn.disabled = true;
                        markSoldOut(movie.id);
                    }

                    return fetch("http://localhost:3000/tickets", {
                        method: "POST",
                        headers: { 'Content-Type': "application/json" },
                        body: JSON.stringify({ film_id: movie.id, number_of_tickets: 1 })
                    })
                        .then(response => response.json());
                });
        }
    }

    function markSoldOut(movieId) {
        let movieItems = document.querySelectorAll("#films li");

        movieItems.forEach(li => {
            if (li.dataset.id === movieId) {
                li.classList.add("sold-out");
                li.style.textDecoration = "line-through";
            }
        });
    }

    function deleteMovie(movieId, liElement) {
        fetch(`http://localhost:3000/films/${movieId}`, { method: 'DELETE' })
            .then(() => {
                liElement.remove();
            });
    }

    loadFirstMovie();
    loadAllMovies();
});