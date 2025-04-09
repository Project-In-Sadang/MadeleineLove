import FlexBox from '@/components/FlexBox';
import Image from 'next/image';
import trash from '@/assets/icons/trash.svg';
import fly from '@/assets/icons/heart/fly.svg';
import eat from '@/assets/icons/heart/eat.svg';
import burn from '@/assets/icons/heart/burn.svg';
import melt from '@/assets/icons/heart/melt.svg';
import romance from '@/assets/icons/heart/romance.svg';
import happy from '@/assets/icons/heart/happy.svg';
import refresh from '@/assets/icons/heart/refresh.svg';
import sad from '@/assets/icons/heart/sad.svg';
import pink from '@/assets/icons/heart/pink.svg';
import purple from '@/assets/icons/heart/purple.svg';
import gray from '@/assets/icons/heart/gray.svg';
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
                        <Image
                            width={20}
                            height={20}
                            src={
                                type === 'black'
                                    ? [melt, fly, burn, eat][data.methodNumber - 1]
                                    : [romance, happy, refresh, sad][data.methodNumber - 1]
                            }
                            alt="methodheart"
                        />
                        {data.nickName}
                    </FlexBox>
                    {apiType === 'my' && (
                        <Image
                            className="cursor-pointer"
                            onClick={() => {
                                setModalState('trash');
                                setShowModal(true);
                            }}
                            width={22}
                            height={22}
                            src={trash}
                            alt="trash"
                        />
                    )}
                </FlexBox>
                <FlexBox className="gap-1">
                    {data.likeCount}
                    <Image
                        className="cursor-pointer"
                        width={22}
                        height={22}
                        src={type === 'black' ? (data.likedByUser ? purple : gray) : data.likedByUser ? pink : gray}
                        onClick={handleHeart}
                        alt="heart"
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
