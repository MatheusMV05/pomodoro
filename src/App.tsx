import { useState } from "react";
import { Timer } from "./presentation/features/pomodoro/Timer";
import { TaskList } from "./presentation/features/tasks/TaskList";
import { FocusHistory } from "./presentation/features/history/FocusHistory";
import { SettingsPanel } from "./presentation/features/settings/SettingsPanel";
import { SpotifyPanel } from "./presentation/features/spotify/SpotifyPanel";
import { Sidebar } from "./presentation/components/layout/Sidebar";
import type { AppTab } from "./presentation/components/layout/Sidebar";
import { TaskRepositoryImp } from "./infrastructure/repositories/TaskRepositoryImp";
import { useSettings } from "./application/useSettings";
import { useFocusHistory } from "./application/useFocusHistory";
import { useSpotify } from "./application/useSpotify";

const taskRepository = new TaskRepositoryImp();

export default function App() {
    const [activeTab, setActiveTab] = useState<AppTab>('pomodoro');
    const { settings, updateSettings } = useSettings();
    const { recordFocus, todayTotal, todayEntries, weeklyData } = useFocusHistory();
    const {
        isAuthenticated, isLoading, error,
        login, logout,
        track: nowPlaying,
        toggle, next, prev,
        search, searchResults, isSearching,
    } = useSpotify();

    return (
        <div className="flex h-screen bg-background text-foreground overflow-hidden">
            <Sidebar activeTab={activeTab} onTabChange={setActiveTab} />

            <main className="flex-1 overflow-hidden">
                {activeTab === 'pomodoro' && (
                    <div className="flex h-full gap-0 p-6">
                        {/* Timer panel */}
                        <div className="flex-[2] bg-card rounded-2xl border border-border shadow-lg mr-5">
                            <Timer
                                settings={settings}
                                onFocusComplete={recordFocus}
                                nowPlaying={nowPlaying}
                                onToggle={toggle}
                                onNext={next}
                                onPrev={prev}
                            />
                        </div>

                        {/* Task list panel */}
                        <div className="flex-[1] bg-card rounded-2xl border border-border shadow-lg p-6 flex flex-col min-w-0">
                            <h2 className="text-lg font-bold mb-4">Fila de Tarefas</h2>
                            <TaskList repository={taskRepository} />
                        </div>
                    </div>
                )}

                {activeTab === 'history' && (
                    <FocusHistory
                        todayTotal={todayTotal}
                        todayEntries={todayEntries}
                        weeklyData={weeklyData}
                    />
                )}

                {activeTab === 'settings' && (
                    <SettingsPanel settings={settings} onUpdate={updateSettings} />
                )}

                {activeTab === 'spotify' && (
                    <SpotifyPanel
                        isAuthenticated={isAuthenticated}
                        isLoading={isLoading}
                        error={error}
                        login={login}
                        logout={logout}
                        track={nowPlaying}
                        toggle={toggle}
                        next={next}
                        prev={prev}
                        search={search}
                        searchResults={searchResults}
                        isSearching={isSearching}
                    />
                )}
            </main>
        </div>
    );
}