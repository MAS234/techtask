import React, { useEffect, useState } from "react";
import {
  IonContent,
  IonHeader,
  IonPage,
  IonTitle,
  IonToolbar,
  IonItem,
  IonLabel,
  IonImg,
  IonGrid,
  IonCol,
  IonButton,
  IonRow
} from "@ionic/react";
import { getPokemons, FormattedPokemon } from "../services/PokemonServices";
import "./Home.css"

const Home: React.FC = () => {
  const [pokemonData, setPokemonData] = useState<FormattedPokemon[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [limit, setLimit] = useState(20);
  const [offset, setOffset] = useState(0);
  const [currentPage, setCurrentPage] = useState(1);

  useEffect(() => {
    async function fetchData() {
      try {
        setLoading(true);
        const result = await getPokemons(limit, offset);
        setPokemonData(result);
      } catch (error) {
        console.error("Error fetching Pokemon data:", error);
        setError("Error fetching Pokemon data. Please try again.");
      } finally {
        setLoading(false);
      }
    }

    fetchData();
  }, [limit, offset]);

  const loadPage = async (newPage: number) => {
    try {
      // Calcula el nuevo offset según la página seleccionada
      const newOffset = (newPage - 1) * limit;

      setOffset(newOffset);
      setCurrentPage(newPage);

      const result = await getPokemons(limit, newOffset);
      setPokemonData(result);
      window.scrollTo({ top: 0, behavior: 'smooth' });
    } catch (error) {
      console.error('Error fetching Pokemon data:', error);
      setError('Error fetching Pokemon data. Please try again.');
    }
  };

  return (
    <IonPage>
      <IonHeader>
        <IonToolbar>
          <IonTitle class="centrar">IONIC-REACT-POKEMON</IonTitle>
        </IonToolbar>
      </IonHeader>
      <IonContent>
        {pokemonData.length > 0 && (
          <>
          <IonGrid>
            <IonRow>
              {pokemonData.map((pokemon) => (
                <IonCol key={pokemon.id} size="12" size-md="6" size-lg="4" size-xl="3">
                  <IonItem className="card">
                    <IonImg src={pokemon.sprite} alt={pokemon.name} />
                    <IonLabel>
                      <h2>{pokemon.name}</h2>
                      <p>ID: {pokemon.id}</p>
                      <p>Experience: {pokemon.base_experience}</p>
                      <p>Height: {pokemon.height}</p>
                      <p>Weight: {pokemon.weight}</p>
                      <p>Abilities: {pokemon.abilities.join(', ')}</p>
                    </IonLabel>
                  </IonItem>
                </IonCol>
              ))}
            </IonRow>
          </IonGrid>

            <IonGrid>
              <IonRow className="ion-justify-content-center">
                <IonCol size="auto">
                  <IonButton
                    onClick={() => loadPage(currentPage - 1)}
                    disabled={currentPage === 1}
                  >
                    Prev
                  </IonButton>
                </IonCol>
                <IonCol size="auto">
                  <IonButton
                    onClick={() => loadPage(currentPage + 1)}
                  >
                    Next
                  </IonButton>
                </IonCol>
              </IonRow>
            </IonGrid>
          </>
        )}

        {loading && <IonLabel>Loading...</IonLabel>}
        {error && <IonLabel>Error: {error}</IonLabel>}
      </IonContent>
    </IonPage>
  );
};

export default Home;
