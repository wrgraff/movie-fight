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

    for (let movie of movies) {
        const div = document.createElement('div');

        div.innerHTML = `
            <img src="${movie.Poster}">
            <h1>${movie.Title}</h1>
        `;

        document.querySelector('#target').appendChild(div);
    };
});

const input = document.querySelector('input');
input.addEventListener('input', onInput);
