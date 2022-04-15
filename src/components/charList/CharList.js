import React from 'react';
import { Component } from 'react';

import MarvelService from '../../services/MarvelService';
import ErrorMessage from '../errorMessage/ErrorMessage';
import Spinner from '../spinner/Spinner';

import './charList.scss';

export default class CharList extends Component {

   state = {
      charList: [],
      loading: true,
      error: false,
      newItemLoading: false,
      offset: 210,
      charEnded: false,
   }

   marvelService = new MarvelService();

   componentDidMount() {
      this.onRequest();
   }

   onRequest = (offset) => {
      this.onCharListLoading();
      this.marvelService.getAllCharacters(offset)
         .then(this.charListLoaded)
         .catch(this.onError)
   }

   onCharListLoading = () => {
      this.setState({
         newItemLoading: true
      })
   }

   charListLoaded = (newCharList) => {
      let ended = false;

      if (newCharList.length < 9) {
         ended = true;
      }

      this.setState(({offset, charList}) => ({
         charList: [...charList, ...newCharList],
         loading: false,
         newItemLoading: false,
         offset: offset + 9,
         charEnded: ended,
      }))
   }

   renderItems = (arr) => {
      const items = arr.map(item => {
         let imgStyle = {'objectFit' : 'cover'};
         // eslint-disable-next-line
         if (item.thumbnail == 'http://i.annihil.us/u/prod/marvel/i/mg/b/40/image_not_available.jpg' || item.thumbnail == 'http://i.annihil.us/u/prod/marvel/i/mg/f/60/4c002e0305708.gif') {
            imgStyle = {'objectFit' : 'unset'};
         }

         return (
            <li key={item.id} 
                className="char__item"
                onClick={() => this.props.onCharSelected(item.id)}>
               <img src={item.thumbnail} alt={item.name} style={imgStyle}/>
               <div className="char__name">{item.name}</div>
            </li>
         )
      });

      return (
         <ul className="char__grid">
            {items}
         </ul>
      )
   }

   onError = () => {
      this.setState({
         error: true,
         loading: false,
      })
   }
  
   render() {
      const {charList, loading, error, offset, newItemLoading, charEnded} = this.state;

      const items = this.renderItems(charList);

      const spinner = loading ? <Spinner/> : null;
      const errorMessage = error ? <ErrorMessage/> : null;
      const content = !(error || loading) ? items : null;

      return (
         <div className="char__list">
            {spinner}
            {errorMessage}
            {content}
            <button 
               className="button button__main button__long"
               disabled={newItemLoading}
               style={{'display' : charEnded === true ? 'none' : 'block'}}
               onClick={() => this.onRequest(offset)}>
                  <div className="inner">load more</div>
            </button>
         </div>
      )
   }
}