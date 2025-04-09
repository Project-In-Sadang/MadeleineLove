import { useState } from 'react';
import FlexBox from '@/components/FlexBox';

interface TabProps {
    blackContent: React.ReactNode;
    whiteContent: React.ReactNode;
}

export default function Tab({ blackContent, whiteContent }: TabProps) {
    const [activeTab, setActiveTab] = useState<'black' | 'white'>('black');

    const getTabClass = (tab: 'black' | 'white') =>
        `w-1/2 pb-2 border-b-2 cursor-pointer ${
            activeTab === tab ? 'border-b-[#62467D] text-[#62467D]' : 'border-b-[#727272] text-[#727272]'
        }`;

    return (
        <>
            <FlexBox className="w-full px-10 text-lg pb-8 font-medium text-center">
                <div onClick={() => setActiveTab('black')} className={getTabClass('black')}>
                    최악의 썰
                </div>
                <div onClick={() => setActiveTab('white')} className={getTabClass('white')}>
                    최고의 썰
                </div>
            </FlexBox>
            <div className="w-full px-10 pb-10">{activeTab === 'black' ? blackContent : whiteContent}</div>
        </>
    );
}
