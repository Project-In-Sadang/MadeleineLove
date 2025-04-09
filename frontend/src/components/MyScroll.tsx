import { HeartBody } from '@/utils/type';
import SsulBox from '@/components/SsulBox';
import FlexBox from '@/components/FlexBox';

interface MyScrollProps {
    type: 'black' | 'white';
    myData: HeartBody[];
}

export default function MyScroll({ type, myData }: MyScrollProps) {
    return (
        <FlexBox direction="col" className="gap-5">
            {myData.map((item) => (
                <SsulBox key={item.postId} type={type} data={item} apiType="my" />
            ))}
        </FlexBox>
    );
}
