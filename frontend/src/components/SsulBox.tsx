import FlexBox from '@/components/FlexBox';
import Trash from '@/assets/icons/trash.svg';
import Fly from '@/assets/icons/heart/fly.svg';
import Eat from '@/assets/icons/heart/eat.svg';
import Burn from '@/assets/icons/heart/burn.svg';
import Melt from '@/assets/icons/heart/melt.svg';
import Romance from '@/assets/icons/heart/romance.svg';
import Happy from '@/assets/icons/heart/happy.svg';
import Refresh from '@/assets/icons/heart/refresh.svg';
import Sad from '@/assets/icons/heart/sad.svg';
import Heart from '@/assets/icons/heart/heart.svg';
import { HeartBody } from '@/utils/type';
import { useState } from 'react';
import { useRouter } from 'next/navigation';
import Modal from '@/components/Modal';
import { useDeleteMyBlack, useDeleteMyWhite } from '@/apis/myHeart/queries';
import { usePostBlackLike, useDeleteBlackLike, useDeleteWhiteLike, usePostWhiteLike } from '@/apis/allHeart/queries';

interface SsulBoxProps {
    type: 'black' | 'white';
    data: HeartBody;
    apiType: 'best' | 'all' | 'my';
}

export default function SsulBox({ data, type, apiType }: SsulBoxProps) {
    const router = useRouter();
    const { blackLike } = usePostBlackLike(data.postId, apiType);
    const { whiteLike } = usePostWhiteLike(data.postId, apiType);
    const { blackUnLike } = useDeleteBlackLike(data.postId, apiType);
    const { whiteUnLike } = useDeleteWhiteLike(data.postId, apiType);
    const { deleteBlack } = useDeleteMyBlack(data.postId);
    const { deleteWhite } = useDeleteMyWhite(data.postId);
    const [showModal, setShowModal] = useState(false);
    const [modalState, setModalState] = useState<'login' | 'trash'>('login');

    const getModalContent = () => {
        const contentMap = {
            login: '로그인이 필요한 서비스입니다',
            trash: '글을 삭제하시겠습니까?',
        };
        return contentMap[modalState];
    };

    const handleConfirm = () => {
        if (modalState === 'login') {
            router.push('/');
        } else {
            if (type === 'black') {
                deleteBlack();
            } else {
                deleteWhite();
            }
            setShowModal(false);
        }
    };

    const handleHeart = () => {
        if (type === 'white') {
            if (data.likedByUser) {
                whiteUnLike();
            } else {
                whiteLike(undefined, {
                    onError: () => {
                        setModalState('login');
                        setShowModal(true);
                    },
                });
            }
        } else {
            if (data.likedByUser) {
                blackUnLike();
            } else {
                blackLike(undefined, {
                    onError: () => {
                        setModalState('login');
                        setShowModal(true);
                    },
                });
            }
        }
    };

    const iconMap = {
        black: [Melt, Fly, Burn, Eat],
        white: [Romance, Happy, Refresh, Sad],
    };

    const SelectedIcon = iconMap[type][data.methodNumber - 1];

    return (
        <div
            className="flex flex-col w-full h-[173px] bg-[#EBE5FF] text-base
        shadow-[-3px_-3px_15px_#62467d_inset,-5px_-5px_7px_rgba(0,_0,_0,_0.15)_inset]
        rounded-[20px] py-3 px-4 gap-1"
        >
            <FlexBox className="justify-between text-[#52396a]">
                <FlexBox className="gap-1.5">
                    <FlexBox
                        className="rounded-[10px] gap-1 pl-2 pr-3 py-1
                shadow-[-3px_-3px_13px_#62467d80_inset,-4px_-4px_6px_rgba(0,_0,_0,_0.1)_inset]"
                    >
                        <SelectedIcon />
                        {data.nickName}
                    </FlexBox>
                    {apiType === 'my' && (
                        <Trash
                            className="cursor-pointer"
                            onClick={() => {
                                setModalState('trash');
                                setShowModal(true);
                            }}
                            width={22}
                            height={22}
                        />
                    )}
                </FlexBox>
                <FlexBox className="gap-1">
                    {data.likeCount}
                    <Heart
                        className={`cursor-pointer ${
                            type === 'black'
                                ? data.likedByUser
                                    ? 'fill-[#6F3AD9]'
                                    : 'fill-[#DCDCDC]'
                                : data.likedByUser
                                ? 'fill-[#EB3D73]'
                                : 'fill-[#DCDCDC]'
                        }`}
                        width={22}
                        height={22}
                        onClick={handleHeart}
                    />
                </FlexBox>
            </FlexBox>
            <div className="px-1 my-2 overflow-y-auto rounded-lg leading-1.5">{data.content}</div>
            {showModal && (
                <Modal
                    description={getModalContent()}
                    buttonCount="two"
                    isLogin={modalState === 'login'}
                    onConfirm={handleConfirm}
                    onClose={() => setShowModal(false)}
                />
            )}
        </div>
    );
}
