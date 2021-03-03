import style from '../components/styles.module.css';
import { useEffect } from 'react';

const HeroMeta = () => {
  useEffect(() => {
    fetch('http://localhost:3015/heroMeta')
      .then((res) => res.json())
      .then((res) => console.log('res', res))
  }, []);
  return (
    <div className={style.container}>
      <main>
        <h1 className="title">
          Hero Meta
        </h1>
      </main>
    </div>
      )
}


export default HeroMeta;
