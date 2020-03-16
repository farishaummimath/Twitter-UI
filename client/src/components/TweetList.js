import React from 'react';
import InfiniteScroll from 'react-infinite-scroll-component'
import socketIOClient from "socket.io-client";
import TweetCard from './TweetCard';
import {connect} from 'react-redux'
import { startGetTweets } from '../actions/tweets'


class TweetList extends React.Component {
    constructor(props) {
      super(props);
      this.state = {
        searchTerm : "",
        hasMore : false,
        tweetLength : 10,
        tweetList : []
      }
 
  }

  handleChange= (event) => {
    this.setState({ searchTerm: event.target.value });
  }

  handleSubmit=(event) =>{
    event.preventDefault()
      const formData = {
        searchTerm : this.state.searchTerm
      }     
      this.props.dispatch(startGetTweets(formData))
    
  }

componentDidMount() {
 
  const socket = socketIOClient('localhost:3068');

  socket.on('connect', () => {
    console.log("Socket Connected");
    socket.on("tweets", data => {
      let newtweetList = [data].concat(this.state.tweetList.slice(0, 10));
      this.setState({ hasMore:true,tweetList: newtweetList });
    });
  });
  socket.on('disconnect', () => {
    socket.off("tweets")
    socket.removeAllListeners("tweets");
    console.log("Socket Disconnected");
  });
}

fetchData = () => {
    this.setState(prevState => ({
      tweetList : [...prevState.tweetList, ...this.props.tweetList.slice(prevState.tweetList.length, (prevState.tweets.length + prevState.length))]
    }))
}

  render() {

    return (
        <>
        <div className="row">
          <form onSubmit={this.handleSubmit}>
            <input
              type="text"
              placeholder="Search for Tweets"
              value={this.state.searchTerm}
              onChange={this.handleChange} />
              <input type="submit" value='Search'/>
            </form>
        </div>
        <div className="row">
        <InfiniteScroll
              dataLength = {this.state.tweetList.length}
              next = {this.fetchData}
              hasMore = {this.state.hasMore}
              loader={<h4>Fetching Tweet...</h4>}
            >
            {this.state.tweetList && this.state.tweetList.map((tweet, i) => <TweetCard key = {i} data = {tweet} />
            ) }
            </InfiniteScroll>
        </div>
        </>

        
        
    );
  }
}


const mapStateToProps = (state) => {
    return {
        tweets: state.tweets
    }
    
}

export default connect(mapStateToProps)(TweetList)