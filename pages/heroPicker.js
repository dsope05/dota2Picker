import style from '../components/matchups.module.css';
import React from 'react';
import { useEffect, useState } from 'react';
import moment from 'moment';
import Link from 'next/link';
import BeatLoader from 'react-spinners/BeatLoader';


const HeroPicker = () => {
  const [heroMeta, updateHeroMeta] = useState([]);
  const [lastUpdated, updateLastUpdated] = useState(null);
  const [searchText, updateSearchText] = useState('');
  const [heroMatchups, updateHeroMatchups] = useState({});
  const [loading, updateLoading] = useState(false);
  useEffect(() => {
    fetch('http://localhost:3015/heroMeta')
      .then((res) => res.json())
      .then((res) => {
        console.log('resoooo', res)
        updateHeroMeta(res.heroMeta);
        updateLastUpdated(res.lastUpdated);
      })
  }, []);
  console.log('lastupdated', lastUpdated)
  const getHeroMatchups = (heroId, heroName) => {
    updateLoading(true);
    fetch(`http://localhost:3015/heroMatchups?heroId=${heroId}`)
      .then((res) => res.json())
      .then((res) => {
        updateHeroMatchups({ [heroName]: res.heroMatchups, ...heroMatchups })
        updateLoading(false);
      })
  }
  const removeEnemy = (heroName) => {
    console.log('heroname', heroName)
    console.log('heromatchups', heroMatchups)
    const newMatchups = Object.assign({}, heroMatchups);
    delete newMatchups[heroName]
    updateHeroMatchups(newMatchups)
  
  }
  console.log('hero matchups', heroMatchups);
  return (
    <div className={style.container}>
      <main className={style.heroMetaMain}>
        <h1 className="title">
          <Link href="/">
            <a className={style.homeLink}>
              Home {" "}
            </a>
          </Link>
          <span>
            > Hero Picker
           </span>
        </h1>
        <div className={style.panels}>
          <div className={style.leftPanel}>
            <h2>
              Select Enemies
            </h2>
            <div className={ style.lastUpdated }>
              Last Updated: { moment(lastUpdated).format('MMMM Do YYYY, h:mm:ss a')}
            </div>
            <input
              tabIndex="0"
              className={style.heroMetaInput}
              placeholder="Select Enemy hero"
              onChange={(e) => updateSearchText(e.target.value)}
              onKeyDown={(e) => {
                let filteredHeroes = [];
                if (e.keyCode == 13) {
                  filteredHeroes = heroMeta.reduce((acc, cur) => {
                    if (cur.name.toLowerCase().includes(e.target.value)) {
                      acc.push(cur);
                    }
                    return acc;
                  }, [])
                  console.log('filteredheroes0 keyx', filteredHeroes)
                  if (filteredHeroes.length > 0) {
                    console.log('filteredheroes0 key', filteredHeroes[0].name)
                    getHeroMatchups(filteredHeroes[0].heroId, filteredHeroes[0].name);
                  }
              }}}
            />
            <button
              onClick={() => {
                console.log('onclick', heroMeta)
                let filteredHeroes = [];
                  filteredHeroes = heroMeta.reduce((acc, cur) => {
                    if (cur.name.toLowerCase().includes(searchText)) {
                      acc.push(cur);
                    }
                    return acc;
                  }, [])
                  console.log('filteredheroes0 button', filteredHeroes)
                  if (filteredHeroes.length > 0) {
                    console.log('filteredheroes0 button', filteredHeroes[0].name)
                    getHeroMatchups(filteredHeroes[0].heroId, filteredHeroes[0].name);
                  }
              }}
            >
              add enemy
            </button>
            <div className={style.legendary}>
              <span className={style.greenCircle}
              >
              <span className={style.legendWords}>
                agility
              </span>
              </span>
              <span className={style.blueCircle}>
                <span className={style.legendWords}>
                  intelligence
                </span>
              </span>
              <span className={style.redCircle}>
                <span className={style.legendWords}>
                  strength
                </span>
              </span>
            </div>
            <div className={style.heroMetaContainer}>
              {heroMeta.map((hero, i) => {
                const searchMatch = searchText.length > 1 && hero.name.toLowerCase().includes(searchText);
                let gridCol = 1;
                let gridRow = i + 1;
                return (
                  <div
                    onClick={() => {
                      getHeroMatchups(hero.heroId, hero.name);
                    }}
                    key={hero.name}
                    className={`${searchMatch ? style.searchMatch : style[hero.primaryAttr]} ${style.selectHero}`}
                    style={{
                      gridColumn: gridCol,
                      gridRow: gridRow,
                    }}>
                    { i + 1 }. { hero.name } ({ Math.round(hero.winPercentage * 1000) / 10 }%)
                  </div>
                );
              })}
            </div>
          </div>
          <div className={style.rightPanelParent}>
            <div className={style.midPanel}>
              <h2 className={style.selectedEnemiesTitle}>
                Selected Enemies
              </h2>
              <div className={style.enemiesList}>
                { !loading ? (
                  <div className={style.selectedEnemies}>
                    {
                      Object.entries(heroMatchups).map(([enemy, data]) => {
                        return (
                          <div
                            onClick={() => removeEnemy(enemy)}
                            className={style.selectedEnemy}
                          >
                            { enemy }
                          </div>
                        )
                      })
                    }
                  </div>
                ) : (
                  <div className={style.loader}>
                     <BeatLoader color="#36D7B7" loading={true} css="" size={30} />
                  </div>
                )
                }
              </div>
            </div>
            <div className={style.rightPanel}>
              <h2>
                Suggested Hero Picks
              </h2>
            </div>
          </div>
        </div>
      </main>
    </div>
      )
}


export default HeroPicker;
