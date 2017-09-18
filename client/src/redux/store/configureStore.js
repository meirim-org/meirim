'use strict';

var Redux       = require('redux'),
    thunk       = require('redux-thunk').default;

var storeSingleton = null;

var getStore = function configureStore (initialState, reducer){
    if (!storeSingleton) {

        var rootReducer;

        switch (reducer) {

            default:
                rootReducer = require("../reducers/rootReducer");
                break;
        }

        storeSingleton = Redux.createStore(rootReducer,
            initialState,
            Redux.applyMiddleware(thunk)

        );

        storeSingleton.dispatch({type: "@@INIT_STORE"});
    }

    return storeSingleton;
};

module.exports = getStore;
