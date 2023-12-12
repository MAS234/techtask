interface PokemonListResult {
  count: number;
  next: string | null;
  previous: string | null;
  results: {
    name: string;
    url: string;
  }[];
}

interface PokemonDetails {
  id: number;
  name: string;
  base_experience: number;
  height: number;
  weight: number;
  abilities: {
    ability: {
      name: string;
    };
  }[];
}

interface FormattedPokemon {
  id: string;
  name: string;
  sprite: string;
  base_experience: number;
  height: number;
  weight: number;
  abilities: string[];
}

interface PokemonListResult {
  count: number;
  next: string | null;
  previous: string | null;
  results: {
    name: string;
    url: string;
  }[];
}

export type { PokemonListResult, PokemonDetails, FormattedPokemon };

export async function getPokemons(
  limit: number = 20,
  offset: number = 0
): Promise<FormattedPokemon[]> {
  try {
    const response = await fetch(
      `https://pokeapi.co/api/v2/pokemon/?limit=${limit}&offset=${offset}`
    );
    const data: PokemonListResult = await response.json();

    const pokemonDetailsPromises = data.results.map(async (pokemonResult) => {
      const pokemonDetails = await getPokemonDetails(pokemonResult.name);
      return pokemonDetails;
    });

    const pokemonDetails = await Promise.all(pokemonDetailsPromises);

    // Filtra los posibles valores nulos
    const filteredPokemonDetails = pokemonDetails.filter(
      (pokemon) => pokemon !== null
    ) as FormattedPokemon[];

    return filteredPokemonDetails;
  } catch (error) {
    console.error("Error fetching Pokemon list:", error);
    return [];
  }
}

export async function getPokemonDetails(
  idOrName: string
): Promise<FormattedPokemon | null> {
  try {
    const response = await fetch(
      `https://pokeapi.co/api/v2/pokemon/${idOrName}/`
    );
    const data = await response.json();

    // Modifica la estructura de datos según sea necesario
    const formattedData: FormattedPokemon = {
      id: data.id.toString(),
      name: data.name,
      sprite: `https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/${data.id}.png`,
      base_experience: data.base_experience,
      height: data.height,
      weight: data.weight,
      abilities: data.abilities.map(
        (ability: any) => ability.ability.name
      ) as string[],
    };

    return formattedData;
  } catch (error) {
    console.error("Error fetching Pokemon details:", error);
    return null;
  }
}
