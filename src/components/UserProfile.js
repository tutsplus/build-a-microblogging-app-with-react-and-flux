var React = require('react');
var UserStore = require('../stores/users');
var ChirpStore = require('../stores/chirps');
var utils = require('../utils');
var FollowButton = require('./FollowButton');

var UserProfile = module.exports = React.createClass({
    getInitialState: function () {
        var id = parseInt(this.props.params.id, 10);

        return {
            user: UserStore.get(id) || {},
            chirps: ChirpStore.byUserId(id)
        };
    },
    mixins: [UserStore.mixin(), ChirpStore.mixin()],
    render: function () {
        console.log("UserProfile Rendering");
        var chirps = this.state.chirps.map(function (chirp) {
            return <li key={chirp.cid}> {chirp.text} </li>;
        });

        return (<div>
            <img className='two columns' src={utils.avatar(this.state.user.email)} />
            <div className='ten columns'>

                <h1> {this.state.user.fullname} </h1>
                <h3 className='timestamp'> @{this.state.user.username} </h3>

                <p> <FollowButton userId={this.state.user.cid} /> </p>

                <ul>
                    {chirps}
                </ul>
            </div>
        </div>);
    }
});
