import { Swiper, SwiperSlide } from 'swiper/react';
import 'swiper/css';
import 'swiper/css/pagination';
import { Pagination } from 'swiper/modules';
import { HeartBody } from '@/utils/type';
import SsulBox from '@/components/SsulBox';
import FlexBox from '@/components/FlexBox';

interface BestSlideProps {
    type: 'black' | 'white';
    bestData: HeartBody[];
}

export default function BestSlide({ bestData, type }: BestSlideProps) {
    return (
        <FlexBox direction="col" className="w-full p-3 bg-[#EBE5FF66] rounded-[20px]">
            <span className="text-xl font-semibold text-[#62467d]">BEST</span>
            <Swiper
                modules={[Pagination]}
                spaceBetween={20}
                slidesPerView={1}
                pagination={{ clickable: true }}
                className="mt-3 w-full"
            >
                {bestData.map((item) => (
                    <SwiperSlide key={item.postId}>
                        <SsulBox type={type} data={item} apiType="best" />
                    </SwiperSlide>
                ))}
            </Swiper>
        </FlexBox>
    );
}
