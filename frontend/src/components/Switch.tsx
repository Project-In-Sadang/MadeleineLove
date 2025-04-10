import { SwitchType } from '@/utils/type';
import FlexBox from '@/components/FlexBox';

interface SwitchProps {
    sort: SwitchType;
    setSort: (sort: SwitchType) => void;
}

export default function Switch({ sort, setSort }: SwitchProps) {
    return (
        <FlexBox
            className="relative w-[105px] py-2 bg-[#DADADA] text-sm font-medium
            shadow-[-5px_-5px_15px_#929292_inset,-10px_-10px_20px_rgba(0,_0,_0,_0.09)_inset]
            rounded-[20px]"
        >
            <div
                className={`absolute h-full w-[50%] rounded-[20px] bg-white transition-transform duration-300
                shadow-[-5px_-5px_15px_#BDBDBD_inset,-10px_-10px_20px_rgba(0,_0,_0,_0.09)_inset]`}
                style={{
                    transform: sort === 'latest' ? 'translateX(0)' : 'translateX(100%)',
                }}
            />
            <button
                onClick={() => setSort('latest')}
                className={`z-10 flex-1 rounded-[20px] px-1 ${sort === 'latest' ? 'text-[#62467D]' : 'text-[#727272]'}`}
            >
                최신순
            </button>
            <button
                onClick={() => setSort('recommended')}
                className={`z-10 flex-1 rounded-[20px] px-1 ${
                    sort === 'recommended' ? 'text-[#62467D]' : 'text-[#727272]'
                }`}
            >
                추천순
            </button>
        </FlexBox>
    );
}
