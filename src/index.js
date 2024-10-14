// Your code here
const API_URL = 'http://localhost:3000/films';
const filmsList = document.getElementById('films');

document.addEventListener('DOMContentLoaded', () => {
  const placeholder = document.querySelector('.film.item');
  if (placeholder) {
    placeholder.remove();
  }
  loadFirstFilm(API_URL);
  loadAllMovies(API_URL);
});

function loadFirstFilm(url) {
  fetch(url)
    .then(response => response.json())
    .then(data => {
      displayFilmDetails(data[0]);
    });
}

function loadAllMovies(url) {
  fetch(url)
    .then(response => response.json())
    .then(movies => {
      movies.forEach(movie => {
        showMovie(movie);
      });
    });
}

function showMovie(movie) {
  const filmItem = document.createElement('li');
  filmItem.style.cursor = "pointer";
  filmItem.textContent = movie.title.toUpperCase();
  filmsList.appendChild(filmItem);
  
  filmItem.addEventListener('click', () => {
    fetchFilmDetails(movie.id);
  });
}

function fetchFilmDetails(movieId) {
  fetch(`${API_URL}/${movieId}`)
    .then(response => response.json())
    .then(movie => {
      document.getElementById('buy-ticket').textContent = 'Buy Ticket';
      displayFilmDetails(movie);
    });
}

function displayFilmDetails(selectedMovie) {
  const posterElement = document.getElementById('poster');
  posterElement.src = selectedMovie.poster;

  document.querySelector('#title').textContent = selectedMovie.title;

  document.querySelector('#runtime').textContent = `${selectedMovie.runtime} minutes`;

  document.querySelector('#film-info').textContent = selectedMovie.description;

  document.querySelector('#showtime').textContent = selectedMovie.showtime;

  const availableTickets = selectedMovie.capacity - selectedMovie.tickets_sold;
  const ticketsElement = document.querySelector('#ticket-num');
  ticketsElement.textContent = availableTickets;

  const buyButton = document.getElementById('buy-ticket');
  buyButton.removeEventListener('click', buyTicketHandler); // Remove previous listener
  if (availableTickets === 0) {
    buyButton.textContent = 'Sold Out';
  } else {
    buyButton.addEventListener('click', () => buyTicketHandler(selectedMovie));
  }
}

function buyTicketHandler(movie) {
  const ticketsElement = document.querySelector('#ticket-num');
  let remainingTickets = parseInt(ticketsElement.textContent, 10);

  if (remainingTickets > 0) {
    remainingTickets -= 1;
    ticketsElement.textContent = remainingTickets;

    const updatedTicketsSold = movie.tickets_sold + 1;

    fetch(`${API_URL}/${movie.id}`, {
      method: 'PATCH',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({ tickets_sold: updatedTicketsSold })
    })
      .then(response => response.json())
      .then(updatedMovie => {
        displayFilmDetails(updatedMovie);
        if (remainingTickets === 0) {
          document.getElementById('buy-ticket').textContent = 'Sold Out';
        }
      });
  } else {
    alert('Sorry, no more tickets available!');
  }
}
function deleteMovie(movieId, filmItem) {
  fetch(`${API_URL}/${movieId},` { 
    method: 'DELETE'
  })
  .then(() => {
    filmsList.removeChild(filmItem);
  });
}

