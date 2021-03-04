const express = require('express');
const app = express();
const cors = require('cors');
const fetch = require('node-fetch');


app.use(cors())

app.listen('3015', () => { 
  console.log('listening on 3015');
});

const store = {
  allHeroStats: [],
  calculated: {
    heroMeta: [],
    heroMetaLastUpdated: null,
  }
};

const getAllHeroStats = (res) => {
  return fetch('https://api.opendota.com/api/heroStats').then((res) => {
    return res.json()
  }).then((data) => {
    return data;
  }).catch((err) => console.log('err', err));
}

const calculateHeroMeta = (allHeroStats) => {
  console.log('allHeroStats', allHeroStats);
  return allHeroStats.map((heroStats, i) => {
    const heroWinPercent = (heroStats['5_win'] + heroStats['6_win'] + heroStats['7_win'] + heroStats['8_win']) / (heroStats['5_pick'] + heroStats['6_pick'] + heroStats['7_pick'] + heroStats['8_pick']);
    return { name: heroStats.localized_name, winPercentage: heroWinPercent, primaryAttr: heroStats.primary_attr  }
  }).sort((a, b) => b.winPercentage - a.winPercentage)
};

const initiateStore = () => {
  const promises = Promise.all([getAllHeroStats()]).then(([allHeroStats]) => {
    store.allHeroStats = allHeroStats;
    if (allHeroStats) {
      const heroMeta = calculateHeroMeta(allHeroStats);
      store.calculated.heroMeta = heroMeta;
      store.calculated.heroMetaLastUpdated = new Date();
    }
  });
};

initiateStore();

app.get('/heroMeta', (req, res) => {
  return res.send({ heroMeta: store.calculated.heroMeta, lastUpdated: store.calculated.heroMetaLastUpdated })
})
