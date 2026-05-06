import { Log } from "logging_middleware";

const ACCESS_TOKEN = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJNYXBDbGFpbXMiOnsiYXVkIjoiaHR0cDovLzIwLjI0NC41Ni4xNDQvZXZhbHVhdGlvbi1zZXJ2aWNlIiwiZW1haWwiOiJhdmFudGhpa2FzdXJhajAzMjdAZ21haWwuY29tIiwiZXhwIjoxNzc4MDYyNTEzLCJpYXQiOjE3NzgwNjE2MTMsImlzcyI6IkFmZm9yZCBNZWRpY2FsIFRlY2hub2xvZ2llcyBQcml2YXRlIExpbWl0ZWQiLCJqdGkiOiI0MjJiNjM5Yi01MDgwLTQ5OWYtOTZkMi04MTY1MGQ0ODhjMWIiLCJsb2NhbGUiOiJlbi1JTiIsIm5hbWUiOiJhdmFudGhpa2EgayBzIiwic3ViIjoiZDdhY2Q3ZTgtNjJiMC00NzA1LWJkNzItYjE3NmQ4M2M5OTFhIn0sImVtYWlsIjoiYXZhbnRoaWthc3VyYWowMzI3QGdtYWlsLmNvbSIsIm5hbWUiOiJhdmFudGhpa2EgayBzIiwicm9sbE5vIjoiY2Iuc2MucDJhaWUyNTAwNCIsImFjY2Vzc0NvZGUiOiJQVEJNbVEiLCJjbGllbnRJRCI6ImQ3YWNkN2U4LTYyYjAtNDcwNS1iZDcyLWIxNzZkODNjOTkxYSIsImNsaWVudFNlY3JldCI6IlZlWW5CZlpjcXhBQ1p2ZFQifQ.mI3NRfn5NI4FZQ4FAN5qTpwcOe5yISl_GlcPnNSM5AQ";

interface Notification {
    ID: string;
    Type: "Placement" | "Result" | "Event";
    Message: string;
    Timestamp: string;
}

const TYPE_WEIGHT: Record<string, number> = {
    "Placement": 3,
    "Result": 2,
    "Event": 1
};

async function getPriorityInbox(n: number = 10) {
    await Log("backend", "info", "service", `Starting fetch for top ${n} notifications.`);

    try {
        await Log("backend", "debug", "service", "Fetching from evaluation-service/notifications");
        const response = await fetch("http://20.207.122.201/evaluation-service/notifications", {
            headers: {
                "Authorization": `Bearer ${ACCESS_TOKEN}`
            }
        });

        if (!response.ok) {
            const errText = await response.text();
            await Log("backend", "error", "service", `Failed to fetch notifications: ${response.status} ${errText}`);
            return;
        }

        const data = await response.json();
        const notifications: Notification[] = data.notifications;

        await Log("backend", "info", "service", `Successfully fetched ${notifications.length} notifications.`);

        // Sort based on Priority = Weight (Placement > Result > Event) + Recency
        notifications.sort((a, b) => {
            const weightA = TYPE_WEIGHT[a.Type] || 0;
            const weightB = TYPE_WEIGHT[b.Type] || 0;

            if (weightA !== weightB) {
                return weightB - weightA; // Descending by weight
            }

            // Descending by recency
            const timeA = new Date(a.Timestamp).getTime();
            const timeB = new Date(b.Timestamp).getTime();
            return timeB - timeA;
        });

        const topN = notifications.slice(0, n);
        
        await Log("backend", "info", "controller", `Computed top ${n} notifications successfully.`);

        console.log(`\n=== TOP ${n} PRIORITY INBOX ===\n`);
        topN.forEach((notif, idx) => {
            console.log(`[${idx + 1}] [${notif.Type}] ${notif.Message} (${notif.Timestamp})`);
        });

    } catch (error: any) {
        await Log("backend", "fatal", "service", `Exception in getPriorityInbox: ${error.message}`);
    }
}

getPriorityInbox(10).then(() => {
    console.log("Priority Inbox retrieval complete.");
});
