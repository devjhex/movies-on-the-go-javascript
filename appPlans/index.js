/* We need features that are to be used at the start of the page application */

//Feature.
//When i first open up the application, i want to see a list of movies. (Design)

//1. A list of movies will be fetched from the TMDB api and it will be returned.

        //Each movie will be displayed in the banner section that is in the html

                    //For Each movie to be showed in the banner section will contain:

                        //The title of the movie.
                        //A backdrop image of the movie.
                        //A poster image of the movie.
                        //A summary of the relevant info like:
                            // Director
                            //Release date
                            // Duration
                            //Ratings
                        
                    //These details will be from data object in the list that has been returned.

             /* Functionality needed
             1. Fetch the data from the tmdb api.
        
        */

    //2. The List of movies will be sorted according to rating (that is in descending order (the biggest rating first to the lowest)) 

        /* Functionality needed

             1.Sort the data returned in descending order according to rating of the movies. 
        
        */

    //3. From the sorted list of movies according to rating render the movies to the specific banner sections according to design

        /* Functionality needed

            -Render the top 3 movies according to rating in the first banner section (the main banner section)
            -Render the rest of the movies in the second banner section that is the one under the heading "Popular on Honey Movies."

        */
    
/* JavaScript Overview for this feature */

/* 
- Fetch movies from the tmdb api
- Sort the movie list according to ratings of the movie.
- Render the movies on the page.
*/

function sortMovies(movies){
    return;
}

function renderMovies(movies){
    return;
}

function renderTopRated(movie){
    return;
}