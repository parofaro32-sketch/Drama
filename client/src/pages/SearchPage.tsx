import { FormEvent, useEffect, useMemo, useState } from 'react';
import { Link, useNavigate, useParams } from 'react-router-dom';
import { Clapperboard, Clock3, Film, Loader2, Play, Search, Sparkles, Tv2 } from 'lucide-react';
import { dailymotionService } from '@/services/dailymotion';
import type { DailymotionVideo, SearchResponse } from '@/types';
import { detectEpisode, formatDuration } from '@/utils/video';

function poster(video: DailymotionVideo) {
  return video.thumbnail_360_url || video.thumbnail_url || '';
}

function VideoTile({ video, featured = false }: { video: DailymotionVideo; featured?: boolean }) {
  const episode = detectEpisode(video.title);
  return (
    <Link to={`/watch/${video.id}`} className={`group block ${featured ? 'md:col-span-2 md:row-span-2' : ''}`}>
      <article className="overflow-hidden rounded-2xl border border-white/[0.08] bg-[#10131d] transition duration-300 group-hover:-translate-y-1 group-hover:border-violet-400/50 group-hover:shadow-2xl group-hover:shadow-violet-950/40">
        <div className={`relative overflow-hidden bg-[#191d2a] ${featured ? 'aspect-[16/10]' : 'aspect-video'}`}>
          {poster(video) ? <img src={poster(video)} alt="" loading="lazy" className="h-full w-full object-cover transition duration-500 group-hover:scale-105" /> : <div className="flex h-full items-center justify-center text-white/20"><Film size={34} /></div>}
          <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/10 to-transparent" />
          <span className="absolute left-3 top-3 rounded-full bg-black/60 px-2.5 py-1 text-[10px] font-bold uppercase tracking-[0.18em] text-violet-200 backdrop-blur">{episode.label || 'Drama'}</span>
          <span className="absolute bottom-3 right-3 rounded-md bg-black/75 px-2 py-1 text-xs text-white">{formatDuration(video.duration) || '—'}</span>
          <span className="absolute bottom-3 left-3 flex h-9 w-9 items-center justify-center rounded-full bg-white text-[#121522] opacity-0 shadow-xl transition group-hover:opacity-100"><Play size={15} fill="currentColor" /></span>
        </div>
        <div className="p-4"><h2 className={`line-clamp-2 font-semibold text-white ${featured ? 'text-lg' : 'text-sm'}`}>{video.title}</h2><p className="mt-2 flex items-center gap-1 text-xs text-white/40"><Tv2 size={12} /> Dailymotion</p></div>
      </article>
    </Link>
  );
}

function SearchBar({ value, onChange, onSubmit, loading }: { value: string; onChange: (value: string) => void; onSubmit: () => void; loading: boolean }) {
  const submit = (event: FormEvent) => { event.preventDefault(); if (!loading && value.trim()) onSubmit(); };
  return <form onSubmit={submit} className="relative mx-auto w-full max-w-2xl"><Search className="absolute left-5 top-1/2 -translate-y-1/2 text-white/35" size={20} /><input aria-label="Search dramas" value={value} onChange={(event) => onChange(event.target.value)} placeholder="Search dramas..." className="h-16 w-full rounded-2xl border border-white/10 bg-white/[0.07] pl-14 pr-32 text-base text-white outline-none backdrop-blur-xl transition placeholder:text-white/30 focus:border-violet-400/60 focus:bg-white/[0.1] focus:ring-4 focus:ring-violet-500/10" /> <button type="submit" disabled={loading || !value.trim()} className="absolute right-2 top-2 flex h-12 items-center gap-2 rounded-xl bg-violet-500 px-5 text-sm font-bold text-white transition hover:bg-violet-400 disabled:cursor-not-allowed disabled:opacity-40">{loading ? <Loader2 size={16} className="animate-spin" /> : <Search size={16} />}<span className="hidden sm:inline">Search</span></button></form>;
}

