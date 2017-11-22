import React, { Component } from 'react';
import './App.css';
import axios from 'axios'
import {Accordion, Button, Form, Header, Icon, Loader, TextArea} from 'semantic-ui-react'

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
        <CharacterAccordion
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
        <Header as='h1' className="inputLabel">Enter your text below:</Header>
        <Form>
          <TextArea id="inputText"/>
          <Button className="confirmButton" type="button" onClick={() => this.extractApperances()}>Go!</Button>
        </Form>
        {this.getDescriptionList()}
      </div>
    );
  }
}

class CharacterAccordion extends Component {

  constructor(props) {
    super(props);

    this.state = {
      activeIndex: -1
    };
  }

  handleClick = (e, titleProps) => {
    const index = titleProps.index;
    const activeIndex = this.state.activeIndex;
    const newIndex = activeIndex === index ? -1 : index;

    this.setState({ activeIndex: newIndex });
  }

  createPanels(descriptionMaps) {
    let list = [];
    descriptionMaps.map(character => {
      list.push({
        title: character.name,
        content: {content: <Accordion.Accordion panels={this.createContentPanels(character.d)} />, key: character.name}
      });
    });
    return list;
  }

  createContentPanels(descriptions) {
    let list = [];
    descriptions.map((descString) => {
      let splits = descString.split(';');
      list.push({title: splits[0], content: splits[1]});
    });
    return list;
  }

  render() {
    const {activeIndex} = this.state;
    let map = this.props.map;
    let descriptionMaps = [];
    console.log(map)
    for (var key in map) {
      if (map[key].length > 0) {
        let descriptions = [];
        let entry = map[key]
        for (var i = 0; i < entry.length; i++) {
          if (entry[i].coarsePartOfSpeech === "NOUN"){
            descriptions.push(entry[i+1].lemma + " " + entry[i].form + ";" + entry[i].sentence);
            i++;
          } else {
            descriptions.push(entry[i].lemma + ";" + entry[i].sentence);
          }
        }
        descriptionMaps.push({name: key, d: descriptions});
      }
    }


    return (
      <Accordion defaultActiveIndex={-1} panels={this.createPanels(descriptionMaps)} styled /> 
    );
  }
}

class DescriptionAccordion extends Component {
  constructor(props) {
    super(props);

    this.state = {
      activeIndex: -1
    };
  }

  handleClick = (e, titleProps) => {
    const index = titleProps.index;
    const activeIndex = this.state.activeIndex;
    const newIndex = activeIndex === index ? -1 : index;

    this.setState({ activeIndex: newIndex });
  }

  render () {
    const {activeIndex} = this.state;
    return (
      <Accordion>
        <Accordion.Title active={activeIndex=== 0} index={0} onClick={this.handleClick}>
          <Icon name='dropdown' />
          {this.props.description}
        </Accordion.Title>
        <Accordion.Content active={activeIndex=== 0}>
          {this.props.sentence}
        </Accordion.Content>
      </Accordion>
    );
  }
}



export default App;
