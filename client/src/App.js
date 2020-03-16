import React from 'react';
import './App.css';
import { BrowserRouter , Route, Switch} from 'react-router-dom'

import TweetList from './components/TweetList'

function App() {
  return (
    <BrowserRouter>
     <>
    <div className="App"> 
      <Switch>
          <Route path = "/" component = {TweetList} exact = {true} />
      </Switch>
    </div>
      
    </>
    </BrowserRouter>

      
  );
}

export default App;

