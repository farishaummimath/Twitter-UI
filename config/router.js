const Twitter = require('twitter');

module.exports = (app, io) => {
    let twitter = new Twitter({
        consumer_key: 'WPqa3VDI59eh11fse9IQuD7O1',
        consumer_secret: 'DjjPkvwtFoTjpGnwB6cd6O7V5j1i7QijpEuMCqyeRASzZHqlvD',
        access_token_key: '4902493459-q8Kfy0is2qPU9UVm5bkyTXQYn7fcJUrwkdmrqoE',
        access_token_secret: '1f2J3VEAI5texOQYd1W8bmTmmbJPMrSckMoM1YVWhvwf0'
      })
  
    let socketConnection
    let searchTerm

    const stream = () => {
        twitter.stream('statuses/filter', { track: searchTerm }, (stream) => {
            stream.on('data', (tweet) => {
                sendMessage(tweet);
            });

            stream.on('error', (error) => {
                console.log(error);
            });
        });
    }

    app.post('/getTweets', (req, res) => {

        searchTerm = req.body.searchTerm;
        twitter.get('search/tweets', {q : searchTerm, count : 100})
        .then(tweets => {
            res.json(tweets) 
        })
        .catch(err => res.json(err))
        stream()
    })

    io.on("connection", socket => {
        socketConnection = socket
        stream()
        socket.on("connection", () => console.log("Client connected"))
        socket.on("disconnect", () => console.log("Client disconnected"))
    })

    const sendMessage = (msg) => {
        socketConnection.emit("tweets",msg);
    }
}