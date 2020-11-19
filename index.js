const API_KEY = 'e247c6a0';

const autocompleteConfig = {
    renderOption(movie) {
        const imageSrc = movie.Poster === 'N/A' ? '' : movie.Poster;
        return `
            <img src="${imageSrc}">
            <p>${movie.Title} (${movie.Year})</p>
        `;
    },
    inputValue(movie) {
        return movie.Title;
    },
    async fetchData(term) {
        const response = await axios.get('http://www.omdbapi.com/', {
            params: {
                apikey: API_KEY,
                s: term
            }
        });
    
        if (response.data.Error) {
            return [];
        }
    
        return response.data.Search;
    }
};

createAutocomplete({
    ...autocompleteConfig,
    root: document.querySelector('#left-autocomplete'),
    onOptionSelect(movie) {
        document.querySelector('.tutorial').classList.add('is-hidden');
        onMovieSelect(
            movie,
            document.querySelector('#left-summary')
        );
    }
});

createAutocomplete({
    ...autocompleteConfig,
    root: document.querySelector('#right-autocomplete'),
    onOptionSelect(movie) {
        document.querySelector('.tutorial').classList.add('is-hidden');
        onMovieSelect(
            movie,
            document.querySelector('#right-summary')
        );
    }
});

const onMovieSelect = async (movie, summaryElement) => {
    const response = await axios.get('http://www.omdbapi.com/', {
        params: {
            apikey: API_KEY,
            i: movie.imdbID
        }
    });

    summaryElement.innerHTML = movieTemplate(response.data);
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
