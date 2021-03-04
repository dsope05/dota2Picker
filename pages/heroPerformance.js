import style from '../components/performance.module.css';
import { useState } from 'react';
import moment from 'moment';
import Link from 'next/link';

const HeroPerformance = () => {
  const [heroPerformance, updateHeroPerformance] = useState([]);
  const [lastUpdated, updateLastUpdated] = useState(null);
  const [searchText, updateSearchText] = useState('');
  const getHeroPerformance= () => {
    fetch('http://localhost:3015/heroPerformance')
      .then((res) => res.json())
      .then((res) => {
        updateHeroMeta(res.heroPerformance);
        updateLastUpdated(res.heroMetaLastUpdated);
      })
  }
  return (
    <div className={style.container}>
      <main className={style.heroMetaMain}>
        <h1 className="title">
          <Link href="/">
            <a className={style.homeLink}>
              Home {" "}
            </a>
          </Link>
        > Hero Performance
        </h1>
        <h3>
          Hero win rates by game time length
        </h3>
        <input
          className={style.heroMetaInput}
          placeholder="Search hero"
          onChange={(e) => updateSearchText(e.target.value)}
        />
        <button
          onClick={getHeroPerformance}
        >
          Submit
        </button>
      </main>
    </div>
      )
}


export default HeroPerformance;
