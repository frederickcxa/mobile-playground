import React from 'react';
import {
    Image,
    FlatList,
    StyleSheet,
    Text,
    View
} from 'react-native';
import {
    arrayOf,
    number,
    shape,
    string
} from 'prop-types';
import {DIVIDER_COLOR, SECONDARY_TEXT} from '../../values/colors';
import ProgressBar from '../ProgressBar/ProgressBar';

class PokemonItem extends React.Component {
    shouldComponentUpdate(nextProps, nextState) {
        return this.props.pokemon.number !== nextProps.pokemon.number;
    }

    render() {
        const {name, number, image, types = []} = this.props.pokemon;
        const secondaryInfo = [`#${number}`, types.join('-')];
        const secondaryInfoStyle = [styles.pokemonInfo, styles.pokemonSecondaryInfo];

        return (
            <View style={styles.pokemonItem}>
                <Image
                    style={styles.pokemonImage}
                    source={{uri: image}}
                />
                <Text style={[styles.pokemonInfo, styles.pokemonName]}>{name}</Text>
                <View style={styles.pokemonExtraDataContainer}>
                    {secondaryInfo.map(info => {
                        return <Text key={info} style={secondaryInfoStyle}>{info}</Text>
                    })}
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

const styles = StyleSheet.create({
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

const PokemonList = ({onRefresh = () => {}, pokemons, ...props}) => {
    return (
        <View>
            {pokemons.length === 0
            ? <ProgressBar/>
            : <FlatList
                data={pokemons}
                onEndReached={() => onRefresh()}
                keyExtractor={(item) => item.number}
                renderItem={({item}) => <PokemonItem key={item.number} pokemon={item}/>}
                {...props}
            />
            }
        </View>
    )
};

export default PokemonList;
