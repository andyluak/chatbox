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
  return (
    <p className={cn("text-xl text-muted-foreground", className)}>{children}</p>
  );
};

export const TypographyH2: TypographyProps = ({ children, className }) => {
  return (
    <h2
      className={cn(
        "scroll-m-20 border-b pb-2 text-3xl font-semibold tracking-tight transition-colors first:mt-0",
        className
      )}
    >
      {children}
    </h2>
  );
};

export const TypographyMuted: TypographyProps = ({ children, className }) => {
  return (
    <p className={cn("text-sm text-muted-foreground", className)}>{children}</p>
  );
};

export const TypographyH3: TypographyProps = ({ children, className }) => {
  return (
    <h3
      className={cn(
        "scroll-m-20 text-2xl font-semibold tracking-tight",
        className
      )}
    >
      {children}
    </h3>
  );
};

export const TypographyInlineCode: TypographyProps = ({ children, className }) =>{
  return (
    <code className={cn("relative rounded bg-muted px-[0.3rem] py-[0.2rem] font-mono text-sm font-semibold", className)}>
      {children}
    </code>
  )
}