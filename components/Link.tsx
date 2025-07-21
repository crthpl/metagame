import NextLink from "next/link";
import { ReactNode } from "react";

type Props = {
  href: string;
  rel?: string;
  target?: string;
  children: ReactNode;
  className?: string;
};

export default function Link({ href, rel, target, children, className = "" }: Props) {
  return (
    <NextLink
      href={href}
      className={`text-secondary-500 hover:text-fuchsia-500 hover:underline transition-colors ${className}`}
      target={target}
      rel={rel}
    >
      {children}
    </NextLink>
  );
} 