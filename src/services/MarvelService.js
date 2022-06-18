// class MarvelService {
//    _apiBase = 'https://gateway.marvel.com:443/v1/public/';
//    _apiKey = 'apikey=b1ee04d358e33edb238945fb86acb66e';
//    _baseOffset = 210;

//    getResource = async (url) => {
//       let res = await fetch(url);

//       if (!res.ok) {
//          throw new Error(`Couldn't fetch ${url}, status: ${res.status}`)
//       }

//       return await res.json();
//    }

//    getAllCharacters = async (offset = this._baseOffset) => {
//       const res = await this.getResource(`${this._apiBase}characters?limit=9&offset=${offset}&${this._apiKey}`);
//       return res.data.results.map(this._transformCharacter);
//    }

//    getCharacter = async (id) => {
//       const res = await this.getResource(`${this._apiBase}characters/${id}?${this._apiKey}`);
//       return this._transformCharacter(res.data.results[0]);
//    }

//    _transformCharacter = (char) => {
//       const sorryMessage = 'Sorry, but we didn\'t find any information about this character :(';
//       const extraDescr = char.description.substr(0, 200) + '...';

//       return {
//          id: char.id,
//          name: char.name,
//          description: char.description === "" ? sorryMessage : extraDescr,
//          thumbnail: [char.thumbnail.path + '.' + char.thumbnail.extension],
//          homepage: char.urls[0].url,
//          wiki: char.urls[1].url,
//          comics: char.comics.items
//       }
//    }
// }

// export default MarvelService;

export default class MarvelService {
   _apiBase = 'https://gateway.marvel.com:443/v1/public/';
   _apiKey = 'apikey=b1ee04d358e33edb238945fb86acb66e';

   getResource = async (url) => {
      let res = await fetch(url);

      if (!res.ok) {
         throw new Error(`Couldn't fetch ${url}, status: ${res.status}`)
      }

      return await res.json();
   }

   getAllCharacters = async () => {
      const res = await this.getResource(`${this._apiBase}characters?limit=9&offset=210&${this._apiKey}`);
      return res.data.results.map(this._transformCharacter);
   }

   getCharacter = async (id) => {
      const res = await this.getResource(`${this._apiBase}characters/${id}?${this._apiKey}`);
      return this._transformCharacter(res.data.results[0]);
   } 

   _transformCharacter = (char) => {
      return {
         id: char.id,
         name: char.name,
         description: char.description,
         thumbnail: `${char.thumbnail.path}.${char.thumbnail.extension}`,
         homepage: char.urls[0].url,
         wiki: char.urls[1].url,
         comics: char.comics.items,
      }
   }
}