const createAutocomplete = ({ root, renderOption, onOptionSelect, inputValue }) => {
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
    
            option.innerHTML = `<button type="button" class="dropdown-item">${renderOption(movie)}</button>`;
            const button = option.querySelector('.dropdown-item');
            button.addEventListener('click', () => {
                input.value = inputValue(movie);
                dropdown.classList.remove('is-active');
                onOptionSelect(movie);
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