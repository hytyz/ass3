import { useState, useEffect } from "react";

interface FilterProps {
  filter: string[];
  setFilter: (filter: string[]) => void;
}

const types = [
  "bug",
  "dark",
  "dragon",
  "electric",
  "fairy",
  "fighting",
  "fire",
  "flying",
  "ghost",
  "grass",
  "ground",
  "ice",
  "normal",
  "poison",
  "psychic",
  "rock",
  "steel",
  "water",
];

const Filter: React.FC<FilterProps> = ({ setFilter }) => {
  const [selectedTypes, setSelectedTypes] = useState<string[]>([]);

  useEffect(() => {
    setFilter(selectedTypes);
  }, [selectedTypes, setFilter]);

  const filterType = (type: string) => {
    setSelectedTypes((selectedTypes) => {
      return selectedTypes.includes(type)
        ? selectedTypes.filter((t) => t !== type)
        : [...selectedTypes, type];
    });
  };

  return (
    <div className="flex justify-center flex-row flex-wrap my-4">
      {types.map((type) => (
        <button
          key={type}
          onClick={() => filterType(type)}
          className={`mx-1 my-1 px-2 py-1 ${
            selectedTypes.includes(type) ? "bg-red-500" : "bg-green-500"
          } text-white border-2 border-black hover:bg-red-600 focus:outline-none focus:ring-2 focus:ring-green-500 focus:ring-opacity-50`}
        >
          {type[0].toUpperCase() + type.slice(1)}
        </button>
      ))}
    </div>
  );
};

export default Filter;
