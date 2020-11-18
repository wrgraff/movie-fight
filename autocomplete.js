const createAutocomplete = ({ root }) => {
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
};
