import { useEffect, useState } from 'react';

import MarvelService from '../../services/MarvelService';
import Spinner from '../spinner/Spinner';
import ErrorMessage from '../errorMessage/ErrorMessage';

import mjolnir from '../../resources/img/mjolnir.png';

import './randomChar.scss';

const RandomChar = () => {

   const [char, setChar] = useState({});
   const [loading, setLoading] = useState(true);
   const [error, setError] = useState(false);

   useEffect(() => {
      updateChar();
      // const timerId = setInterval(updateChar, 10000);

      // return () => clearInterval(timerId);
   }, [])

   const marvelService = new MarvelService();

   const onCharLoaded = (char) => {
      setChar(char);
      setLoading(false);
   }

   const onCharLoading = () => {
      setLoading(true);
   }

   const onError = () => {
      setError(true);
      setLoading(false);
   }

   const updateChar = () => {
      const id = Math.floor(Math.random() * (1011400 - 1011000) + 1011000);

      onCharLoading();

      marvelService
         .getCharacter(id)
         .then(onCharLoaded)
         .catch(onError)
   }

   const spinner = loading ? <Spinner /> : null;
   const errorMessage = error ? <ErrorMessage /> : null;
   const content = !(loading || error) ? <View char={char} /> : null;

   return (
      <div className="randomchar">
         {spinner}
         {errorMessage}
         {content}
         <div className="randomchar__static">
            <p className="randomchar__title">
               Random character for today!<br/>
               Do you want to get to know him better?
            </p>
            <p className="randomchar__title">
               Or choose another one
            </p>
            <button className="button button__main">
               <div className="inner" onClick={updateChar}>try it</div>
            </button>
            <img src={mjolnir} alt="mjolnir" className="randomchar__decoration"/>
         </div>
      </div>
   )
}

const View = ({char}) => {
   const {name, description, thumbnail, homepage, wiki} = char;

   const imageFitStyle = (thumbnail === 'http://i.annihil.us/u/prod/marvel/i/mg/b/40/image_not_available.jpg' || thumbnail === 'http://i.annihil.us/u/prod/marvel/i/mg/f/60/4c002e0305708.gif') ? {'objectFit': 'fill'} : {'objectFit': 'cover'};

   const modifiedDescription = (description.length === 0) ? 'Sorry, we did not find any information about this character yet..' : (description.length > 250) ? description.slice(0, 230) : description;

   return (
      <div className="randomchar__block">
         <img src={thumbnail} style={imageFitStyle} alt="Random character" className="randomchar__img"/>
         <div className="randomchar__info">
            <p className="randomchar__name">{name}</p>
            <p className="randomchar__descr">
               {modifiedDescription}
            </p>
            <div className="randomchar__btns">
               <a href={homepage} className="button button__main">
                  <div className="inner">homepage</div>
               </a>
               <a href={wiki} className="button button__secondary">
                  <div className="inner">wiki</div>
               </a>
            </div>
         </div>
      </div>
   )
}

export default RandomChar;