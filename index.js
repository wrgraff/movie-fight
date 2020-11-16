const fetchData = async term => {
    const response = await axios.get('http://www.omdbapi.com/', {
        params: {
            apikey: 'e247c6a0',
            s: term
        }
    });

    console.log(response.data);
};

const onInput = debounce(evt => {
    fetchData(evt.target.value);
});

const input = document.querySelector('input');
input.addEventListener('input', onInput);
