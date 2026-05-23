type NavigationListener = (pending: boolean) => void;

const listeners = new Set<NavigationListener>();
let pendingCount = 0;

function notify() {
    const pending = pendingCount > 0;
    listeners.forEach((listener) => listener(pending));
}

export function startNavigation() {
    pendingCount += 1;
    notify();
}

export function stopNavigation() {
    pendingCount = Math.max(0, pendingCount - 1);
    notify();
}

export function subscribeNavigation(listener: NavigationListener) {
    listeners.add(listener);
    listener(pendingCount > 0);

    return () => {
        listeners.delete(listener);
    };
}
