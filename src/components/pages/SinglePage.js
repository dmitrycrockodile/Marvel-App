import { useEffect, useState } from 'react';
import setContent from '../utils/setContent';
import { useParams} from 'react-router-dom';

import AppBanner from "../appBanner/AppBanner";
import useMarvelService from '../../services/MarvelService';

const SinglePage = ({Component, pageType}) => {
   const { id } = useParams();
   const [data, setData] = useState(null);
   const {process, setProcess, getComic, clearError, getCharacter} = useMarvelService();

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
            getComic(id)
               .then(onDataLoaded)
               .then(() => setProcess('performed'));
            break;
         case 'char':
            getCharacter(id)
               .then(onDataLoaded)
               .then(() => setProcess('performed'));
            break;
         default:
            break;
      }
   }

   return (
      <>
         <AppBanner/>
         {setContent(process, Component, data)}
      </>
   )
}

export default SinglePage;