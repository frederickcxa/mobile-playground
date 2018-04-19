import React, { Component } from 'react';
import { Constants } from 'expo';
import {
  ActivityIndicator,
  AsyncStorage,
  FlatList,
  Image,
  Platform,
  StatusBar,
  StyleSheet,
  Text,
  ToolbarAndroid,
  View
} from 'react-native';
import {
  arrayOf,
  number,
  shape,
  string
} from 'prop-types';

// Storage key
const POKEMONS_KEY = 'POKEMONS_KEY';

// App colors
export const PRIMARY_COLOR = '#F44336';
export const PRIMARY_DARK_COLOR = '#D32F2F';
export const WHITE = '#FFFFFF';
export const SECONDARY_TEXT = '#757575';
export const DIVIDER_COLOR = '#BDBDBD';

// App strings
export const APP_NAME = 'PokeGrid';
export const ANDROID_OS = 'android';

// API constants
const BASE_URL = 'https://pokeapi.co/api/v2';
const IMAGE_BASE_URL = 'https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon';
const PATH_POKEMON = 'pokemon';

// Utils functions
const setPokemons = (pokemons) => {
  AsyncStorage.setItem(POKEMONS_KEY, JSON.stringify(pokemons))
    .catch(console.log);
};

const getPokemons = () => {
  return AsyncStorage.getItem(POKEMONS_KEY)
    .then(json => JSON.parse(json))
    .catch(console.log);
};

const mapItemToPokemon = (item) => {
  const { name, url } = item;

  const segments = url.split('/');
  const number = segments.pop() || segments.pop();

  return {
    number: parseInt(number),
    name: `${name[0].toUpperCase()}${name.substr(1)}`,
    image: [IMAGE_BASE_URL, `${number}.png`].join('/')
  }
};

const fetchPoke = (offset) => {
  const params = `limit=50&offset=${offset}`;
  const url = [BASE_URL, PATH_POKEMON].join('/');
  const urlWithParams = `${url}?${params}`;

  return fetch(urlWithParams)
    .then(response => response.json())
    .then(responseJson => responseJson.results)
    .then(items => items.map(mapItemToPokemon))
    .catch(console.log);
};

// Components
const ProgressBar = ({ size = 'large', color = PRIMARY_COLOR, ...props }) => (
  <View style={progressBarStyles.container}>
    <ActivityIndicator size={size} color={color} {...props}/>
  </View>
);

ProgressBar.propTypes = {
  color: string.isRequired,
  size: string
};

const progressBarStyles = {
  container: {
    justifyContent: 'center',
    alignContent: 'center'
  }
};

class PokemonItem extends React.Component {
  shouldComponentUpdate(nextProps, nextState) {
    return this.props.pokemon.number !== nextProps.pokemon.number;
  }

  render() {
    const { name, number, image, types = [] } = this.props.pokemon;
    const secondaryInfo = [`#${number}`, types.join('-')];
    const secondaryInfoStyle = [pokemonItemStyles.pokemonInfo, pokemonItemStyles.pokemonSecondaryInfo];

    return (
      <View style={pokemonItemStyles.pokemonItem}>
        <Image
          style={pokemonItemStyles.pokemonImage}
          source={{ uri: image }}
        />
        <Text style={[pokemonItemStyles.pokemonInfo, pokemonItemStyles.pokemonName]}>{name}</Text>
        <View style={pokemonItemStyles.pokemonExtraDataContainer}>
          {secondaryInfo.map(info => <Text key={info} style={secondaryInfoStyle}>{info}</Text>)}
        </View>
      </View>
    )
  }
}

PokemonItem.propTypes = {
  pokemon: shape({
    name: string.isRequired,
    number: number.isRequired,
    image: string.isRequired,
    types: arrayOf(string)
  })
};

const pokemonItemStyles = StyleSheet.create({
  pokemonItem: {
    paddingTop: 12,
    paddingBottom: 12,
    display: 'flex',
    borderBottomColor: DIVIDER_COLOR,
    alignContent: 'center',
    flexDirection: 'row',
    borderBottomWidth: 1
  },
  pokemonImage: {
    width: 50,
    height: 50
  },
  pokemonName: {
    alignSelf: 'center',
    flexGrow: 1
  },
  pokemonInfo: {
    color: SECONDARY_TEXT
  },
  pokemonSecondaryInfo: {
    alignSelf: 'flex-end',
    marginRight: 12
  },
  pokemonExtraDataContainer: {
    display: 'flex',
    justifyContent: 'space-between'
  }
});

const PokemonList = ({ onRefresh = () => {}, pokemons = [], ...props }) => {
  return (
    <View>
      {pokemons.length === 0
        ? <ProgressBar/>
        : <FlatList
          data={pokemons}
          onEndReached={() => onRefresh()}
          keyExtractor={(item) => item.number}
          renderItem={({ item }) => <PokemonItem key={item.number} pokemon={item}/>}
          {...props}
        />
      }
    </View>
  )
};

class PokeGrid extends Component {
  state = {
    isFetching: false,
    pokemons: []
  };

  onRefresh = () => {
    this.fetchPokemons();
  };

  componentDidMount() {
    getPokemons()
      .then(pokemons => {
        pokemons.length
          ? this.fetchPokemons()
          : this.fetchPokemons();
      })
      .catch(this.fetchPokemons)
  }

  fetchPokemons = () => {
    const { isFetching, pokemons } = this.state;

    if (!isFetching) {
      this.setState({ isFetching: true });
      fetchPoke(pokemons.length)
        .then(data => {
          const allPokemons = [...pokemons, ...data];

          this.setState({ pokemons: allPokemons, isFetching: false });
          setPokemons(allPokemons);
        });
    }
  };

  render() {
    const { pokemons } = this.state;

    return (
      <View style={pokeGridStyles.appContainer}>
        <View style={pokeGridStyles.statusBarContainer}>
          <StatusBar
            backgroundColor={PRIMARY_DARK_COLOR}
            barStyle='light-content'
            translucent
          />
        </View>
        {Platform.OS === ANDROID_OS &&
        <ToolbarAndroid
          logo={require('./app/assets/images/app_logo.png')}
          style={pokeGridStyles.androidToolbar}
          title={APP_NAME}
          titleColor={WHITE}
        />
        }
        <View style={pokeGridStyles.mainContainer}>
          <PokemonList
            onRefresh={this.onRefresh}
            pokemons={pokemons}
          />
        </View>
      </View>
    );
  }
}

const pokeGridStyles = StyleSheet.create({
  appContainer: {
    flex: 1,
    backgroundColor: WHITE,
  },
  mainContainer: {
    flex: 1,
    justifyContent: 'center',
    alignContent: 'center'
  },
  androidToolbar: {
    backgroundColor: PRIMARY_COLOR,
    elevation: 4,
    height: 56
  },
  statusBarContainer: {
    backgroundColor: PRIMARY_DARK_COLOR,
    height: Constants.statusBarHeight
  }
});

export default () => (
  <PokeGrid/>
);
