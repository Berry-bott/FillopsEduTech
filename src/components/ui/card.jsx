import * as React from "react";
import { cva } from "class-variance-authority";
import { cn } from "../../lib/utils";

// Card variants
const cardVariants = cva(
  "rounded-lg border bg-card text-card-foreground transition-shadow",
  {
    variants: {
      variant: {
        default: "shadow-sm",
        elevated: "shadow-md hover:shadow-lg",
        outlined: "border-2",
        ghost: "border-none shadow-none bg-transparent",
      },
      size: {
        sm: "p-3",
        md: "p-6",
        lg: "p-8",
      },
    },
    defaultVariants: {
      variant: "default",
      size: "md",
    },
  }
);

const Card = React.forwardRef(({ className, variant, size, ...props }, ref) => (
  <div
    ref={ref}
    className={cn(cardVariants({ variant, size, className }))}
    {...props}
  />
));
Card.displayName = "Card";

// Sub-components
const CardHeader = ({ className, ...props }) => (
  <div className={cn("flex flex-col space-y-1.5", className)} {...props} />
);

const CardTitle = ({ className, ...props }) => (
  <h3
    className={cn("text-2xl font-semibold leading-none tracking-tight", className)}
    {...props}
  />
);

const CardDescription = ({ className, ...props }) => (
  <p className={cn("text-sm text-muted-foreground", className)} {...props} />
);

const CardContent = ({ className, ...props }) => (
  <div className={cn("pt-0", className)} {...props} />
);

const CardFooter = ({ className, ...props }) => (
  <div className={cn("flex items-center pt-0", className)} {...props} />
);

export { Card, CardHeader, CardTitle, CardDescription, CardContent, CardFooter, cardVariants };
