const API_URL = 'http://localhost:3000/films';
const filmsList = document.getElementById('films');

document.addEventListener('DOMContentLoaded', () => {
  const placeholder = document.querySelector('.film.item');
  if (placeholder) {
    placeholder.remove();
  }
  loadAllMovies();
});

function loadAllMovies() {
  fetch(API_URL)
    .then(function(response) {
      return response.json();
    })
    .then(function(movies) {
      movies.forEach(function(movie) {
        showMovie(movie);
      });
      if (movies.length > 0) {
        displayFilmDetails(movies[0]);
      }
    });
}

function showMovie(movie) {
  const filmItem = document.createElement('li');
  filmItem.style.cursor = "pointer";
  filmItem.textContent = movie.title.toUpperCase();
  
  const deleteButton = document.createElement('button');
  deleteButton.textContent = 'Delete';
  deleteButton.style.marginLeft = '10px';
  
  deleteButton.addEventListener('click', function(event) {
    event.stopPropagation();
    deleteMovie(movie.id, filmItem);
  });

  filmItem.appendChild(deleteButton);
  filmsList.appendChild(filmItem);
  
  filmItem.addEventListener('click', function() {
    fetchFilmDetails(movie.id);
  });
}

function fetchFilmDetails(movieId) {
  fetch(API_URL + '/' + movieId)
    .then(function(response) {
      return response.json();
    })
    .then(function(movie) {
      document.getElementById('buy-ticket').textContent = 'Buy Ticket';
      displayFilmDetails(movie);
    });
}

function displayFilmDetails(selectedMovie) {
  const posterElement = document.getElementById('poster');
  posterElement.src = selectedMovie.poster;

  document.getElementById('title').textContent = selectedMovie.title;
  document.getElementById('runtime').textContent = selectedMovie.runtime + ' minutes';
  document.getElementById('film-info').textContent = selectedMovie.description;
  document.getElementById('showtime').textContent = selectedMovie.showtime;

  const availableTickets = selectedMovie.capacity - selectedMovie.tickets_sold;
  const ticketsElement = document.getElementById('ticket-num');
  ticketsElement.textContent = availableTickets;

  const buyButton = document.getElementById('buy-ticket');
  buyButton.removeEventListener('click', buyTicketHandler);
  if (availableTickets === 0) {
    buyButton.textContent = 'Sold Out';
  } else {
    buyButton.addEventListener('click', function() {
      buyTicketHandler(selectedMovie);
    });
  }
}

function buyTicketHandler(movie) {
  const ticketsElement = document.getElementById('ticket-num');
  let remainingTickets = parseInt(ticketsElement.textContent);

  if (remainingTickets > 0) {
    remainingTickets--;
    ticketsElement.textContent = remainingTickets;

    const updatedTicketsSold = movie.tickets_sold + 1;

    fetch(API_URL + '/' + movie.id, {
      method: 'PATCH',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({ tickets_sold: updatedTicketsSold })
    })
    .then(function(response) {
      return response.json();
    })
    .then(function(updatedMovie) {
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
  fetch(`${API_URL}/${movieId}`, { 
    method: 'DELETE'
  })
  .then(() => {
    filmsList.removeChild(filmItem);
  });
}






