import style from '../components/styles.module.css';
import React from 'react';
import { useEffect, useState } from 'react';
import moment from 'moment';
import Link from 'next/link';
import Chart from 'chart.js';
import { Line } from 'react-chartjs-2';
import BeatLoader from 'react-spinners/BeatLoader';


const HeroMeta = () => {
  const [heroMeta, updateHeroMeta] = useState([]);
  const [lastUpdated, updateLastUpdated] = useState(null);
  const [searchText, updateSearchText] = useState('');
  const [selectedHero, selectHero] = useState('');
  const [heroPerformance, updateHeroPerformance] = useState([]);
  useEffect(() => {
    fetch('http://localhost:3015/heroMeta')
      .then((res) => res.json())
      .then((res) => {
        updateHeroMeta(res.heroMeta);
        updateLastUpdated(res.heroMetaLastUpdated);
      })
  }, []);
  console.log('heroMeta', heroMeta)
  const getHeroPerformance = (heroId) => {
    fetch(`http://localhost:3015/heroPerformance?heroId=${heroId}`)
      .then((res) => res.json())
      .then((res) => {
        console.log('res0', res)
        updateHeroPerformance(res.heroPerformance);
      })
  }
const heroPerformanceStats = heroPerformance.map((stat) => {
  return { duration: stat.duration_bin / 60, winRate: stat.wins/stat.games_played }
}).sort((a, b) => a.duration - b.duration);
console.log('heroPerf', heroPerformance.length > 0)
  return (
    <div className={style.container}>
      <main className={style.heroMetaMain}>
        <h1 className="title">
          <Link href="/">
            <a className={style.homeLink}>
              Home {" "}
            </a>
          </Link>
          { selectedHero ? (
            <React.Fragment>
              <span className={style.span}>
                >
              </span>
              <span
                onClick={() => {
                  selectHero('')
                  updateSearchText('')
                  updateHeroPerformance([])
                }}
                className={style.homeLink}>
                Hero Meta { " " }
              </span>
            <span className={style.span}>
              >
            </span>
            <span>
              { selectedHero } Performance
            </span>
            </React.Fragment>
            ) : (
              <span>
                > Hero Meta
              </span>
            )}
        </h1>
        { !selectedHero ? (
          <React.Fragment>
            <div className={ style.lastUpdated }>
              Last Updated: { moment(lastUpdated).format('MMMM Do YYYY, h:mm:ss a')}
            </div>
            <input
              tabIndex="0"
              className={style.heroMetaInput}
              placeholder="Find hero"
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
                    selectHero(filteredHeroes[0].name);
                    getHeroPerformance(filteredHeroes[0].heroId);
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
                    selectHero(filteredHeroes[0].name);
                    getHeroPerformance(filteredHeroes[0].heroId);
                  }
              }}
            >
              select
            </button>
            <span className={style.greenCircle}>
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
            <div className={style.heroMetaContainer}>
              {heroMeta.map((hero, i) => {
                const searchMatch = searchText.length > 1 && hero.name.toLowerCase().includes(searchText);
                let gridCol = 1;
                let gridRow = i + 1;
                if (i >= 30) {
                  gridCol = 2;
                  gridRow = i - 29
                }
                if (i >= 60) {
                  gridCol = 3;
                  gridRow = i - 59;
                } 
                if (i >= 90) {
                  gridCol = 4;
                  gridRow = i - 89
                } 
                return (
                  <div
                    onClick={() => {
                      selectHero(hero.name)
                      getHeroPerformance(hero.heroId);
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
          </React.Fragment>
          ) : (
            <div>
              { !heroPerformance.length ? (
                <div className={style.loader}>
                  <BeatLoader color="#36D7B7" loading={true} css="" size={30} />
                </div>
              ) : (
                <Line
                  data={{
                    labels: heroPerformanceStats.map((data) => data.duration),
                    datasets: [{
                      label: '# of Votes',
                      data: heroPerformanceStats.map((stat) => {
                        return stat.winRate * 100;
                      }),
                      backgroundColor: [
                        'rgba(255, 99, 132, 0.2)',
                        'rgba(54, 162, 235, 0.2)',
                        'rgba(255, 206, 86, 0.2)',
                        'rgba(75, 192, 192, 0.2)',
                        'rgba(153, 102, 255, 0.2)',
                        'rgba(255, 159, 64, 0.2)'
                      ],
                      borderColor: [
                        'rgba(255, 99, 132, 1)',
                        'rgba(54, 162, 235, 1)',
                        'rgba(255, 206, 86, 1)',
                        'rgba(75, 192, 192, 1)',
                        'rgba(153, 102, 255, 1)',
                        'rgba(255, 159, 64, 1)'
                      ],
                      borderWidth: 1
                    }]
                  }}
                  options={{
                    scales: {
                      yAxes: [{
                        scaleLabel: {
                           display: true,
                          labelString: 'Win %'
                        },
                        ticks: {
                          beginAtZero: true
                        }
                      }],
                      xAxes: [{
                        scaleLabel: {
                           display: true,
                           labelString: 'Game Length (minutes)'
                        },
                      }]
                    },
                    maintainAspectRatio: false
                  }}
                  width={500}
                  height={350}
                />
              )}
            </div>
            )
        }
      </main>
    </div>
      )
}


export default HeroMeta;
