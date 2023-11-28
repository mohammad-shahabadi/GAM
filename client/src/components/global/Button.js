import barLoader from "./../../assets/images/bar-loader.svg";

export default function Button({
                                   caption,
                                   loading,
                                   onClick,
                                   icon,
                                   disabled,
                                   type,
                                   className,
                                   gap,
                                   rounded,
                                   textClassName,
                                   innerStyle
                               }) {
    return (
        <button
            onClick={!loading ? onClick : undefined}
            disabled={disabled}
            className={`h-10 md:h-14 rounded-lg  w-full text-[var(--textMain)] px-2.5 md:px-5 disabled:opacity-50 ${
                rounded ? "!h-10 !rounded-full" : ""
            } ${
                type === "primary"
                    ? "bg-[var(--mainColor)] font-bold !text-white"
                    : "bg-[var(--componentBackground)] font-semibold text-sm"
            } ${className}`}
        >
            {!loading ? (
                <div
                    className={innerStyle ? innerStyle : "flex gap-4 md:gap-6 items-center justify-center whitespace-nowrap"}
                    style={{gap}}
                >
                    {typeof icon === "string" ? (
                        <img src={icon} alt="icon"/>
                    ) : (
                        icon
                    )}
                    {caption && <span className={textClassName ? textClassName : ""}>{caption}</span>}
                </div>
            ) : (
                <img src={barLoader.src} alt="loader" className="mx-auto w-10"/>
            )}
        </button>
    );
}
