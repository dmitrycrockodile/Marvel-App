import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';

import Spinner from '../spinner/Spinner';
import ErrorMessage from '../errorMessage/ErrorMessage';
import useMarvelService from '../../services/MarvelService';

import './comicsList.scss';

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

const ComicsList = () => {

   const [comicsList, setComicsList] = useState([]);
   const [offset, setOffset] = useState(0);
   const [comicsEnded, setComicsEnded] = useState(false);
   const [newComicsLoading, setNewComicsLoading] = useState(false);

   const {process, setProcess, getAllComics} = useMarvelService();

   useEffect(() => {
      onRequest(offset, true);
   }, [])

   const onRequest = (offset, initial) => {
      initial ? setNewComicsLoading(false) : setNewComicsLoading(true);
      getAllComics(offset)
         .then(onComicsListLoaded)
         .then(() => setProcess('performed'));
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
               <Link to={`/comics/${comics.id}`}>
                  <img src={comics.thumbnail} alt={comics.title} className="comics__item-img"/>
                  <div className="comics__item-name">{comics.title}</div>
                  <div className="comics__item-price">{comics.price}</div>
               </Link>
            </li>
         )
      })

      return (
         <ul className="comics__grid">
            {items}
         </ul>
      )
   }

   return (
      <div className="comics__list">
         {setContent(process, () => renderItems(comicsList), newComicsLoading)}
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