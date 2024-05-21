"use client";
import { useState, useEffect } from "react";
import PokeCard from "../components/PokemonCard";
import Pagination from "../components/Pagination";
import Filter from "../components/Filter";
import fetchTotalCount from "../utils/fetchData";

interface Pokemon {
  name: string;
  url: string;
}

interface PokemonWithType {
  name: string;
  url: string;
  type: string;
}

export default function Page() {
  const PAGE_SIZE = 20;
  const [isLoading, setIsLoading] = useState(true);
  const [currentPage, setCurrentPage] = useState(1);
  const [pokemons, setPokemons] = useState<Pokemon[]>([]);
  const [filter, setFilter] = useState<string[]>([]);
  const [totalCount, setTotalCount] = useState(0);
  const [totalPages, setTotalPages] = useState(0);
  const [totalFilteredPokemon, setTotalFilteredPokemon] = useState(0);

  useEffect(() => {
    (async () => {
      try {
        const count = await fetchTotalCount();
        setTotalCount(count);
        const count2 = await fetchTotalCount();
        setTotalPages(Math.ceil(count2 / PAGE_SIZE));
      } catch (error) {
        console.error("Error fetching total count:", error);
      } finally {
        setIsLoading(false);
      }
    })();
  }, []);

  const fetchPokemonByType = async (type: string) => {
    const response = await fetch(`https://pokeapi.co/api/v2/type/${type}`);
    const data = await response.json();
    return data.pokemon.map((poke: any) => poke.pokemon);
  };

  useEffect(() => {
    const fetchTotalAndPokemons = async () => {
      try {
        const count = await fetchTotalCount();
        setTotalCount(count);
        setTotalPages(Math.ceil(count / PAGE_SIZE));

        if (filter.length) {
          const typePromises = filter.map((type) => fetchPokemonByType(type));
          const allPokemonByType: PokemonWithType[][] = await Promise.all(
            typePromises
          );

          const intersection: PokemonWithType[] = allPokemonByType.reduce(
            (accumulator: PokemonWithType[], current: PokemonWithType[]) => {
              return accumulator.filter((poke: PokemonWithType) =>
                current.some(
                  (innerPoke: PokemonWithType) => innerPoke.url === poke.url
                )
              );
            }
          );

          const filteredPokemons = intersection.slice(
            (currentPage - 1) * PAGE_SIZE,
            currentPage * PAGE_SIZE
          );
          setTotalFilteredPokemon(intersection.length);
          setTotalPages(Math.ceil(intersection.length / PAGE_SIZE));
          setPokemons(filteredPokemons);
        } else {
          const response = await fetch(
            `https://pokeapi.co/api/v2/pokemon?offset=${
              (currentPage - 1) * PAGE_SIZE
            }&limit=${PAGE_SIZE}`
          );
          const data = await response.json();
          setTotalPages(Math.ceil(count / PAGE_SIZE));
          setPokemons(data.results);
        }
      } catch (error) {
        console.error("Error fetching data:", error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchTotalAndPokemons();
  }, [currentPage, filter]);

  useEffect(() => {
    setCurrentPage(1);
  }, [filter]);

  return (
    
    <div className="container mx-auto px-4">
      <Filter setFilter={setFilter} filter={filter} />
      <div className="text-center mb-4">
        {pokemons.length > 0 ? (
          filter.length > 0 ? (
            <>
              <p className="text-lg text-black">
                Filtered Pokémon: {totalFilteredPokemon}
                <br />
                Showing {PAGE_SIZE * (currentPage - 1) + 1} -{" "}
                {Math.min(
                  PAGE_SIZE * (currentPage - 1) + pokemons.length,
                  totalFilteredPokemon
                )}
              </p>
            </>
          ) : (
            <>
              <p className="text-lg text-black">
                Total Pokémon: {totalCount}
                <br />
                Showing {PAGE_SIZE * (currentPage - 1) + 1} -{" "}
                {Math.min(
                  PAGE_SIZE * (currentPage - 1) + pokemons.length,
                  totalCount
                )}
              </p>
            </>
          )
        ) : (
          <>
            <p className="text-lg text-black">
              {filter.length > 0 ? "Filtered Pokémon: 0" : "Total Pokémon: 0"}
              <br />
              Showing 0-0
            </p>
          </>
        )}
      </div>

      <div className="pokeCards grid grid-cols-[repeat(auto-fit,_75%)] grid-cols-1 justify-center sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-4">
        {pokemons.map((pokemon) => (
          <PokeCard key={pokemon.name} pokemon={pokemon} filter={filter} />
        ))}
      </div>

      {!isLoading && (
        <Pagination
          currentPage={currentPage}
          setCurrentPage={setCurrentPage}
          totalPages={totalPages}
        />
      )}
    </div>
  );
}
