import InfoCard from "../../components/InfoCard/InfoCard";
import images from "../../assets/images";
import classNames from 'classnames/bind';
import styles from './Opportunity.module.scss'
import { act } from "react";

const cx = classNames.bind(styles);
function Opportunity() {
    return (
        <div className={cx('cards-wrapper')}>
            <InfoCard
            title="Thực tập"
            description="Khám phá các cơ hội thực tập đa dạng từ các công ty hàng đầu. Nâng cao kỹ năng và tích lũy kinh nghiệm thực tế trong môi trường chuyên nghiệp."
            imageUrl={images.internAct}
            linkTo="/job" 
            />

            <InfoCard
            title="Thiện nguyện"
            description="Tham gia các dự án thiện nguyện ý nghĩa. Góp phần xây dựng cộng đồng, giúp đỡ những người khó khăn và tạo ra những thay đổi tích cực."
            imageUrl={images.volunteerAct}
            linkTo="/volunteer" 
            />
      </div>
    )
}

export default Opportunity;