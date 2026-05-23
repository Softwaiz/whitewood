import { initClient, initClientNavigation } from "rwsdk/client";
import { startNavigation, stopNavigation } from "~components/navigation-events";

// RedwoodSDK uses RSC RPC to emulate client side navigation.
// https://docs.rwsdk.com/guides/frontend/client-side-nav/
const { handleResponse, onHydrated } = initClientNavigation({
    onNavigate: () => {
        startNavigation();
        window.scrollTo(0, 0);
    },
});

initClient({
    handleResponse,
    onHydrated: () => {
        onHydrated?.();
        stopNavigation();
    },
});
