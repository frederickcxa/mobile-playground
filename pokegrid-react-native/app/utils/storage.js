import {AsyncStorage} from 'react-native';

const POKEMONS_KEY = 'POKEMONS_KEY';

export default {
    setPokemons(pokemons) {
        AsyncStorage.setItem(POKEMONS_KEY, JSON.stringify(pokemons))
            .then(json => console.log(json, 'saved'))
            .catch(error => console.log(error));
    },
    getPokemons() {
        return AsyncStorage.getItem(POKEMONS_KEY)
            .then(json => JSON.parse(json))
            .catch(error => console.log(error));
    }
}
