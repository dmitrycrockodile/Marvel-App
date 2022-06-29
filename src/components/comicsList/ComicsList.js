import { useEffect, useState } from 'react';

import useMarvelService from '../../services/MarvelService';
import ErrorMessage from '../errorMessage/ErrorMessage';
import Spinner from '../spinner/Spinner';

import './comicsList.scss';

const ComicsList = () => {

   const [comicsList, setComicsList] = useState([]);
   const [offset, setOffset] = useState(0);
   const [comicsEnded, setComicsEnded] = useState(false);
   const [newComicsLoading, setNewComicsLoading] = useState(false);

   const {loading, error, getAllComics} = useMarvelService();

   useEffect(() => {
      onRequest(offset, true);
   }, [])

  const onRequest = (offset, initial) => {
      initial ? setNewComicsLoading(false) : setNewComicsLoading(true);
      getAllComics(offset)
         .then(onComicsListLoaded);
  }

   const onComicsListLoaded = (newComicsList) => {
      let ended = false;
      if (newComicsList.length < 8) {
         ended = true;
      }

      setNewComicsLoading(false);
      setComicsList([...comicsList, ...newComicsList]);
      setOffset(offset => offset + 8);
      setComicsEnded(ended);
   }

   function renderItems(arr) {
      const items = arr.map(comics => {
         return ( 
            <li className="comics__item" key={comics.id}>
               <a href={comics.homepage}>
                  <img src={comics.thumbnail} alt={comics.title} className="comics__item-img"/>
                  <div className="comics__item-name">{comics.title}</div>
                  <div className="comics__item-price">{comics.price}</div>
               </a>
            </li>
         )
      })

      return (
         <ul className="comics__grid">
            {items}
         </ul>
      )
   }

   const items = renderItems(comicsList);
   const spinner = loading && !newComicsLoading ? <Spinner /> : null;
   const errorMessage = error ? <ErrorMessage /> : null;

   return (
      <div className="comics__list">
         {spinner}
         {errorMessage}
         {items}
         <button className="button button__main button__long" 
                 onClick={() => onRequest(offset)}
                 style={comicsEnded ? {'display': 'none'} : {'display': 'block'}}
                 disabled={newComicsLoading}>
            <div className="inner">load more</div>
         </button>
      </div>
   )
}

export default ComicsList;