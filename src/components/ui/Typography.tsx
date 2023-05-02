import { type PropsWithChildren } from "react";

import { cn } from "~/lib/utils";

// create a type that is part of : React.FC<PropsWithChildren & { className?: string }
type TypographyProps = React.FC<PropsWithChildren & { className?: string }>;

export const TypographyH1: TypographyProps = ({ children, className }) => {
  return (
    <h1
      className={cn(
        "scroll-m-20 text-4xl font-extrabold tracking-tight text-off-white lg:text-5xl",
        className
      )}
    >
      {children}
    </h1>
  );
};

export const TypographyLead: TypographyProps = ({ children, className }) => {
  return <p className={cn("text-xl text-muted-foreground", className)}>{children}</p>;
};
