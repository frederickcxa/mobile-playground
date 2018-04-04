import {ACTIONS_POKEMONS} from '../types';

export function addPokemons(pokemons) {
    return {
        type: ACTIONS_POKEMONS.ADD_POKEMON,
        pokemons
    }
}
