const express = require('express');
const app = express();
const cors = require('cors');
const fetch = require('node-fetch');


app.use(cors())

let port = process.env.PORT;
if (port == null || port == "") {
  port = 3015;
}
app.listen(port);

const store = {
  allHeroStats: [],
  calculated: {
    heroMeta: [],
    heroMetaLastUpdated: null,
    heroPerformance: {},
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
  return allHeroStats.map((heroStats, i) => {
    const heroWinPercent = (heroStats['5_win'] + heroStats['6_win'] + heroStats['7_win'] + heroStats['8_win']) / (heroStats['5_pick'] + heroStats['6_pick'] + heroStats['7_pick'] + heroStats['8_pick']);
    return { name: heroStats.localized_name, winPercentage: heroWinPercent, primaryAttr: heroStats.primary_attr, heroId: heroStats.id  }
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

app.get('/heroPerformance', (req, res) => {
  if (!store.calculated.heroPerformance[req.query.heroId]) {
    fetch(`https://api.opendota.com/api/heroes/${req.query.heroId}/durations`).then((res) => {
      return res.json()
    }).then((data) => {
      console.log('new perf data', data)
      store.calculated.heroPerformance[req.query.heroId] = data;
      res.send({ heroPerformance: store.calculated.heroPerformance[req.query.heroId]})
    }).catch((err) => console.log('err', err));
  } else {
    console.log('outside perf data', store.calculated.heroPerformance[req.query.heroId])
    return res.send({ heroPerformance: store.calculated.heroPerformance[req.query.heroId]})
  }
})

// For heroku deployment
if (process.env.NODE_ENV === 'production') {
  app.use(express.static('client/build'));
  app.get('*', (req, res) => {
    res.sendFile(path.resolve(__dirname, 'client', 'build', 'index.html'));
  });
}
