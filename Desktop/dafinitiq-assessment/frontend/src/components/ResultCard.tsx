interface ResultCardProps {
  label: string;
  icon?: string;
  content: string;
  placeholder: string;
  visible: boolean;
  highlight?: boolean;
  poem?: boolean;
}

export function ResultCard({
  label,
  icon,
  content,
  placeholder,
  visible,
  highlight,
  poem,
}: ResultCardProps) {
  return (
    <div
      className={`card ${highlight ? "card--highlight" : ""} ${visible ? "card--visible" : ""} ${poem ? "card--poem" : ""}`}
    >
      <span className="card__label">
        {icon && <span className="card__icon">{icon}</span>}
        {label}
      </span>
      <p className="card__content">{visible ? content : placeholder}</p>
    </div>
  );
}
