import { useEffect, useState } from 'react';
import PropTypes from 'prop-types';

import Skeleton from '../skeleton/Skeleton';
import MarvelService from '../../services/MarvelService';
import Spinner from '../spinner/Spinner';
import ErrorMessage from '../errorMessage/ErrorMessage';

import './charInfo.scss';

const CharInfo = (props) => {
   
   const [char, setChar] = useState(null);
   const [loading, setLoading] = useState(false);
   const [error, setError] = useState(false);

   useEffect(() => {
      updateChar();
   }, [props.charId])

   const marvelService = new MarvelService();

   const updateChar = () => {
      const {charId} = props;

      if (!charId) {
         return;
      }

      onCharLoading();

      marvelService
         .getCharacter(charId)
         .then(onCharLoaded)
         .catch(onError)
   }

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
      
   const skeleton = loading || error || char ? null : <Skeleton />;
   const spinner = loading ? <Spinner /> : null;
   const errorMessage = error ? <ErrorMessage /> : null;
   const content = !(loading || error || !char) ? <View char={char} /> : null; 

   return (
      <div className="char__info">
         {skeleton}
         {spinner}
         {errorMessage}
         {content}
      </div>
   )
}

const View = ({char}) => {
   const {name, thumbnail, wiki, homepage, description, comics} = char;

   const imageFitStyle = (thumbnail === 'http://i.annihil.us/u/prod/marvel/i/mg/b/40/image_not_available.jpg' || thumbnail === 'http://i.annihil.us/u/prod/marvel/i/mg/f/60/4c002e0305708.gif') ? {'objectFit': 'fill'} : {'objectFit': 'cover'};
   
   let comicsItems = comics.map((item, i) => {
      return (
         <li key={i} className="char__comics-item" style={imageFitStyle}>
            {item.name}
         </li>
      )
   });

   if (comicsItems.length > 10) {
      comicsItems.length = 10;
   } else if (comicsItems.length === 0) {
      comicsItems = 'Sorry, we had not find any comics with this character yet ;(';
   }

   return (
      <>
         <div className="char__basics">
            <img src={thumbnail} alt={name}/>
            <div>
               <div className="char__info-name">{name}</div>
               <div className="char__btns">
                  <a href={homepage} className="button button__main">
                     <div className="inner">homepage</div>
                  </a>
                  <a href={wiki} className="button button__secondary">
                     <div className="inner">Wiki</div>
                  </a>
               </div>
            </div>
         </div>
         <div className="char__descr">
            {description}
         </div>
         <div className="char__comics">Comics:</div>
         <ul className="char__comics-list">
            {comicsItems}
         </ul>
      </>
   )
}

CharInfo.propTypes = {
   charId: PropTypes.number
}

export default CharInfo;