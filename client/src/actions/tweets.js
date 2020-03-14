
export const setTweets = (tweets) => {
    return {
        type: 'SET_TWEETS', payload: tweets
    }
}

export const getTweets = (term) => {
    return dispatch => {
        fetch("http://localhost:3068/setSearchTerm",
        {
            method: "POST",
            headers: {
            'Content-Type': 'application/json'
            },
            body: JSON.stringify({ term })
        })
        dispatch(setTweets)
    }       
    
}