import clsx from "clsx";
import React, { type PropsWithChildren } from "react";

const Container: React.FC<PropsWithChildren & { className?: string }> = ({
    children,
    className,
}) => {
    return (
        <div className={clsx("mx-auto max-w-7xl px-8", className)}>
            {children}
        </div>
    );
};

export default Container;
