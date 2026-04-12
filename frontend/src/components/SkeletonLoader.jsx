export default function SkeletonLoader({ count = 6, type = 'card' }) {
  if (type === 'card') {
    return (
      <div className="skeleton-grid">
        {Array.from({ length: count }).map((_, i) => (
          <div key={i} className="skeleton-card">
            <div className="skeleton skeleton-image"></div>
            <div className="skeleton skeleton-brand"></div>
            <div className="skeleton skeleton-name"></div>
            <div className="skeleton skeleton-price"></div>
          </div>
        ))}
      </div>
    );
  }

  if (type === 'detail') {
    return (
      <div className="skeleton-detail">
        <div className="skeleton skeleton-detail-image"></div>
        <div className="skeleton-detail-info">
          <div className="skeleton skeleton-title"></div>
          <div className="skeleton skeleton-text"></div>
          <div className="skeleton skeleton-text short"></div>
          <div className="skeleton skeleton-btn"></div>
        </div>
      </div>
    );
  }

  return null;
}
