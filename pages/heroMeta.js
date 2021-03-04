import style from '../components/styles.module.css';
import React from 'react';
import { useEffect, useState } from 'react';
import moment from 'moment';
import Link from 'next/link';
import Chart from 'chart.js';
import { Line } from 'react-chartjs-2';


const HeroMeta = () => {
  const [heroMeta, updateHeroMeta] = useState([]);
  const [lastUpdated, updateLastUpdated] = useState(null);
  const [searchText, updateSearchText] = useState('');
  const [selectedHero, selectHero] = useState('');
  useEffect(() => {
    fetch('http://localhost:3015/heroMeta')
      .then((res) => res.json())
      .then((res) => {
        updateHeroMeta(res.heroMeta);
        updateLastUpdated(res.heroMetaLastUpdated);
      })
  }, []);
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
            <h3>
              Hero win rates from recent Legend, Ancient, Divine, and Immortal games
            </h3>
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
                  if (filteredHeroes.length > 0) {
                    selectHero(filteredHeroes[0].name);
                  }
              }}}
            />
            <button
              onClick={() => {
                let filteredHeroes = [];
                  filteredHeroes = heroMeta.reduce((acc, cur) => {
                    if (cur.name.toLowerCase().includes(searchText)) {
                      acc.push(cur);
                    }
                    return acc;
                  }, [])
                  if (filteredHeroes.length > 0) {
                    selectHero(filteredHeroes[0].name);
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
              <h3>
                { selectedHero } win rate (y-axis) vs. game duration (x-axis)
              </h3>
              <Line
                data={{
                  labels: ['Red', 'Blue', 'Yellow', 'Green', 'Purple', 'Orange'],
                  datasets: [{
                  label: '# of Votes',
                  data: [12, 19, 3, 5, 2, 3],
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
                ticks: {
                    beginAtZero: true
                }
              }]
              },
              maintainAspectRatio: false
            }}
             width={100}
             height={50}
            />
            </div>
            )
        }
      </main>
    </div>
      )
}


export default HeroMeta;
