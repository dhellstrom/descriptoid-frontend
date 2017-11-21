import React, { Component } from 'react';
import './App.css';
import axios from 'axios'
import {Loader} from 'semantic-ui-react'

class App extends Component {
  constructor(props) {
    super(props);

    this.state = {
      jsonResponse: null,
      waitingForResult: false,
      networkError: false
    };
  }

  extractApperances() {
    let data = document.getElementById("inputText").value;
    if (data.length > 0) {
      this.setState({
        waitingForResult: true,
        jsonResponse: null
      });
      axios.post('http://localhost:8080', data)
      .then(res => {
        this.setState({
          jsonResponse: res,
          waitingForResult: false
        });
      })
      .catch(error => {
        this.setState({
          waitingForResult: false,
          networkError: true
        });
      });
    }
  }

  getDescriptionList() {
    if (this.state.jsonResponse != null) {
      return (
        <DescriptionView
          map={this.state.jsonResponse.data}
        />
      );
    } else if (this.state.waitingForResult) {
      return (
        <Loader active inline='centered'>Loading</Loader>
      );
    } else if (this.state.networkError) {
      return (
        <p>Error sending the data, please try again!</p>
      );
    }
  }


  render() {
    return (
      <div className="App">
        <h1 className="inputLabel">Enter your text below:</h1>
        <textarea id="inputText" rows="4" cols="50"></textarea>
        <button className="confirmButton" type="button" onClick={() => this.extractApperances()}>Go!</button>
        {this.getDescriptionList()}
      </div>
    );
  }
}

function DescriptionView(props) {
  let descriptionMaps = [];
  console.log(props.map)
  for (var key in props.map) {
    if (props.map[key].length > 0) {
      let descriptions = [];
      for (var i = 0; i < props.map[key].length; i++) {
        if (props.map[key][i].coarsePartOfSpeech === "NOUN"){
          descriptions.push(props.map[key][i+1].lemma + " " + props.map[key][i].predictedLemma);
          i++;
        } else {
          descriptions.push(props.map[key][i].lemma);
        }
      }
      descriptionMaps.push({name: key, d: descriptions});
    }
  }
  return (
    <ul>
      {
        descriptionMaps.map((character) => {
          let i = 0;
          return (<li key={character.name}>
            {character.name} 
              <ul>
                {
                  character.d.map((desc) => {
                    return (<li key={"desc" + i++}>{desc}</li>)
                  })
                }
              </ul>            
          </li>);
        })
      }
    </ul>
  );
}

export default App;
