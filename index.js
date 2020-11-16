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

const input = document.querySelector('.input');
const dropdown = document.querySelector('.dropdown');
const resultsWrapper = document.querySelector('.results');

const fetchData = async term => {
    const response = await axios.get('http://www.omdbapi.com/', {
        params: {
            apikey: 'e247c6a0',
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
            <a class="dropdown-item">
                <img src="${imageSrc}">
                <p>${movie.Title}</p>
            </a>
        `;

        resultsWrapper.appendChild(option);
    };
});
input.addEventListener('input', onInput);

document.addEventListener('click', evt => {
    if (!root.contains(evt.target)) {
        dropdown.classList.remove('is-active');
    };
});
