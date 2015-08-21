var dispatcher = require('./dispatcher');
var constants  = require('./constants');

Object.keys(constants).forEach(function (key) {

    var funcName = key.split('_').map(function (word, i) {
        if (i === 0) return word.toLowerCase();
        return word[0] + word.slice(1).toLowerCase();
    }).join('');

    exports[funcName] = function (data) {
        dispatcher.dispatch({
            actionType: constants[key],
            data: data
        });
    };
});

/*
exports.chirp = function (data) {
    dispatcher.dispatch({
        actionType: constants.CHIRP,
        data: data
    });
};
*/
