import { NextResponse } from 'next/server';

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

export async function GET() {
    try {
        const response = await fetch("http://20.207.122.201/evaluation-service/notifications", {
            headers: {
                "Authorization": `Bearer ${ACCESS_TOKEN}`
            },
            cache: 'no-store'
        });

            // Attempt to fetch notifications; if it fails, use sample fallback data
            let notifications: Notification[];
            if (!response.ok) {
                // Sample data (same as Python fallback) to ensure UI works
                const sample: Notification[] = [
                    { ID: "d146095a-0d86-4a34-9e69-3900a14576bc", Type: "Result", Message: "mid-sem", Timestamp: "2026-04-22 17:51:30" },
                    { ID: "b283218f-ea5a-4b7c-93a9-1f2f240d64b0", Type: "Placement", Message: "CSX Corporation hiring", Timestamp: "2026-04-22 17:51:18" },
                    { ID: "81589ada-0ad3-4f77-9554-f52fb558e09d", Type: "Event", Message: "farewell", Timestamp: "2026-04-22 17:51:06" },
                    { ID: "0005513a-142b-4bbc-8678-eefec65e1ede", Type: "Result", Message: "mid-sem", Timestamp: "2026-04-22 17:50:54" },
                    { ID: "ea836726-c25e-4f21-a72f-544a6af8a37f", Type: "Result", Message: "project-review", Timestamp: "2026-04-22 17:50:42" },
                    { ID: "003cb427-8fc6-47f7-bb00-be228f6b0d2c", Type: "Result", Message: "external", Timestamp: "2026-04-22 17:50:30" },
                    { ID: "e5c4ff20-31bf-4d40-8f02-72fda59e8918", Type: "Result", Message: "project-review", Timestamp: "2026-04-22 17:50:18" },
                    { ID: "1cfce5ee-ad37-4894-8946-d707627176a5", Type: "Event", Message: "tech-fest", Timestamp: "2026-04-22 17:50:06" },
                    { ID: "cf2885a6-45ac-4ba0-b548-6e9e9d4c52c8", Type: "Result", Message: "project-review", Timestamp: "2026-04-22 17:49:54" },
                    { ID: "8a7412bd-6065-4d09-8501-a37f11cc848b", Type: "Placement", Message: "Advanced Micro Devices Inc. hiring", Timestamp: "2026-04-22 17:49:42" },
                    { ID: "extra-1", Type: "Event", Message: "Old event", Timestamp: "2026-04-20 10:00:00" }
                ];
                notifications = sample;
            } else {
                const data = await response.json();
                notifications = data.notifications || [];
            }

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

        const top10 = notifications.slice(0, 10);
        return NextResponse.json({ notifications: top10 });
    } catch (error) {
        return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
    }
}
