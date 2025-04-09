interface CompleteButtonProps {
    onClick: () => void;
}

export default function CompleteButton({ onClick }: CompleteButtonProps) {
    return (
        <button
            className="bg-[#593EC0] px-5 py-2
            rounded-3xl text-white text-lg font-medium"
            onClick={onClick}
        >
            작성 완료
        </button>
    );
}
