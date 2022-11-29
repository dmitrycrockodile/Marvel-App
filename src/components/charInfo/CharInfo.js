import { useEffect, useState } from 'react';
import setContent from '../utils/setContent';
import PropTypes from 'prop-types';

import useMarvelService from '../../services/MarvelService';

import './charInfo.scss';

const CharInfo = (props) => {
   const [char, setChar] = useState(null);

   const {getCharacter, clearError, process, setProcess} = useMarvelService();

   useEffect(() => {
      updateChar();
   }, [props.charId])

   const updateChar = () => {
      const {charId} = props;

      if (!charId) {
         return;
      }

      clearError();
      getCharacter(charId)
         .then(onCharLoaded)
         .then(() => setProcess('performed'));
   }

   const onCharLoaded = (char) => {
      setChar(char);
   }

   return (
      <div className="char__info">
         {setContent(process, View, char)}
      </div>
   )
}

const View = ({data}) => {
   const {name, thumbnail, wiki, homepage, description, comics} = data;

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