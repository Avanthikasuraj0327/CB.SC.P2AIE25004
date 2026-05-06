// logging_middleware/src/index.ts

export type Stack = "backend" | "frontend";
export type Level = "debug" | "info" | "warn" | "error" | "fatal";
export type Package = 
    | "cache" | "controller" | "cron_job" | "db" | "domain" | "handler" | "repository" | "route" | "service" // Backend
    | "api" | "component" | "hook" | "page" | "state" | "style" // Frontend
    | "auth" | "config" | "middleware" | "utils"; // Both

let _accessToken: string = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJNYXBDbGFpbXMiOnsiYXVkIjoiaHR0cDovLzIwLjI0NC41Ni4xNDQvZXZhbHVhdGlvbi1zZXJ2aWNlIiwiZW1haWwiOiJhdmFudGhpa2FzdXJhajAzMjdAZ21haWwuY29tIiwiZXhwIjoxNzc4MDYyNTEzLCJpYXQiOjE3NzgwNjE2MTMsImlzcyI6IkFmZm9yZCBNZWRpY2FsIFRlY2hub2xvZ2llcyBQcml2YXRlIExpbWl0ZWQiLCJqdGkiOiI0MjJiNjM5Yi01MDgwLTQ5OWYtOTZkMi04MTY1MGQ0ODhjMWIiLCJsb2NhbGUiOiJlbi1JTiIsIm5hbWUiOiJhdmFudGhpa2EgayBzIiwic3ViIjoiZDdhY2Q3ZTgtNjJiMC00NzA1LWJkNzItYjE3NmQ4M2M5OTFhIn0sImVtYWlsIjoiYXZhbnRoaWthc3VyYWowMzI3QGdtYWlsLmNvbSIsIm5hbWUiOiJhdmFudGhpa2EgayBzIiwicm9sbE5vIjoiY2Iuc2MucDJhaWUyNTAwNCIsImFjY2Vzc0NvZGUiOiJQVEJNbVEiLCJjbGllbnRJRCI6ImQ3YWNkN2U4LTYyYjAtNDcwNS1iZDcyLWIxNzZkODNjOTkxYSIsImNsaWVudFNlY3JldCI6IlZlWW5CZlpjcXhBQ1p2ZFQifQ.mI3NRfn5NI4FZQ4FAN5qTpwcOe5yISl_GlcPnNSM5AQ";

export const setAccessToken = (token: string) => {
    _accessToken = token;
};

export const Log = async (stack: Stack, level: Level, pkg: Package, message: string): Promise<void> => {
    if (!_accessToken) {
        console.warn("Logging Middleware: Access token is missing.");
        return;
    }

    try {
        const response = await fetch("http://20.207.122.201/evaluation-service/logs", {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
                "Authorization": `Bearer ${_accessToken}`
            },
            body: JSON.stringify({
                stack,
                level,
                package: pkg,
                message
            })
        });

        if (!response.ok) {
            const errorText = await response.text();
            console.error(`Logging Middleware Failed: [${response.status}] ${errorText}`);
        }
    } catch (error) {
        console.error("Logging Middleware Error:", error);
    }
};
