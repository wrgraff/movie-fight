const apiKey = 'e247c6a0';

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

createAutocomplete({
    root: document.querySelector('.autocomplete')
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
