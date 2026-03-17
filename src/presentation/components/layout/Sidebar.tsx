import { Timer as TimerIcon, BarChart2, Settings, Music2 } from "lucide-react";
import { cn } from "@/lib/utils";

export type AppTab = 'pomodoro' | 'history' | 'settings' | 'spotify';

interface NavItem {
    id: AppTab;
    label: string;
    icon: React.ReactNode;
}

const NAV_ITEMS: NavItem[] = [
    { id: 'pomodoro', label: 'Pomodoro',      icon: <TimerIcon size={20} /> },
    { id: 'history',  label: 'Histórico',     icon: <BarChart2 size={20} /> },
    { id: 'settings', label: 'Configurações', icon: <Settings  size={20} /> },
    { id: 'spotify',  label: 'Spotify',       icon: <Music2    size={20} /> },
];

interface Props {
    activeTab: AppTab;
    onTabChange: (tab: AppTab) => void;
}

export function Sidebar({ activeTab, onTabChange }: Props) {
    return (
        <aside className="w-56 h-screen flex flex-col bg-sidebar border-r border-sidebar-border shrink-0">
            {/* Logo */}
            <div className="px-5 py-6 border-b border-sidebar-border">
                <div className="flex items-center gap-3">
                    <div className="w-8 h-8 rounded-lg bg-primary flex items-center justify-center shadow-md">
                        <svg width="20" height="22" viewBox="0 0 20 22" aria-hidden="true">
                            {/* Tomato body */}
                            <ellipse cx="10" cy="15" rx="8.5" ry="7.5" fill="white" opacity="0.92" />
                            {/* Calyx sepals */}
                            <path d="M10 8 Q7.5 5 5.5 6 Q7 8 10 8" fill="white" opacity="0.72" />
                            <path d="M10 8 Q12.5 5 14.5 6 Q13 8 10 8" fill="white" opacity="0.72" />
                            <path d="M10 8 Q8.5 5 10 3 Q11.5 5 10 8" fill="white" opacity="0.72" />
                            {/* Stem */}
                            <rect x="9.3" y="1" width="1.4" height="4" rx="0.7" fill="white" opacity="0.72" />
                        </svg>
                    </div>
                    <span className="font-bold text-lg text-sidebar-foreground tracking-tight">TomatoDoro</span>
                </div>
            </div>

            {/* Nav */}
            <nav className="flex-1 px-3 py-4 flex flex-col gap-1">
                {NAV_ITEMS.map((item) => (
                    <button
                        key={item.id}
                        onClick={() => onTabChange(item.id)}
                        className={cn(
                            "flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium transition-all duration-200 w-full text-left group cursor-pointer",
                            activeTab === item.id
                                ? "bg-primary text-primary-foreground shadow-sm"
                                : "text-sidebar-foreground hover:bg-sidebar-accent hover:text-sidebar-accent-foreground"
                        )}
                    >
                        <span className={cn(
                            "transition-transform duration-200",
                            activeTab !== item.id && "group-hover:scale-110"
                        )}>
                            {item.icon}
                        </span>
                        {item.label}
                    </button>
                ))}
            </nav>

            {/* Footer */}
            <div className="px-5 py-4 border-t border-sidebar-border">
                <p className="text-xs text-sidebar-foreground/50 text-center">TomatoDoro v1.0</p>
            </div>
        </aside>
    );
}
