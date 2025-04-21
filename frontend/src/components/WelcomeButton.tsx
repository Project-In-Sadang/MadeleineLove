import FlexBox from '@/components/FlexBox';

interface WelcomeProps {
    Icon: React.FC<React.SVGProps<SVGSVGElement>>;
    description: string;
    className?: string;
    iconSz: number;
    onClick: () => void;
}

export default function WelcomeButton({
    Icon,
    className = 'bg-white text-black',
    onClick,
    description,
    iconSz,
}: WelcomeProps) {
    return (
        <button onClick={onClick} className="w-full">
            <FlexBox
                className={`py-3.5 w-full gap-4 justify-center items-center
                    text-base rounded-md font-semibold
                    ${className}`}
            >
                <Icon width={iconSz} />
                {description}
            </FlexBox>
        </button>
    );
}
