'use client';

interface HomePageWrapperProps {
  children: React.ReactNode;
}

export default function HomePageWrapper({ children }: HomePageWrapperProps) {
  // Home page wrapper - hero animation shows by default (no classes needed)
  return <>{children}</>;
} 