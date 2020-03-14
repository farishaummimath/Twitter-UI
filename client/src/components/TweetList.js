import React from 'react';
import {TransitionGroup} from 'react-transition-group';
import socketIOClient from "socket.io-client";
import TweetCard from './TweetCard';
import {connect} from 'react-redux'
import {getTweets} from '../actions/tweets'


class TweetList extends React.Component {
  constructor(props) {
    super(props);
    this.state = { items: [], searchTerm: "JavaScript" };

    this.handleChange = this.handleChange.bind(this);
    this.handleKeyPress = this.handleKeyPress.bind(this);
  }

  handleChange(event) {
    this.setState({ searchTerm: event.target.value });
  }

  handleKeyPress(event) {
    if (event.key === 'Enter') {
      let term = this.state.searchTerm;
     this.props.dispatch(getTweets(term))
    }
    
  }

componentDidMount() {
  const socket = socketIOClient('localhost:3068');

  socket.on('connect', () => {
    console.log("Socket Connected");
    socket.on("tweets", data => {
      console.info(data);
      let newList = [data].concat(this.state.items.slice(0, 15));
      this.setState({ items: newList });
    });
  });
  socket.on('disconnect', () => {
    socket.off("tweets")
    socket.removeAllListeners("tweets");
    console.log("Socket Disconnected");
  });
}


  render() {
    let items = this.state.items;

    let itemsCards = <TransitionGroup
>
      {items.map((x, i) =>
        <TweetCard key={i} data={x} />
      )}
    </TransitionGroup>;

    let searchControls =
      <div>
        <input id="email" type="text" className="validate" value={this.state.searchTerm} onKeyPress={this.handleKeyPress} onChange={this.handleChange} />
        <label htmlFor="email">Search</label>
      </div>

    let loading = <div>
      <p className="flow-text">Listening to Streams</p>
      <div className="progress lime lighten-3">
        <div className="indeterminate pink accent-1"></div>
      </div>
    </div>

    return (
      <div className="row">
        <div className="col s12 m4 l4">
          <div className="input-field col s12">
            {searchControls}
           
          </div>
        </div>
        <div className="col s12 m4 l4">
          <div>
            {
              items.length > 0 ? itemsCards : loading
            }

          </div>

        </div>
        <div className="col s12 m4 l4">
        </div>
      </div>
    );
  }
}


const mapStateToProps = (state) => {
    return {
        tweets: state.tweets
    }
    
}

export default connect(mapStateToProps)(TweetList)