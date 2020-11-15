const fetchData = async () => {
    const response = await axios.get('http://www.omdbapi.com/', {
        params: {
            apikey: 'e247c6a0',
            s: 'Dark Night'
        }
    });

    console.log(response.data);
};

fetchData();
