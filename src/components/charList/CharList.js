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
      offset: 210,
      newItemLoading: false,
      charEnded: false,
   }

   marverlService = new MarvelService();

   componentDidMount() {
      this.onRequire();
   }

   onRequire = (offset) => {
      this.onCharListLoading();

      this.marverlService.getAllCharacters(offset)
      .then(this.onCharListLoaded)
      .catch(this.onError);
   }

   onError = () => {
      this.setState({loading: false, error: true})
   }

   onCharListLoaded = (newCharList) => {
      let ended = false;
      if (newCharList.length < 9) {
         ended = true;
      }

      this.setState(({offset, charList, charEnded}) => ({
         charList: [...charList, ...newCharList],
         loading: false,
         offset: offset + 9,
         newItemLoading: false,
         charEnded: ended,
      }));
   }

   onCharListLoading = () => {
      this.setState({
         newItemLoading: true,
      })
   }

   renderItems(arr) {
      const items = arr.map(item => {
         const {id, thumbnail, name} = item;
         let imgStyle = {'objectFit': 'cover'};

         if (thumbnail === 'http://i.annihil.us/u/prod/marvel/i/mg/b/40/image_not_available.jpg' || thumbnail === 'http://i.annihil.us/u/prod/marvel/i/mg/f/60/4c002e0305708.gif') {
            imgStyle = {'objectFit': 'unset'};
         }

         return (
            <li className="char__item" 
                key={id}
                onClick={() => this.props.onCharSelected(id)}>
               <img src={thumbnail} style={imgStyle} alt={name}/>
               <div className="char__name">{name}</div>
            </li>
         );
      })

      return (
         <ul className="char__grid">
            {items}
         </ul>
      )
   };

   render() {
      const {charList, loading, error, offset, newItemLoading, charEnded} = this.state;
      
      const items = this.renderItems(charList);

      const errorMessage = error ? <ErrorMessage /> : null;
      const spinner = loading ? <Spinner /> : null;
      const content = !(loading || error) ? items : null;

      return (
         <div className="char__list">
               {spinner}
               {errorMessage}
               {content}
            <button className="button button__main button__long"
                    style={charEnded ? {'display': 'none'} : {'display': 'block'}}
                    onClick={() => this.onRequire(offset)}
                    disabled={newItemLoading}>
               <div className="inner">load more</div>
            </button>
         </div>
      )
   }
}