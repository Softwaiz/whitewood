import { useEffect, useState } from "react";

export function useLocation() {
    const [location, setLocation] = useState(() => {
        if(globalThis.window) {
            return window.location;
        }
        return {
            pathname: "",
            search: "",
            hash: "",
        } as Location;
    });

    useEffect(() => {
        const handleLocationChange = () => {
            setLocation(window.location);
        };

        window.addEventListener("popstate", handleLocationChange);
        window.addEventListener("pushstate", handleLocationChange);
        window.addEventListener("replacestate", handleLocationChange);

        return () => {
            window.removeEventListener("popstate", handleLocationChange);
            window.removeEventListener("pushstate", handleLocationChange);
            window.removeEventListener("replacestate", handleLocationChange);
        };
    }, []);

    return location;
}