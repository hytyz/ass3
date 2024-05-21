import { useState, useEffect, useMemo } from "react";
import { Dialog, DialogTitle, DialogContent, Typography } from "@mui/material";

interface Pokemon {
  name: string;
  url: string;
}

interface PokeCardProps {
  pokemon: Pokemon;
  filter: string[];
}

const PokeCard: React.FC<PokeCardProps> = ({ pokemon, filter }) => {
  const [open, setOpen] = useState(false);
  const [pokemonData, setPokemonData] = useState<any>(null);

  const displayCard = useMemo(() => {
    if (filter.length > 0 && pokemonData) {
      return filter.every((type) =>
        pokemonData.types.some((t: any) => t.type.name === type)
      );
    }
    return true;
  }, [pokemonData, filter]);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const res = await fetch(pokemon.url);
        const data = await res.json();
        setPokemonData(data);
      } catch (error) {
        console.error("Error fetching data:", error);
      }
    };
    fetchData();
  }, [pokemon.url]);

  if (!displayCard) {
    return null;
  }

  const PokeDetails = ({ title, items }: { title: string; items: any[] }) => (
    <Typography variant="h6" color={"white"}>
      {title}
      <hr style={{ borderWidth: "1px", borderBlockColor: "black" }} />
      <ul style={{ color: "white" }}>
        {items.map((item) => (
          <li key={item.name}>
            {item.name[0].toUpperCase() + item.name.slice(1)}{" "}
            {title === "Stats" ? `: ${item.base_stat || ""}` : ""}
          </li>
        ))}
      </ul>
      <br></br>
    </Typography>
);

  return (
    <div
      className="pokeCard bg-white-200 p-6 shadow border-2 border-green-500"
      style={{ maxWidth: "300px", maxHeight: "600px" }}
    >
      <Typography variant="h6" className="text-center">
        {pokemon.name.toUpperCase()}
      </Typography>
      <img
        src={pokemonData?.sprites.front_default || "unknown.png"}
        alt={pokemon.name}
        width={100}
        height={100}
        className="mb-2 mx-auto"
      />
      <div className="text-center">
        <button
          className="bg-green-500 text-white font-bold text-sm py-2 px-4 border-black mt-2"
          onClick={() => setOpen(true)}
        >
          Details
        </button>
      </div>

      {pokemonData && (
        <Dialog
          onClose={() => setOpen(false)}
          open={open}
          sx={{ "& .MuiPaper-root": { width: "500px", background: "black", color: "white"} }}
        >
          <DialogTitle>{pokemonData.name.toUpperCase()}</DialogTitle>
          <DialogContent
            style={{
              position: "relative",
              backgroundSize: "cover",
              border: "5px solid black",
            }}
          >
            <div
              style={{
                position: "absolute",
                top: 0,
                left: 0,
                width: "100%",
                height: "100%",
                backgroundColor: "green",
                opacity: 0.7,
                zIndex: 0,
              }}
            />
            <div style={{ position: "relative", zIndex: 1 }}>
              <img
                src={pokemonData.sprites.front_default}
                alt={pokemonData.name}
                width={200}
                height={200}
                className="mx-auto"
              />
              <PokeDetails
                title="Types"
                items={pokemonData.types.map((type: any) => ({
                  name: type.type.name,
                }))}
              />
              <PokeDetails
                title="Abilities"
                items={pokemonData.abilities.map((ability: any) => ({
                  name: ability.ability.name,
                }))}
              />
              <PokeDetails
                title="Stats"
                items={pokemonData.stats.map((stat: any) => ({
                  name: stat.stat.name,
                  base_stat: stat.base_stat,
                }))}
              />
            </div>
          </DialogContent>
        </Dialog>
      )}
    </div>
  );
};

export default PokeCard;
