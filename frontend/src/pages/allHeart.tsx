import FlexBox from '@/components/FlexBox';
import Tab from '@/components/Tab';
import BestSlide from '@/components/BestSlide';
import InfiniteScroll from '@/components/InfiniteScroll';
import Switch from '@/components/Switch';
import Header from '@/components/Header';
import { SwitchType } from '@/utils/type';
import { useGetBestBlack, useGetBestWhite } from '@/apis/allHeart/queries';
import { useState } from 'react';

export default function AllHeart() {
    const [sort, setSort] = useState<SwitchType>('latest');
    const { bestBlack } = useGetBestBlack();
    const { bestWhite } = useGetBestWhite();

    return (
        <FlexBox direction="col" className="min-h-screen">
            <Header type="view" />
            <Tab
                blackContent={
                    <FlexBox direction="col" className="gap-3.5 items-end">
                        <BestSlide type="black" bestData={bestBlack || []} />
                        <Switch sort={sort} setSort={setSort} />
                        <InfiniteScroll type="black" sort={sort} />
                    </FlexBox>
                }
                whiteContent={
                    <FlexBox direction="col" className="gap-3.5 items-end">
                        <BestSlide type="white" bestData={bestWhite || []} />
                        <Switch sort={sort} setSort={setSort} />
                        <InfiniteScroll type="white" sort={sort} />
                    </FlexBox>
                }
            />
        </FlexBox>
    );
}
