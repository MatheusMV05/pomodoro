import { useCallback, useEffect } from "react";

type NotifyOptions = {
    body?: string;
    icon?: string;
};

export function useNotification() {
    useEffect(() => {
        if ("Notification" in window && Notification.permission === "default") {
            Notification.requestPermission();
        }
    }, []);

    const notify = useCallback((title: string, options?: NotifyOptions) => {
        if (!("Notification" in window) || Notification.permission !== "granted") return;
        new Notification(title, options);
    }, []);

    return { notify };
}
