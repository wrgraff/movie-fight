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
            document.querySelector('#left-summary'),
            'left'
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
            document.querySelector('#right-summary'),
            'right'
        );
    }
});

let leftMovie;
let rightMovie;
const onMovieSelect = async (movie, summaryElement, side) => {
    const response = await axios.get('http://www.omdbapi.com/', {
        params: {
            apikey: API_KEY,
            i: movie.imdbID
        }
    });

    summaryElement.innerHTML = movieTemplate(response.data);

    if (side === 'left') {
        leftMovie = response.data;
    } else {
        rightMovie = response.data;
    }

    if (leftMovie && rightMovie) {
        runComparison();
    }
};

const runComparison = () => {
    const leftSideStats = document.querySelectorAll('#left-summary .notification'); 
    const rightSideStats = document.querySelectorAll('#right-summary .notification');

    leftSideStats.forEach((leftStat, index) => {
        const rightStat = rightSideStats[index];

        if (
            leftStat.dataset.value === 'NaN'
            || rightStat.dataset.value === 'NaN'
            || leftStat.dataset.value === '0'
            || rightStat.dataset.value === '0'
        ) {
            leftStat.classList.remove('is-primary');
            rightStat.classList.remove('is-primary');
            return;
        }

        const leftSideValue = parseInt(leftStat.dataset.value);
        const rightSideValue = parseInt(rightStat.dataset.value);

        if (rightSideValue > leftSideValue) {
            leftStat.classList.remove('is-primary');
            leftStat.classList.add('is-warning');
        } else {
            rightStat.classList.remove('is-primary');
            rightStat.classList.add('is-warning');
        }
    });
};

const movieTemplate = movieDetail => {
    const dollars = parseInt(movieDetail.BoxOffice.replace(/\$/g, '').replace(/,/g, ''));
    const metascore = parseInt(movieDetail.Metascore);
    const imdbRating = parseFloat(movieDetail.imdbRating);
    const imdbVotes = parseInt(movieDetail.imdbVotes.replace(/,/g, ''));
    const awards = movieDetail.Awards.split(' ').reduce((accumulator, word) => {
        const value = parseInt(word);
        if (isNaN(value)) {
            return accumulator;
        } else {
            return accumulator += value;
        }
    }, 0);

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

            <div class="notification is-primary" data-value="${awards}">
                <p class="title">${movieDetail.Awards}</p>
                <h3 class="subtitle">Awards</p>
            </div>

            <div class="notification is-primary" data-value="${dollars}">
                <p class="title">${movieDetail.BoxOffice}</p>
                <h3 class="subtitle">Box Office</p>
            </div>

            <div class="notification is-primary" data-value="${metascore}">
                <p class="title">${movieDetail.Metascore}</p>
                <h3 class="subtitle">Metascore</p>
            </div>

            <div class="notification is-primary" data-value="${imdbRating}">
                <p class="title">${movieDetail.imdbRating}</p>
                <h3 class="subtitle">IMDB rating</p>
            </div>

            <div class="notification is-primary" data-value="${imdbVotes}">
                <p class="title">${movieDetail.imdbVotes}</p>
                <h3 class="subtitle">IMDB votes</p>
            </div>

        </article>
    `;
};
