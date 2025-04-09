const modalMap = {
    cancelWrite: {
        content: '작성을 취소하시겠습니까?',
        buttonCount: 'two',
    },
    confirmWrite: {
        content: '작성을 완료하시겠습니까?',
        buttonCount: 'two',
    },
    emptyContent: {
        content: '글을 작성해주세요',
        buttonCount: 'one',
    },
    emptyMethod: {
        content: '비우기 방법을 선택해주세요',
        buttonCount: 'one',
    },
} as const;

export { modalMap };
