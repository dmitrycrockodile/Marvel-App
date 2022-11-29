import { useEffect, useRef, useState } from 'react';
import PropTypes from 'prop-types';

import Spinner from '../spinner/Spinner';
import ErrorMessage from '../errorMessage/ErrorMessage';
import useMarvelService from '../../services/MarvelService';

import './charList.scss';

const setContent = (processName, Component, newItemLoading) => {
   switch (processName) {
      case 'waiting':
         return <Spinner />;
      case 'loading':
         return newItemLoading ? <Component /> : <Spinner />;
      case 'performed':
         return <Component />
      case 'error':
         return <ErrorMessage />
      default:
         throw new Error('Unexpected process name');
   }
}

const CharList = (props) => {
   const [charList, setCharList] = useState([]);
   const [offset, setOffset] = useState(210);
   const [newItemLoading, setNewItemLoading] = useState(false);
   const [charEnded, setCharEnded] = useState(false);

   const {getAllCharacters, process, setProcess} = useMarvelService();

   useEffect(() => {
      onRequest(offset, true);
   }, [])

   const onRequest = (offset, initial) => {
      initial ? setNewItemLoading(false) : setNewItemLoading(true);

      getAllCharacters(offset)
         .then(onCharListLoaded)
         .then(() => setProcess('performed'));
   }

   const onCharListLoaded = (newCharList) => {
      let ended = false;
      if (newCharList.length < 9) {
         ended = true;
      }

      setOffset(offset => offset + 9);
      setCharList([...charList, ...newCharList]);
      setNewItemLoading(false);
      setCharEnded(charEnded => ended);
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
            }>
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

   return (
      <div className="char__list">
            {setContent(process, () => renderItems(charList), newItemLoading)}
         <button className="button button__main button__long"
                  style={charEnded ? {'display': 'none'} : {'display': 'block'}}
                  onClick={() => onRequest(offset)}
                  disabled={newItemLoading}>
            <div className="inner">load more</div>
         </button>
      </div>
   )
}

CharList.propTypes = {
   onCharSelected: PropTypes.func.isRequired
}

export default CharList;