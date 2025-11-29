import { cva } from "class-variance-authority";

export const badgeVariants = cva(
  "inline-flex items-center justify-center rounded-full border px-3 py-1 text-xs font-medium w-fit whitespace-nowrap shrink-0 [&>svg]:size-3 gap-1.5 [&>svg]:pointer-events-none focus-visible:border-ring focus-visible:ring-ring/50 focus-visible:ring-[3px] aria-invalid:ring-destructive/20 dark:aria-invalid:ring-destructive/40 aria-invalid:border-destructive transition-all duration-300 overflow-hidden backdrop-blur-sm",
  {
    variants: {
      variant: {
        default:
          "border-transparent gradientaccent text-primary-foreground shadowglass [a&]:hover:shadowglasslg [a&]:hover:brightness-110",
        secondary:
          "border-transparent bg-secondary/80 text-secondary-foreground shadowglass [a&]:hover:bg-secondary",
        destructive:
          "border-transparent bg-destructive/90 text-white [a&]:hover:bg-destructive shadowglass [a&]:hover:shadowglasslg focus-visible:ring-destructive/20 dark:focus-visible:ring-destructive/40",
        outline:
          "borderglassborder glass text-foreground [a&]:hover:shadowglass",
      },
    },
    defaultVariants: {
      variant: "default",
    },
  }
);
