const createAutocomplete = ({
    root,
    renderOption,
    onOptionSelect,
    inputValue,
    fetchData
}) => {
    root.innerHTML = `
        <label>
            <b>Search</b>
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
        const items = await fetchData(evt.target.value);
        if (!items.length) {
            dropdown.classList.remove('is-active');
            return;
        };
    
        dropdown.classList.add('is-active');
        resultsWrapper.innerHTML = '';
    
        for (let item of items) {
            const option = document.createElement('li');
    
            option.innerHTML = `<button type="button" class="dropdown-item">${renderOption(item)}</button>`;
            const button = option.querySelector('.dropdown-item');
            button.addEventListener('click', () => {
                input.value = inputValue(item);
                dropdown.classList.remove('is-active');
                onOptionSelect(item);
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
