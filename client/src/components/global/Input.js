import { cloneElement, useState } from "react";
import { EyeSlash, Eye } from "iconsax-react";

export default function Input({
    type,
    value,
    placeholder,
    onChange,
    disabled,
    icon,
    error,
    onClick,
    onEnter,
    readOnlyExt,
    onBlur,
}) {
    const [showPassword, setShowPassword] = useState(false);

    let styledIcon = undefined;
    if (icon) {
        styledIcon = cloneElement(icon, {
            color: error ? "var(red)" : "var(--thirdDark)",
            size: "24",
            variant: "Bold",
        });
    }
    return (
        <div
            className={`flex items-center h-10 md:h-14 px-2.5 md:px-5 gap-2 bg-[var(--backgroundSecondary)] rounded-lg border border-solid border-transparent
             ${error && "!border-[var(--red)]"}  ${disabled && "!bg-[var(--background)] !border-[var(--thirdDark)]"}`}
        >
            {icon && styledIcon}
            <input
                onKeyUp={(e) => e.key === "Enter" && onEnter && onEnter()}
                type={showPassword ? "text" : type}
                placeholder={placeholder}
                value={value}
                onChange={onChange}
                onClick={onClick}
                disabled={disabled}
                className={`bg-transparent outline-none flex-1 font-medium text-base md:text-lg w-full ${
                    error
                        ? "text-[var(--red)] placeholder:text-[var(--red)]"
                        : "text-[var(--textSecondary)]"
                }`}
                autoComplete="off"
                readOnly={readOnlyExt}
                onBlur={onBlur}
            />
        </div>
    );
}
