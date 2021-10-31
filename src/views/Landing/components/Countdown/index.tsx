import styles from './countdown.module.scss';

export default function Countdown() {
  return (
    <div className={styles.main}>
      <div className={styles.days}>
        <div className={styles.day}>
          <p id="day-1">0</p>
        </div>
        <div className={styles.day}>
          <p id="day-2">0</p>
        </div>
      </div>

      <div className={styles.hours}>
        <div className={styles.hour}>
          <p id="hour-1">0</p>
        </div>
        <div className={styles.hour}>
          <p id="hour-2">0</p>
        </div>
      </div>
      <div className={styles.minutes}>
        <div className={styles.minute}>
          <p id="minute-1">0</p>
        </div>
        <div className={styles.minute}>
          <p id="minute-2">0</p>
        </div>
      </div>

      <div className={styles.seconds}>
        <div className={styles.second}>
          <p id="second-1">0</p>
        </div>
        <div className={styles.second}>
          <p id="second-2">0</p>
        </div>
      </div>
    </div>
  );
}
