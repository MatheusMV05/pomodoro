import { Play, Pause, SkipBack, SkipForward } from 'lucide-react';
import { cn } from '@/lib/utils';
import type { NowPlayingTrack } from '@/application/useSpotify';

interface Props {
    track:    NowPlayingTrack;
    onToggle: () => Promise<void>;
    onNext:   () => Promise<void>;
    onPrev:   () => Promise<void>;
}

export function NowPlayingWidget({ track, onToggle, onNext, onPrev }: Props) {
    return (
        <div className={cn(
            'flex items-center gap-3 px-3 py-2.5 rounded-xl border transition-all duration-300',
            'bg-card/60 backdrop-blur-sm max-w-[300px] w-full',
            track.isPlaying
                ? 'border-[#1DB954]/20'
                : 'border-border opacity-70'
        )}>
            {/* Album art with playing indicator */}
            <div className="relative shrink-0">
                <img
                    src={track.albumArt}
                    alt={track.albumName}
                    className={cn(
                        'w-10 h-10 rounded-md object-cover transition-all duration-300',
                        !track.isPlaying && 'grayscale'
                    )}
                />
                {track.isPlaying && (
                    <div className="absolute -bottom-0.5 -right-0.5 flex items-end gap-px w-3 h-3">
                        {[1, 2, 3].map(i => (
                            <span
                                key={i}
                                className="flex-1 bg-[#1DB954] rounded-sm"
                                style={{
                                    animation: 'equalizer 0.7s ease-in-out infinite alternate',
                                    animationDelay: `${i * 0.2}s`,
                                    height: `${30 + i * 20}%`,
                                }}
                            />
                        ))}
                    </div>
                )}
            </div>

            {/* Track info */}
            <div className="flex-1 min-w-0">
                <p className="text-xs font-semibold truncate leading-tight">{track.name}</p>
                <p className="text-xs text-muted-foreground truncate leading-tight">{track.artists.join(', ')}</p>
            </div>

            {/* Controls */}
            <div className="flex items-center gap-0.5 shrink-0">
                <button
                    onClick={onPrev}
                    className="p-1 text-muted-foreground hover:text-foreground transition-colors"
                >
                    <SkipBack size={13} />
                </button>
                <button
                    onClick={onToggle}
                    className="p-1.5 rounded-full bg-[#1DB954] hover:bg-[#1ed760] text-black transition-colors"
                >
                    {track.isPlaying ? <Pause size={13} /> : <Play size={13} className="ml-px" />}
                </button>
                <button
                    onClick={onNext}
                    className="p-1 text-muted-foreground hover:text-foreground transition-colors"
                >
                    <SkipForward size={13} />
                </button>
            </div>
        </div>
    );
}
