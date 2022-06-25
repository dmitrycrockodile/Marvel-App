import { useEffect, useRef, useState } from 'react';

import useMarvelService from '../../services/MarvelService';
import ErrorMessage from '../errorMessage/ErrorMessage';
import Spinner from '../spinner/Spinner';

import './charList.scss';

const CharList = (props) => {

   const [charList, setCharList] = useState([]);
   const [offset, setOffset] = useState(210);
   const [newItemLoading, setNewItemLoading] = useState(false);
   const [charEnded, setCharEnded] = useState(false);

   const {loading, error, getAllCharacters} = useMarvelService();

   useEffect(() => {
      onRequest(offset, true);
   }, [])

   const onRequest = (offset, initial) => {
      initial ? setNewItemLoading(false) : setNewItemLoading(true);

      getAllCharacters(offset)
         .then(onCharListLoaded);
   }

   const onCharListLoaded = (newCharList) => {
      let ended = false;
      if (newCharList.length < 9) {
         ended = true;
      }

      setOffset(offset => offset + 9);
      setCharList(charList => [...charList, ...newCharList]);
      setNewItemLoading(false);
      setCharEnded(ended);
   }

   const itemRefs = useRef([]);

   const onFoucsItem = (id) => {
      itemRefs.current.forEach(item => item.classList.remove('char__item_selected'));
      itemRefs.current[id].classList.add('char__item_selected');
      itemRefs.current[id].focus();
   }

   function renderItems(arr) {
      const items = arr.map((item, i) => {
         const {id, thumbnail, name} = item;
         let imgStyle = {'objectFit': 'cover'};

         if (thumbnail === 'http://i.annihil.us/u/prod/marvel/i/mg/b/40/image_not_available.jpg' || thumbnail === 'http://i.annihil.us/u/prod/marvel/i/mg/f/60/4c002e0305708.gif') {
            imgStyle = {'objectFit': 'unset'};
         }

         return (
            <li className="char__item" 
                tabIndex={0}
                ref={el => itemRefs.current[i] = el}
                key={id}
                onClick={() => {
                   props.onCharSelected(id);
                   onFoucsItem(i);
                }}
                onKeyPress={(e) => {
                   if (e.key === ' ' || e.key === 'Enter') {
                     props.onCharSelected(id);
                     onFoucsItem(i);
                   }
                }

                }
            >
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
   
   const items = renderItems(charList);

   const errorMessage = error ? <ErrorMessage /> : null;
   const spinner = loading && !newItemLoading ? <Spinner /> : null;

   return (
      <div className="char__list">
            {spinner}
            {errorMessage}
            {items}
         <button className="button button__main button__long"
                  style={charEnded ? {'display': 'none'} : {'display': 'block'}}
                  onClick={() => onRequest(offset)}
                  disabled={newItemLoading}>
            <div className="inner">load more</div>
         </button>
      </div>
   )
}


export default CharList;