import FlexBox from '@/components/FlexBox';

interface ModalProps {
    description: string;
    buttonCount?: 'one' | 'two';
    isLogin?: boolean;
    onClose: () => void;
    onConfirm?: () => void;
}

export default function Modal({ description, buttonCount = 'two', isLogin = false, onClose, onConfirm }: ModalProps) {
    return (
        <div className="fixed inset-0 flex justify-center items-center bg-black bg-opacity-50 z-50" onClick={onClose}>
            <div
                className="flex flex-col bg-[#3D337C] px-10 rounded-[20px] text-white text-lg gap-4 py-8"
                onClick={(e) => e.stopPropagation()}
            >
                {description}
                <FlexBox className="gap-3 w-full text-base font-medium text-black justify-center">
                    {buttonCount === 'two' && (
                        <button className="w-full bg-white py-0.5 rounded-3xl" onClick={onConfirm}>
                            {isLogin ? '로그인' : '예'}
                        </button>
                    )}
                    <button
                        className={`bg-white py-0.5 rounded-3xl ${buttonCount === 'one' ? 'px-6' : 'w-full'}`}
                        onClick={onClose}
                    >
                        {buttonCount === 'one' ? '확인' : isLogin ? '취소' : '아니오'}
                    </button>
                </FlexBox>
            </div>
        </div>
    );
}
