var flux = require('flux');

var dispatcher = module.exports = new flux.Dispatcher();

dispatcher.register(function (action) {
    console.log(action);
});
