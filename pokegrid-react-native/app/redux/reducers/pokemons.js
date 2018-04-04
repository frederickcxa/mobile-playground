import {ACTIONS_POKEMONS} from '../types';

const defaultState = {
    pokemons: []
};

export default function pokemonsReducer (state = defaultState, action) {
    switch (action.type) {
        case ACTIONS_POKEMONS.ADD_POKEMON: {
            return {
                pokemons: [...state.pokemons, ...action.pokemons]
            }
        }
        default: {
            return state;
        }
    }
}
