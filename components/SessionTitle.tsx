interface SessionTitleProps {
  title: string | null;
  className?: string;
}

export function SessionTitle({ title, className }: SessionTitleProps) {
  switch (title) {
    case "OPEN HDMI CABLE":
      return (
        <span className={className}>
          <span className="text-primary-600">OPEN</span>
          {' HD'}
          <span className="text-primary-600">MI C</span>
          {'ABLE'}
        </span>
      );
    default:
      return <span className={className}>{title}</span>;
  }
}
