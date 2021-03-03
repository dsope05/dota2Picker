const express = require('express');
const app = express();
const cors = require('cors');
const fetch = require('node-fetch');
const HttpsProxyAgent = require('https-proxy-agent');


app.use(cors())

app.listen('3015', () => { 
  console.log('listening on 3015');
});

const store = {
  allHeroStats: [],
  calculated: {
    heroMeta: [],
  }
};

const getAllHeroStats = (res) => {
  console.log('hero stat')
  return fetch('https://api.opendota.com/api/heroStats', {agent: new HttpsProxyAgent('http://proxy.aexp.com:8080')}).then((res) => {
    console.log('res', res)
    return res.json()
  }).then((data) => {
    console.log('data', data)
    return data;
  }).catch((err) => console.log('err', err));
}

const calculateHeroMeta = (allHeroStats) => {
    console.log('all hero statssss', allHeroStats)
  return allHeroStats.map((heroStats, i) => {
    console.log('hero statssss', heroStats)
    const heroWinPercent = (heroStats['5_win'] + heroStats['6_win'] + heroStats['7_win'] + heroStats['8_win']) / (heroStats['5_pick'] + heroStats['6_pick'] + heroStats['7_pick'] + heroStats['8_pick']);
    return { name: [heroStats.localized_name], winPercentage: heroWinPercent }
  }).sort((a, b) => a.winPercentage - b.winPercentage)
};

const initiateStore = () => {
  console.log('init')
  const promises = Promise.all([getAllHeroStats()]).then(([allHeroStats]) => {
    console.log('allherostat', allHeroStats)
    store.allHeroStats = allHeroStats;
    if (allHeroStats) {
      const heroMeta = calculateHeroMeta(allHeroStats);
      store.calculated.heroMeta = heroMeta;
    }
    console.log('heroes', allHeroStats)
  });
};

initiateStore();

app.get('/heroMeta', (req, res) => {
  return res.send({ res: store.calculated.heroMeta })
})
