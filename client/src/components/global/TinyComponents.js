export const InputCaption = ({ caption, error, className }) => (
    <label
        className={`font-medium mt-2 md:mt-4 block ${className} ${
            error ? "text-[var(--red)]" : "text-[var(--textSecondary)]"
        } `}
    >
        {caption}
    </label>
);
export const ErrorText = ({ error }) => (
    <div className="text-[var(--red)] text-xs md:text-sm">{error}</div>
);

