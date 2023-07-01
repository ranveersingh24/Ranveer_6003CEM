import { useState } from "react";
import { WatchedMoviesList } from "./WatchedMoviesList";
import { MovieDetails } from "./MovieDetails";
import { WatchedSummary } from "./WatchedSummary";
import { MovieList } from "./MovieList";
import { Box } from "./Box";
import { Main } from "./Main";
import { SearchBar } from "./SearchBar";
import { NumResults } from "./NumResults";
import { Logo } from "./Logo";
import { NavBar } from "./NavBar";
import { ErrorMessage } from "./ErrorMessage";
import { Loader } from "./Loader";
import { useMovies } from "./useMovies";
import { useLocalStorageState } from "./useLocalStorageState";

export const KEY = "fc1d5233";

export const average = (arr) =>
  arr.reduce((acc, cur, i, arr) => acc + cur / arr.length, 0);

export default function App() {
  const [query, setQuery] = useState("");

  const [selectedId, setSelectedId] = useState(null);
  const { movies, isLoading, error } = useMovies(query);

  useMovies(query, handleCloseMovie);

  const [watched, setWatched] = useLocalStorageState([], "watched"); // [

  const handleSelectMovie = (id) => {
    setSelectedId((selectedId) => (id === selectedId ? null : id));
  };

  function handleCloseMovie() {
    setSelectedId(null);
  }

  const handleAddWatch = (movie) => {
    setWatched((watched) => [...watched, movie]);
  };

  const handleDeleteWatched = (id) => {
    setWatched((watched) => watched.filter((movie) => movie.imdbID !== id));
  };

  // useEffect(() => {
  //   localStorage.setItem("watched", JSON.stringify(watched));
  // }, [watched]);

  return (
    <>
      <NavBar>
        <Logo />
        <SearchBar query={query} setQuery={setQuery} />
        <NumResults movies={movies} />
      </NavBar>
      <Main>
        <Box>
          {/* {isLoading ? <Loader /> :  <MovieList movies={movies} />} */}
          {isLoading && <Loader />}
          {!isLoading && !error && (
            <MovieList onSelectMovie={handleSelectMovie} movies={movies} />
          )}
          {error && <ErrorMessage message={error} />}
        </Box>
        <Box>
          {selectedId ? (
            <MovieDetails
              onCloseMovie={handleCloseMovie}
              selectedId={selectedId}
              onAddWatch={handleAddWatch}
              watched={watched}
            />
          ) : (
            <>
              <WatchedSummary watched={watched} />
              <WatchedMoviesList
                watched={watched}
                onDeleteWatched={handleDeleteWatched}
              />
            </>
          )}
        </Box>
      </Main>
    </>
  );
}
