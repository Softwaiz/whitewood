"use client";

import * as React from "react";
import { Eye, EyeOff } from "lucide-react";
import { cn } from "~lib/utils";
import { Input } from "~components/ui/input";

type PasswordInputProps = Omit<React.ComponentProps<typeof Input>, "type">;

const PasswordInput = React.forwardRef<HTMLInputElement, PasswordInputProps>(
    ({ className, disabled, ...props }, ref) => {
        const [visible, setVisible] = React.useState(false);

        return (
            <div className="relative w-full">
                <Input
                    ref={ref}
                    type={visible ? "text" : "password"}
                    disabled={disabled}
                    className={cn("pr-10", className)}
                    {...props}
                />
                <button
                    type="button"
                    aria-label={visible ? "Hide password" : "Show password"}
                    disabled={disabled}
                    onClick={() => setVisible((current) => !current)}
                    className="absolute inset-y-0 right-0 flex w-10 items-center justify-center text-muted-foreground transition hover:text-foreground disabled:pointer-events-none disabled:opacity-50"
                >
                    {visible ? <EyeOff className="size-4" /> : <Eye className="size-4" />}
                </button>
            </div>
        );
    }
);

PasswordInput.displayName = "PasswordInput";

export { PasswordInput };
