import { useState, useEffect } from "react";
import axios from "axios";
import "./App.css";
import { useSelector, useDispatch } from "react-redux";
import {
  loadingState,
  errorState,
  toggleLoading,
  toggleError,
} from "./redux/dataSlice";

//components import
import Loading from "./components/loading";
import FourZeroFour from "./components/404";
import Card from "./components/card";

//custom hooks import
import { useDebounce } from "./components/hooks";
import { Chart } from "./chart";

const baseURL = "https://api.opendota.com";

const App = () => {
  const [heroes, setHeroes] = useState([]);
  const [heroesTop10, setHeroesTop10] = useState([]);
  const [filteredHeroes, setFilteredHeroes] = useState([]);
  const [input, setInput] = useState("");
  const dispatch = useDispatch();
  const loading = useSelector(loadingState);
  const error = useSelector(errorState);

  //hooks
  let debounced = useDebounce(input, 800);

  // if debouced value change, filter heroes list
  useEffect(() => {
    if (debounced !== "") {
      let result = heroes.filter((hero) => {
        let name = hero.localized_name.toLowerCase();
        return name.includes(debounced.toLowerCase());
      });
      if (result.length > 0) {
        setFilteredHeroes(result);
      } else {
        alert("No Hero Found");
      }
    }
  }, [debounced]);

  // get top 10 pro win rates
  const getHeroFunc = async () => {
    try {
      dispatch(toggleLoading(true));
      let getHero = await axios.get(`${baseURL}/api/heroStats`);
      if (getHero && getHero.data) {
        let heroData = getHero.data;
        let sortedHeroData = heroData.sort((a, b) => {
          // get win rates
          let aRates = Number(((a.pro_win / a.pro_pick) * 100).toFixed(2));
          let bRates = Number(((b.pro_win / b.pro_pick) * 100).toFixed(2));
          return bRates - aRates;
        });

        dispatch(toggleLoading(false));
        setHeroes(sortedHeroData);
        setHeroesTop10(sortedHeroData.slice(0, 10));
      } else {
        dispatch(toggleLoading(false));
        dispatch(toggleError(true));
      }
    } catch (error) {
      dispatch(toggleLoading(false));
      dispatch(toggleError(true));
      console.log(error.message);
    }
  };

  useEffect(() => {
    getHeroFunc();
  }, []);

  return (
    <>
      {error ? (
        <FourZeroFour />
      ) : loading ? (
        <Loading />
      ) : (
        <div
          style={{
            padding: "1rem 1rem 5rem 1rem",
            maxWidth: "1500px",
            margin: "0 auto",
          }}
        >
          <div className="scantist_main_title">
            <h1>Dota Heroes Stats</h1>
            <p>
              Data from{" "}
              <a
                href="https://docs.opendota.com/#tag/hero-stats"
                target="_blank"
                rel="noreferrer"
              >
                https://docs.opendota.com/#tag/hero-stats
              </a>
            </p>
          </div>
          <div className="scantist_search">
            <input
              type="text"
              onChange={(e) => setInput(e.target.value)}
              value={input}
              placeholder="Search by name.."
            />
          </div>
          <div>
            <div>
              <div className="scantist_section_title">
                <h2>
                  {filteredHeroes.length > 0 && debounced !== ""
                    ? `Search Results (${filteredHeroes.length})`
                    : "Top 10 Pro Win Heros"}
                </h2>
              </div>
              <div
                style={{
                  display: "flex",
                  flexWrap: "wrap",
                  margin: "-0.5rem",
                }}
              >
                {filteredHeroes.length > 0 && debounced !== ""
                  ? filteredHeroes.map((hero, index) => {
                      return <Card key={index} hero={hero} baseURL={baseURL} />;
                    })
                  : heroesTop10 &&
                    heroesTop10.map((hero, index) => {
                      return <Card key={index} hero={hero} baseURL={baseURL} />;
                    })}
              </div>
            </div>
          </div>
          {filteredHeroes.length > 0 && debounced !== "" ? null : (
            <div>
              <div
                className="scantist_section_title"
                style={{ marginTop: "3rem" }}
              >
                <h2>Top 10 Pro Win Heros's pick graph</h2>
              </div>
              <Chart data={heroesTop10} />
            </div>
          )}
        </div>
      )}
    </>
  );
};

export default App;
