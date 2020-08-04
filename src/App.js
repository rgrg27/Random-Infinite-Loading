import React, { Suspense, lazy, Component } from 'react';
import {urlList} from "./constants";
import axios from "axios";
import "./App.css";

const Cards = lazy(() => import('./cards'));


class App extends Component {
  state = {
    items: [],
  };

  getOData(){
    var a;
    for(let i=0;i<6;i++){
       a = this.setNextUrl();
    }
  }
  async getData(){
    let calls = await Promise.all([
    this.setNextUrl(),
    this.setNextUrl(),
    this.setNextUrl(),
    this.setNextUrl(),
    this.setNextUrl(),
    this.setNextUrl()
  ]);
  }
  setNextUrl(){
    var x = Math.floor((Math.random() * urlList.length) );
    axios
      .get(urlList[x])
      .then(resp => resp.json())
      .then(res => {
        if(res.data.url===undefined && res.data.image!==undefined){
          if(this.checkUrl(res.data.image)){
            this.setState({ items: [...this.state.items,res.data.image] });
          }
          else{
            this.setNextUrl();
          }
        }        
        else if(res.data.image===undefined && res.data.url!==undefined){
          if(this.checkUrl(res.data.url)){
            this.setState({ items: [...this.state.items,res.data.url] });
          }
          else{
            this.setNextUrl();
          }
        }
      });
  }
  checkUrl(url){
    var mediaType = url.trim().slice(url.length-3,url.length);
    if(mediaType==="mp4" || mediaType==="ebm"){
      return false;
    }
    if(this.state.items.includes(url)){
      return false;
    }
    return true;
  }
  isBottom(el) {
    return el.getBoundingClientRect().bottom <= window.innerHeight+150;
  }

  componentDidMount() {
    this.getData();
    document.addEventListener('scroll', this.trackScrolling);
  }

  componentWillUnmount() {
    document.removeEventListener('scroll', this.trackScrolling);
  }

  trackScrolling = () => {
    const wrappedElement = document.getElementById('root');
    if (this.isBottom(wrappedElement)) {
      this.getData();
      //document.removeEventListener('scroll', this.trackScrolling);
    }
  };

  render() {
    const loadingImg = <div className="album-img">
      <img alt="loading" src="https://media.giphy.com/media/y1ZBcOGOOtlpC/200.gif" />
    </div>

    const items = this.state.items.map(item => {
      return (
        <Suspense key={item} fallback={loadingImg}>
          <Cards image={item} />
        </Suspense>
      );
    });

    return (
      <div className="app">
        <div className="card-list">
          {items}
        </div>
      </div>
    );
  }
}

export default App;













