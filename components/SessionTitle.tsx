interface SessionTitleProps {
  title: string | null;
  className?: string;
}

export function SessionTitle({ title, className }: SessionTitleProps) {
  if (title === "OPEN HDMI CABLE") {
    return (
      <span className={className}>
        <span className="text-primary-600">OPEN</span>
        {' HD'}
        <span className="text-primary-600">MI C</span>
        {'ABLE'}
      </span>
    );
  }
  
  return <span className={className}>{title}</span>;
}
