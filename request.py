import urllib.request
import json
import heapq

# API Endpoint provided in the problem statement
API_URL = "http://20.207.122.201/evaluation-service/notifications"

# Priority mapping (Higher number = Higher priority)
TYPE_PRIORITY = {
    "Placement": 3,
    "Result": 2,
    "Event": 1
}

def fetch_notifications(auth_token=""):
    """Fetches notifications from the API."""
    try:
        # Added User-Agent and Placeholder for Auth Token since the API is protected
        headers = {'User-Agent': 'Mozilla/5.0'}
        if auth_token:
            headers['Authorization'] = f'Bearer {auth_token}'
            
        req = urllib.request.Request(API_URL, headers=headers)
        with urllib.request.urlopen(req) as response:
            if response.status == 200:
                data = json.loads(response.read().decode('utf-8'))
                return data.get("notifications", [])
            else:
                print(f"Failed to fetch data. Status code: {response.status}")
                return []
    except urllib.error.HTTPError as e:
        print(f"HTTP Error: {e.code} - {e.reason}")
        print("Note: The API is a protected route. Please ensure you provide a valid token.")
        return []
    except Exception as e:
        print(f"Error fetching notifications: {e}")
        return []

def process_notifications(notifications, n=10):
    """
    Maintains the top 'n' notifications efficiently using a Min-Heap.
    Priority: Type (Placement > Result > Event) > Recency (Timestamp)
    """
    min_heap = []
    
    for notif in notifications:
        notif_type = notif.get("Type", "")
        timestamp = notif.get("Timestamp", "")
        notif_id = notif.get("ID", "")
        
        # Determine weight (default to 0 if unknown type)
        weight = TYPE_PRIORITY.get(notif_type, 0)
        
        # Heap tuple structure: (weight, timestamp, unique_id, notification_data)
        # Python's heapq is a min-heap. The element with the lowest weight and 
        # oldest timestamp will be at the root (index 0). This is exactly the 
        # item we want to discard when the heap is full.
        heap_item = (weight, timestamp, notif_id, notif)
        
        if len(min_heap) < n:
            heapq.heappush(min_heap, heap_item)
        else:
            # If the current notification is greater than the smallest in the heap,
            # we push the new one and pop the smallest.
            if heap_item > min_heap[0]:
                heapq.heapreplace(min_heap, heap_item)
                
    # Extract the notifications from the heap
    top_notifications = [item[3] for item in min_heap]
    
    # Sort them in descending order (Highest priority first) for clean display
    top_notifications.sort(
        key=lambda x: (TYPE_PRIORITY.get(x.get("Type", ""), 0), x.get("Timestamp", "")), 
        reverse=True
    )
    
    return top_notifications

def main():
    print(f"Fetching notifications from {API_URL}...\n")
    
    # TODO: The API is a protected route. Replace this with your actual token.
    MY_AUTH_TOKEN = "" 
    
    notifications = fetch_notifications(auth_token=MY_AUTH_TOKEN)
    
    # FALLBACK FOR DEMO PURPOSES:
    # If the API fails due to missing auth token, use the sample data from the assignment to generate output.
    if not notifications:
        print("\n[!] API Fetch failed or empty. Using Sample Data to demonstrate the algorithm for screenshots...\n")
        notifications = [
            {"ID": "d146095a-0d86-4a34-9e69-3900a14576bc", "Type": "Result", "Message": "mid-sem", "Timestamp": "2026-04-22 17:51:30"},
            {"ID": "b283218f-ea5a-4b7c-93a9-1f2f240d64b0", "Type": "Placement", "Message": "CSX Corporation hiring", "Timestamp": "2026-04-22 17:51:18"},
            {"ID": "81589ada-0ad3-4f77-9554-f52fb558e09d", "Type": "Event", "Message": "farewell", "Timestamp": "2026-04-22 17:51:06"},
            {"ID": "0005513a-142b-4bbc-8678-eefec65e1ede", "Type": "Result", "Message": "mid-sem", "Timestamp": "2026-04-22 17:50:54"},
            {"ID": "ea836726-c25e-4f21-a72f-544a6af8a37f", "Type": "Result", "Message": "project-review", "Timestamp": "2026-04-22 17:50:42"},
            {"ID": "003cb427-8fc6-47f7-bb00-be228f6b0d2c", "Type": "Result", "Message": "external", "Timestamp": "2026-04-22 17:50:30"},
            {"ID": "e5c4ff20-31bf-4d40-8f02-72fda59e8918", "Type": "Result", "Message": "project-review", "Timestamp": "2026-04-22 17:50:18"},
            {"ID": "1cfce5ee-ad37-4894-8946-d707627176a5", "Type": "Event", "Message": "tech-fest", "Timestamp": "2026-04-22 17:50:06"},
            {"ID": "cf2885a6-45ac-4ba0-b548-6e9e9d4c52c8", "Type": "Result", "Message": "project-review", "Timestamp": "2026-04-22 17:49:54"},
            {"ID": "8a7412bd-6065-4d09-8501-a37f11cc848b", "Type": "Placement", "Message": "Advanced Micro Devices Inc. hiring", "Timestamp": "2026-04-22 17:49:42"},
            {"ID": "extra-1", "Type": "Event", "Message": "Old event", "Timestamp": "2026-04-20 10:00:00"} # Added extra to prove top 10 limit works
        ]
    
    print(f"Total notifications to process: {len(notifications)}")
    print("-" * 50)
    
    # Get top 10 using our heap
    top_10 = process_notifications(notifications, n=10)
    
    print("TOP 10 PRIORITY NOTIFICATIONS:\n")
    for i, notif in enumerate(top_10, 1):
        print(f"{i}. [{notif['Type']}] {notif['Message']}")
        print(f"   ID: {notif['ID']}")
        print(f"   Time: {notif['Timestamp']}")
        print("-" * 50)

if __name__ == "__main__":
    main()
