function getYouTubeId(url) {
  const m = url.match(/(?:youtu\.be\/|youtube\.com\/(?:watch\?v=|embed\/|v\/))([^&\s?]+)/);
  return m ? m[1] : null;
}

export default function MediaEmbed({ type, url, embedUrl, title }) {
  const src = embedUrl || url;
  if (!src) return null;

  if (type === 'video') {
    const ytId = getYouTubeId(src);
    if (ytId) {
      return (
        <div className="embed-container">
          <iframe
            src={`https://www.youtube.com/embed/${ytId}`}
            title={title}
            allowFullScreen
            allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
          />
        </div>
      );
    }
    return (
      <video controls style={{ width: '100%', borderRadius: '6px' }}>
        <source src={src} />
        Uw browser ondersteunt geen video.
      </video>
    );
  }

  if (type === 'audio') {
    return (
      <audio controls className="media-audio">
        <source src={src} />
        Uw browser ondersteunt geen audio.
      </audio>
    );
  }

  if (type === 'foto') {
    return (
      <img src={src} alt={title} style={{ width: '100%', borderRadius: '8px', maxHeight: '420px', objectFit: 'cover' }} />
    );
  }

  if (type === 'document') {
    return (
      <a href={src} target="_blank" rel="noopener noreferrer" className="btn btn-secondary">
        📄 Document openen
      </a>
    );
  }

  return (
    <a href={src} target="_blank" rel="noopener noreferrer" className="btn btn-secondary">
      🔗 Bekijk extern
    </a>
  );
}
