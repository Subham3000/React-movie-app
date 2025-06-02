import React from 'react'

// const poster_URL = 'https://wsrv.nl/?url=https://simkl.in/posters/74/74415673dcdc9cdd_m.jpg'

export const MovieCard = ({movie:{title,poster,ratings,release_date}}) => {
  return (
    <div className='movie-card'>
        <img src={
            poster ? `https://wsrv.nl/?url=https://simkl.in/posters/${poster}_m.jpg` : '/No-Poster.png'
        } 
        alt={title} 
        />

        <div className='mt-4'>
            <h3>{title}</h3>

            <div className='content'>
                <div className='rating'>
                    <img src="star.svg" alt="Star Icon" />
                    <p>{ratings ? ratings.imdb['rating'] : 'N/A'}</p>
                    <span>•</span>
                    <p className='year'>
                        {release_date ? release_date.split('/')[2] : 'N/A'}
                    </p>
                </div>
            </div>
        </div>
    </div>
  )
}
