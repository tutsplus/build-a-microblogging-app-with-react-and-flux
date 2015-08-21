var React = require('react');
var UserStore = require('../stores/users');
var actions = require('../actions');
var Link = require('react-router').Link;

var Box = require('./ChirpBox');
var FollowButton = require('./FollowButton');

var UserList = module.exports = React.createClass({
    getInitialState: function () {
        return {
            users: UserStore.all(),
            user: UserStore.currentUser
        };
    },
    mixins: [UserStore.mixin()],
    render: function () {
        var items = this.state.users.filter(function (user) {
            return this.state.user.cid !== user.cid; 
        }.bind(this)).map(function (user) {
            return <Box user={user} key={user.cid}>
                    <FollowButton userId={user.cid} />
                </Box>;
        });

        return <ul> {items} </ul>;
    
    }
});
