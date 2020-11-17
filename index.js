const apiKey = 'e247c6a0';

const root = document.querySelector('.autocomplete');
root.innerHTML = `
    <label>
        <b>Search for a movie</b>
        <input class="input" />
    </label>
    <div class="dropdown">
        <div class="dropdown-menu">
            <ul class="dropdown-content results">
            </ul>
        </div>
    </div>
`;

const input = root.querySelector('.input');
const dropdown = root.querySelector('.dropdown');
const resultsWrapper = root.querySelector('.results');

const fetchData = async term => {
    const response = await axios.get('http://www.omdbapi.com/', {
        params: {
            apikey: apiKey,
            s: term
        }
    });

    if (response.data.Error) {
        return [];
    }

    return response.data.Search;
};

const onInput = debounce(async evt => {
    const movies = await fetchData(evt.target.value);
    if (!movies.length) {
        dropdown.classList.remove('is-active');
        return;
    };

    dropdown.classList.add('is-active');
    resultsWrapper.innerHTML = '';

    for (let movie of movies) {
        const option = document.createElement('li');
        const imageSrc = movie.Poster === 'N/A' ? '' : movie.Poster;

        option.innerHTML = `
            <button type="button" class="dropdown-item">
                <img src="${imageSrc}">
                <p>${movie.Title}</p>
            </button>
        `;
        const button = option.querySelector('.dropdown-item');
        button.addEventListener('click', () => {
            input.value = movie.Title;
            dropdown.classList.remove('is-active');
            onMovieSelect(movie);
        });

        resultsWrapper.appendChild(option);
    };
});
input.addEventListener('input', onInput);

document.addEventListener('click', evt => {
    if (!root.contains(evt.target)) {
        dropdown.classList.remove('is-active');
    };
});

const onMovieSelect = async movie => {
    const response = await axios.get('http://www.omdbapi.com/', {
        params: {
            apikey: apiKey,
            i: movie.imdbID
        }
    });

    document.querySelector('#summary').innerHTML = movieTemplate(response.data);
};

const movieTemplate = movieDetail => {
    return `
        <article>
            <div class="media">
                <figure class="media-left">
                    <p class="image">
                        <img src="${movieDetail.Poster}">
                    </p>
                </figure>
                <div class="media-content">
                    <div class="content">
                        <h2>${movieDetail.Title}</h2>
                        <p>${movieDetail.Genre}</p>
                        <p>${movieDetail.Plot}</p>
                    </div>
                </div>
            </div>

            <div class="notification is-primary">
                <p class="title">${movieDetail.Awards}</p>
                <h3 class="subtitle">Awards</p>
            </div>

            <div class="notification is-primary">
                <p class="title">${movieDetail.BoxOffice}</p>
                <h3 class="subtitle">Box Office</p>
            </div>

            <div class="notification is-primary">
                <p class="title">${movieDetail.Metascore}</p>
                <h3 class="subtitle">Metascore</p>
            </div>

            <div class="notification is-primary">
                <p class="title">${movieDetail.imdbRating}</p>
                <h3 class="subtitle">IMDB rating</p>
            </div>

            <div class="notification is-primary">
                <p class="title">${movieDetail.imdbVotes}</p>
                <h3 class="subtitle">IMDB votes</p>
            </div>

        </article>
    `;
};
