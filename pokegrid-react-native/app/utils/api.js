const BASE_URL = 'https://pokeapi.co/api/v2';
const IMAGE_BASE_URL = 'https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon';

const PATH_POKEMON = 'pokemon';

const mapItemToPokemon = (item) => {
    const {name, url} = item;
    const segments = url.split('/');
    const number = segments.pop() || segments.pop();

    return {
        number: parseInt(number),
        name: `${name[0].toUpperCase()}${name.substr(1)}`,
        image: [IMAGE_BASE_URL, `${number}.png`].join('/')
    }
};

export default {
    fetchPoke(offset) {
        const params = `limit=50&offset=${offset}`;
        const url = [BASE_URL, PATH_POKEMON].join('/');
        const urlWithParams = `${url}?${params}`;

        return fetch(urlWithParams)
            .then(response => response.json())
            .then(responseJson => responseJson.results)
            .then(items => items.map(mapItemToPokemon))
            .catch(error => {
                console.log(error);
            });
    }
};
