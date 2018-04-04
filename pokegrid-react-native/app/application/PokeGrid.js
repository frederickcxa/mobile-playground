import React, {Component} from 'react';
import {StyleSheet, View, StatusBar, ToolbarAndroid} from 'react-native';
import {connect} from 'react-redux';
import {Constants} from 'expo';
import {PokemonList} from '../components/index';
import * as PokemonsActions from '../redux/actions/pokemons';
import {PRIMARY_COLOR, PRIMARY_DARK_COLOR, WHITE} from '../values/colors';
import {APP_NAME} from '../values/strings';
import {isAndroid} from '../utils/platform';
import storage from '../utils/storage';
import api from '../utils/api';

class PokeGrid extends Component {
    state = {
        isFetching: false
    };

    onRefresh = () => {
        this.fetchPokemons();
    };

    componentDidMount() {
        storage.getPokemons()
            .then(pokemons => {
                pokemons.length
                    ? this.props.addPokemons(pokemons)
                    : this.fetchPokemons();
            })
            .catch(error => {
                this.fetchPokemons();
            })
    }

    fetchPokemons = () => {
        const {isFetching} = this.state;

        if (!isFetching) {
            this.setState({isFetching: true});
            api.fetchPoke(this.props.pokemons.length)
                .then(pokemons => {
                    this.props.addPokemons(pokemons);
                    storage.setPokemons(this.props.pokemons);
                    this.setState({isFetching: false});
                });
        }
    };

    render() {
        const {pokemons} = this.props;

        return (
            <View style={styles.appContainer}>
                <View style={styles.statusBarContainer}>
                    <StatusBar
                        backgroundColor={PRIMARY_DARK_COLOR}
                        barStyle='light-content'
                        translucent
                    />
                </View>
                {isAndroid() &&
                <ToolbarAndroid
                    logo={require('../assets/images/app_logo.png')}
                    style={styles.androidToolbar}
                    title={APP_NAME}
                    titleColor={WHITE}
                />
                }
                <View style={styles.mainContainer}>
                    <PokemonList
                        onRefresh={this.onRefresh}
                        pokemons={pokemons}
                    />
                </View>
            </View>
        );
    }
}

const styles = StyleSheet.create({
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

const mapStateToProps = ({pokemons}) => {
    return {
        pokemons: pokemons.pokemons
    }
};

const mapDispatchToProps = (dispatch) => {
    return {
        addPokemons: (pokemons) => {
            dispatch(PokemonsActions.addPokemons(pokemons))
        }
    }
};

export default connect(mapStateToProps, mapDispatchToProps)(PokeGrid);
