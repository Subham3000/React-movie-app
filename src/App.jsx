import React from 'react'
import Search from './components/Search'
import { useEffect,useState } from 'react';
import { Spinner } from './components/spinner';
import { MovieCard } from './components/MovieCard';
import { useDebounce } from 'react-use';
import { getTrendingMovies, updateSearchCount } from './appwrite';

//API Base URL
const API_BASE_URL ='https://api.simkl.com/';

const API_KEY = import.meta.env.VITE_MDB_API_KEY

const API_OPTIONS = {
  method: 'GET',
  headers: {
    accept: 'application/json',
    Authorization: `Bearer ${API_KEY}`
  }
}

const App = () => {

  const [searchTerm, setsearchTerm] = useState('');
  const [errorMessage, seterrorMessage] = useState('');
  const [moviesList, setmoviesList] = useState([]);
  const [isLoading, setisLoading] = useState(false);
  const [debounceSearchTerm, setdebounceSearchTerm] = useState('');
  const [trendingMovies, settrendingMovies] = useState([]);

  useDebounce( () => setdebounceSearchTerm(searchTerm), 1000, [searchTerm]);

  const fetchMovies = async (query = '') => {

    try {
      setisLoading(true);
      seterrorMessage('');

      const endpoint = query ? `${API_BASE_URL}search/movie?q=${encodeURIComponent(query)}&page=1&limit=10&client_id=${API_KEY}` :`${API_BASE_URL}movies/trending/?extended=overview,theater,metadata,tmdb,genres&client_id=${API_KEY}`;

      const response = await fetch(endpoint, API_OPTIONS);

      // alert(response); 
      // https://api.simkl.com/movies/trending/?extended=overview,theater,metadata,tmdb,genres&client_id=d1ddd5b07fc3e8a6fab63cc915f24579c186411cb3c0e051a3829d90081a07e4

      if (!response.ok) {
        throw new Error("Failed to fetch movies");
      }

      const data = await response.json();

      // console.log(data);

      if (data.response === 'False') {
        seterrorMessage(data.Error || 'Failed to fetch movies 2');
        setmoviesList([]);
        return;
      }

      setmoviesList(data)

      if (query && data.length > 0) {
        await updateSearchCount(query, data[0]);
      }
      
    } catch (error) {
      console.log(`Error fecting movies: ${error}`);
      seterrorMessage('Error fetching movies. Please try again');
    }
    finally{
      setisLoading(false);
    }
    
  }

  const loadTrendingMovies = async () => {
    try {
      const movies = await getTrendingMovies();

      settrendingMovies(movies);
    } catch (error) {
      console.log(`Error fetching trending movies: ${error}`);
    }
  }

  useEffect(() => {
    fetchMovies(debounceSearchTerm);
  }, [debounceSearchTerm]);

  useEffect(() => {
    loadTrendingMovies();
  }, [])
  
  

  return (
    <main>

      <div className="pattern bg-[url('./BG.png')] bg-cover" />
      <div className='wrapper'>

        <header className="">
          <img src="./hero-img.png" alt="Hero Banner" />
          <h1>
            Find <span className='text-gradient '>Movies</span> You'll Enjoy Without the Hassel
          </h1>

          <Search searchTerm={searchTerm} setsearchTerm={setsearchTerm}/>
        </header>

        {trendingMovies.length > 0 && (
          <section className='trending'>
            <h2>Trending Movies</h2>

            <ul>
              {trendingMovies.map((movie, index)=>(
                <li key={movie.$id}>
                  <p>{index + 1}</p>
                  <img src={movie.poster} alt={movie.title} />
                </li>
              ))}
            </ul>
          </section>
        )}

        <section className='all-movies'>
          <h2 className='mt-[40px]'>All Movies</h2>

          {isLoading ? (
            <Spinner/>
          ) : errorMessage ? (
            <p className='text-red-500'>{errorMessage}</p>
          ) : (
            <ul>
              {moviesList.map((movie)=>(
                <MovieCard key={movie.ids['simkl_id']} movie={movie}/>
              ))}
            </ul>
          )}
        </section>
      </div>
      
    </main>
  )
}

export default App