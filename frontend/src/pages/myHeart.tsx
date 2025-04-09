import FlexBox from '@/components/FlexBox';
import Tab from '@/components/Tab';
import MyScroll from '@/components/MyScroll';
import Header from '@/components/Header';
import { useGetMyBlack, useGetMyWhite } from '@/apis/myHeart/queries';

export default function MyHeart() {
    const { myBlack } = useGetMyBlack();
    const { myWhite } = useGetMyWhite();

    return (
        <FlexBox direction="col" className="min-h-screen">
            <Header type="view" />
            <Tab
                blackContent={<MyScroll type="black" myData={myBlack || []} />}
                whiteContent={<MyScroll type="white" myData={myWhite || []} />}
            />
        </FlexBox>
    );
}