export function SearchPage() {
  const { query = '' } = useParams<{ query: string }>();
  const navigate = useNavigate();
  const [term, setTerm] = useState(query);
  const [data, setData] = useState<SearchResponse | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  useEffect(() => { setTerm(query); if (!query) { setData(null); setError(''); return; } let active = true; setLoading(true); setError(''); dailymotionService.search({ q: query, page: 1, limit: 24 }).then((result) => { if (active) setData(result); }).catch((reason) => { if (active) setError(reason instanceof Error ? reason.message : 'Search failed.'); }).finally(() => { if (active) setLoading(false); }); return () => { active = false; }; }, [query]);

  const submit = () => { const next = term.trim(); if (next) navigate(`/search/${encodeURIComponent(next)}`); };
  const featured = data?.videos?.[0];
  const rest = useMemo(() => data?.videos?.slice(1) ?? [], [data]);

  return <main className="min-h-screen overflow-hidden bg-[#080a11] text-white">
    <div className="pointer-events-none fixed inset-0 -z-0"><div className="absolute left-1/2 top-[-20rem] h-[38rem] w-[50rem] -translate-x-1/2 rounded-full bg-violet-700/20 blur-[130px]" /><div className="absolute right-[-12rem] top-[35rem] h-[26rem] w-[26rem] rounded-full bg-fuchsia-700/10 blur-[110px]" /></div>
    <header className="relative z-10 border-b border-white/[0.06] bg-[#080a11]/75 backdrop-blur-xl"><div className="mx-auto flex max-w-7xl items-center justify-between px-5 py-5 lg:px-10"><Link to="/" className="flex items-center gap-3"><span className="flex h-10 w-10 items-center justify-center rounded-xl bg-gradient-to-br from-violet-400 to-fuchsia-500 shadow-lg shadow-violet-800/30"><Clapperboard size={21} /></span><span className="text-xl font-black tracking-tight">Drama<span className="text-violet-400">ly</span></span></Link><div className="hidden items-center gap-8 text-sm text-white/45 sm:flex"><span className="text-white">Discover</span><span>Trending</span><span>Collections</span></div><span className="rounded-full border border-white/10 px-3 py-1.5 text-xs text-white/45">Powered by Dailymotion</span></div></header>
    <section className={`relative z-10 mx-auto max-w-7xl px-5 lg:px-10 ${query ? 'pb-12 pt-14' : 'pb-20 pt-24 text-center'}`}><div className="mx-auto max-w-3xl"><div className="mb-5 inline-flex items-center gap-2 rounded-full border border-violet-300/20 bg-violet-300/10 px-3 py-1.5 text-xs font-bold uppercase tracking-[0.2em] text-violet-200"><Sparkles size={13} /> Your next story</div><h1 className="text-4xl font-black tracking-[-0.04em] text-white sm:text-6xl">Find the drama<br /><span className="bg-gradient-to-r from-violet-300 via-fuchsia-300 to-rose-300 bg-clip-text text-transparent">you can't stop watching.</span></h1><p className="mx-auto mt-5 max-w-xl text-base leading-7 text-white/45">Search thousands of official Dailymotion videos and settle into your next series.</p><div className="mt-9"><SearchBar value={term} onChange={setTerm} onSubmit={submit} loading={loading} /></div></div></section>
    <section className="relative z-10 mx-auto max-w-7xl px-5 pb-20 lg:px-10">{loading && <div className="flex items-center justify-center gap-3 py-20 text-white/60"><Loader2 className="animate-spin text-violet-300" /> Searching Dailymotion...</div>}{error && !loading && <div className="mx-auto max-w-xl rounded-2xl border border-rose-300/20 bg-rose-400/10 p-8 text-center"><h2 className="font-bold text-rose-100">We couldn't load those dramas</h2><p className="mt-2 text-sm text-rose-100/60">{error}</p><button onClick={submit} className="mt-5 rounded-xl bg-white px-4 py-2 text-sm font-bold text-[#11131d]">Try again</button></div>}{!loading && !error && data && <>{data.videos.length === 0 ? <div className="py-20 text-center"><Film className="mx-auto text-white/20" size={42} /><h2 className="mt-5 text-xl font-bold">No dramas found</h2><p className="mt-2 text-white/45">Try a broader title or a different spelling.</p></div> : <><div className="mb-6 flex items-end justify-between"><div><p className="text-xs font-bold uppercase tracking-[0.2em] text-violet-300">Search results</p><h2 className="mt-2 text-2xl font-black">Stories for “{data.query}”</h2></div><span className="text-sm text-white/35">{data.total || data.videos.length} videos</span></div><div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-4">{featured && <VideoTile video={featured} featured />}{rest.map((video) => <VideoTile key={video.id} video={video} />)}</div></>}</>}</section>
    {!query && <section className="relative z-10 mx-auto flex max-w-5xl flex-wrap justify-center gap-3 px-5 pb-24 text-sm text-white/40"><span className="flex items-center gap-2"><Clock3 size={15} className="text-violet-300" /> Try a title to begin</span><span className="text-white/15">•</span><span>Episodes, series, and more</span></section>}
  </main>;
}
