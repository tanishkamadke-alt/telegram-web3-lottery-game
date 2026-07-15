function Card({
  icon,
  title,
  value,
  status,
  statusColor = "cyan",
}) {
  return (
    <div className="stat-card">

      <div className="card-icon">
        {icon}
      </div>

      <p className="stat-title">
        {title}
      </p>

      <h2 className="stat-value">
        {value}
      </h2>

      <p
        className="stat-status"
        style={{ color: `var(--${statusColor})` }}
      >
        {status}
      </p>

    </div>
  );
}

export default Card;