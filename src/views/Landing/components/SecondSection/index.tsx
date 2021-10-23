import Card from './Card';
import styles from './style.module.scss';

function SecondSection() {
  return (
    <section className={styles.main}>
      <h2 className={styles.title}>How OtterClam Works</h2>
      <div className={styles.body}>
        <Card
          num={1}
          title="Treasury Revenue"
          subtitle="Bonds & LP fees"
          desc="Bond sales and LP Fees increase Treasury Revenue and lock in liquidity and help control CLAM supply"
        />
        <Card
          num={2}
          title="Treasury Growth"
          subtitle="Otter's Treasury"
          desc="Treasury inflow is used to increase Treasury Balance and back outstanding CLAM tokens and regulate staking APY"
          reverse
        />
        <Card
          num={3}
          title="Staking Rewards"
          subtitle="CLAM Token"
          desc="Compounds yields automatically through a treasury backed currency with intrinsic value"
        />
      </div>
    </section>
  );
}

export default SecondSection;
