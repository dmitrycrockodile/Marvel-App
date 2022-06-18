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
   }

   componentDidMount() {
      this.marverlService.getAllCharacters()
      .then(this.onCharListLoaded)
      .catch(this.onError);
   }

   marverlService = new MarvelService();

   onError = () => {
      this.setState({loading: false, error: true})
   }

   onCharListLoaded = (charList) => {
      this.setState({charList, loading: false});
   }

   renderItems(arr) {
      const items = arr.map(item => {
         const {id, thumbnail, name} = item;
         let imgStyle = {'objectFit': 'cover'};

         if (thumbnail === 'http://i.annihil.us/u/prod/marvel/i/mg/b/40/image_not_available.jpg') {
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
      const {charList, loading, error} = this.state;
      
      const items = this.renderItems(charList);

      const errorMessage = error ? <ErrorMessage /> : null;
      const spinner = loading ? <Spinner /> : null;
      const content = !(loading || error) ? items : null;

      return (
         <div className="char__list">
               {spinner}
               {errorMessage}
               {content}
            <button className="button button__main button__long">
               <div className="inner">load more</div>
            </button>
         </div>
      )
   }
}