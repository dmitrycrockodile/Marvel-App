import { useState, useCallback } from "react";

export const useHttp = () => {
   const [process, setProcess] = useState('waiting');

   const request = useCallback(async (url, method = 'GET', body = null, headers = {'Content-type': 'application/json'}) => {
      setProcess('loading');

      try {
         const response = await fetch(url, {method, body, headers});
         const data = await response.json();
   
         if (!response.ok) {
            throw new Error(`Couldn't fetch ${url}, status: ${response.status}`)
         }

         return data;

      } catch (e) {
         throw e;
      }
   }, []);

   const clearError = useCallback(() => {
      setProcess('error');
   }, []);
   
   return {request, clearError, process, setProcess};
};