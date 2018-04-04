import React from 'react';
import {Provider} from 'react-redux';
import store from './app/redux/store';
import PokeGrid from './app/application/PokeGrid';

export default class App extends React.Component {
    render() {
        return (
            <Provider store={store}>
                <PokeGrid/>
            </Provider>
        );
    }
};
