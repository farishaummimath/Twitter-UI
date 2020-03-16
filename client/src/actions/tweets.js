import axios from 'axios'

export const setTweets = (tweets) => {
    return {
        type: 'SET_TWEETS', payload: tweets
    }
}

export const startGetTweets = (searchTerm) => {
    return dispatch => {
        axios.post(`http://localhost:3068/getTweets`, searchTerm)
            .then(response => {
                const tweets = response.data.statuses
                dispatch(setTweets(tweets))
            })
            .catch(err => alert(err))
    }       
    
}