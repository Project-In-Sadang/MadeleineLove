import FlexBox from '@/components/FlexBox';

interface MenuButtonProps {
    onClick: () => void;
    Icon: React.FC<React.SVGProps<SVGSVGElement>>;
    title: string;
}

export default function MenuButton({ onClick, Icon, title }: MenuButtonProps) {
    return (
        <button onClick={onClick} className="w-full">
            <FlexBox
                direction="col"
                className="w-full font-medium shadow-[10px_10px_20px_0px_rgba(0,0,0,0.25)]
                 bg-[#eae5ff] rounded-[10px] gap-1 py-4 whitespace-nowrap"
            >
                <Icon width={30} />
                {title}
            </FlexBox>
        </button>
    );
}
