export function DailymotionPlayer({ videoId }: { videoId: string }) {
  const embedUrl = `https://www.dailymotion.com/embed/video/${videoId}?autoplay=1`;

  return (
    <div className="relative w-full aspect-video bg-black rounded-2xl overflow-hidden shadow-2xl">
      <iframe
        src={embedUrl}
        title="Dailymotion video player"
        className="w-full h-full"
        allow="accelerometer; gyroscope; autoplay; encrypted-media; picture-in-picture"
        allowFullScreen
        loading="lazy"
      />
    </div>
  );
}
