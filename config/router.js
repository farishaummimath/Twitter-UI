
const Twitter = require('twitter');

module.exports = (app, io) => {
        let twitter = new Twitter({
            consumer_key: 'WPqa3VDI59eh11fse9IQuD7O1',
            consumer_secret: 'DjjPkvwtFoTjpGnwB6cd6O7V5j1i7QijpEuMCqyeRASzZHqlvD',
            access_token_key: '4902493459-q8Kfy0is2qPU9UVm5bkyTXQYn7fcJUrwkdmrqoE',
            access_token_secret: '1f2J3VEAI5texOQYd1W8bmTmmbJPMrSckMoM1YVWhvwf0'
          })
      
          let socketConnection;
          let twitterStream;
      
          app.locals.searchTerm = 'JavaScript'; //Default search term for twitter stream.
      
          /**
           * Resumes twitter stream.
           */
          const stream = () => {
              console.log('Resuming for ' + app.locals.searchTerm);
              twitter.stream('statuses/filter', { track: app.locals.searchTerm }, (stream) => {
                  stream.on('data', (tweet) => {
                      
                      sendMessage(tweet);
                  });
      
                  stream.on('error', (error) => {
                      console.log(error);
                  });
      
                  twitterStream = stream;
              });
          }
      
          /**
           * Sets search term for twitter stream.
           */
          app.post('/setSearchTerm', (req, res) => {
              let term = req.body.term;
              app.locals.searchTerm = term;
              twitterStream.destroy();
              stream();
          });
      
          //Establishes socket connection.
          io.on("connection", socket => {
              socketConnection = socket;
              stream();
              socket.on("connect", () => console.log("Client connected"));
              socket.on("disconnect", () => console.log("Client disconnected"));
          });
      
          /**
           * Emits data from stream.
           * @param {String} msg 
           */
          const sendMessage = (msg) => {
              if (msg.text.includes('RT')) {
                  return;
              }
              socketConnection.emit("tweets", msg);
          }
      };