import styles from './Card.module.scss';

export interface Props {
  num: number;
  title: string;
  subtitle: string;
  desc: string;
  reverse?: boolean;
}

export default function Card({ num, title, subtitle, desc, reverse = false }: Props) {
  return (
    <div className={reverse ? styles.containerReverse : styles.container}>
      <div className={styles.text}>
        <h3 className={styles.title}>
          <div className={styles.shellNum}>{num}</div>
          {title}
        </h3>
        <h4 className={styles.subtitle}>{subtitle}</h4>
        <p className={styles.desc}>{desc}</p>
      </div>
      <div className={styles.image}>
        <div style={{ width: 'auto', height: 320, backgroundColor: '#E9F0F3' }}></div>
      </div>
    </div>
  );
}
