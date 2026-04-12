import { useEffect, useState } from "react";

export interface TelegramUser {
    id: number;
    first_name: string;
    last_name: string;
    username: string;
    photo_url?: string;
    hash: string;
    auth_date: number;
}

export function useTelegramLogin(
    bot: string,
    container: string,
) {
    const [user, setUser] = useState<TelegramUser>();

    useEffect(() => {
        if (globalThis.window) {
            (window as any).onTelegramAuth = (user: TelegramUser) => {
                setUser(user);
            }

            let containerNode = document.querySelector(container);
            const scriptElement = document.createElement('script');
            scriptElement.src = 'https://telegram.org/js/telegram-widget.js?22';
            scriptElement.setAttribute('data-telegram-login', bot);
            scriptElement.setAttribute('data-size', 'large');
            scriptElement.setAttribute("data-onauth", "onTelegramAuth(user)");
            scriptElement.setAttribute("data-request-access", "write");
            scriptElement.async = true;

            containerNode?.appendChild(scriptElement);

            return () => {
                delete (window as any).onTelegramAuth;
                if (containerNode?.contains(scriptElement)) {
                    containerNode?.removeChild(scriptElement);
                }
            }
        }
    }, [bot, container]);


    return {
        user
    }
}