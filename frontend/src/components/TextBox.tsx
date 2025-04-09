interface TextBoxProps {
    height: number;
    className?: string;
    placeholder?: string;
    onChange: (e: React.ChangeEvent<HTMLTextAreaElement>) => void;
    maxLength: number;
    type?: 'nickname' | 'content';
}

export default function TextBox({
    className,
    height,
    placeholder,
    onChange,
    maxLength,
    type = 'content',
}: TextBoxProps) {
    return (
        <textarea
            className={`w-full
            bg-white text-base focus:outline-none resize-none
            shadow-[-3px_-3px_15px_#62467d_inset,-5px_-5px_7px_rgba(0,_0,_0,_0.15)_inset]
            ${className}`}
            style={{ height: `${height}px` }}
            placeholder={placeholder}
            onChange={onChange}
            maxLength={maxLength}
            onKeyDown={(e) => {
                if (type === 'nickname' && e.key === 'Enter') e.preventDefault();
            }}
        />
    );
}
