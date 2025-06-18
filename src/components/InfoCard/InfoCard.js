import classNames from 'classnames/bind';
import styles from './InfoCard.module.scss';

const cx = classNames.bind(styles);

function InfoCard({ title, description, imageUrl, linkTo }) {
  return (
    <div className={cx('info-card')}>
      <img src={imageUrl} alt={title} className={cx('card-image')} />
      <div className={cx('card-content')}>
        <h2 className={cx('card-title')}>{title}</h2>
        <p className={cx('card-description')}>{description}</p>
        {linkTo && (
          <a href={linkTo} className={cx('card-button')}>Khám phá ngay</a>
        )}
      </div>
    </div>
  );
}

export default InfoCard;