import { useEffect, useState } from 'react';

import { useParams} from 'react-router-dom';

import AppBanner from "../appBanner/AppBanner";
import ErrorMessage from '../errorMessage/ErrorMessage';
import Spinner from '../spinner/Spinner';
import useMarvelService from '../../services/MarvelService';

const SinglePage = ({Component, pageType}) => {
   const { id } = useParams();
   const [data, setData] = useState(null);
   const {loading, error, getComic, clearError, getCharacter} = useMarvelService();

   useEffect(() => {
      updateData();
   }, [id])

   const onDataLoaded = (data) => {
      setData(data);
   }

   const updateData = () => {
      clearError();
      
      switch (pageType) {
         case 'comic':
            getComic(id).then(onDataLoaded);
            break;
         case 'char':
            getCharacter(id).then(onDataLoaded);
            break;
         default:
            break;
      }
   }

   const spinner = loading ? <Spinner /> : null;
   const errorMessage = error ? <ErrorMessage /> : null;
   const content = !(loading || error || !data) ? <Component data={data}/> : null;

   return (
      <>
         <AppBanner/>
         {spinner}
         {errorMessage}
         {content}
      </>
   )
}

export default SinglePage;