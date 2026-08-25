import { useQuery } from "@tanstack/react-query";
import { supabase } from "../../../../../utils/SupabaseClient";
import { isToday, isYesterday, format } from "date-fns";

const fetchRecentEvents = async () => {
    // Fetch latest 20 orders
    const { data: orders, error: ordersErr } = await supabase
        .from("Orders")
        .select("id, full_name, total_amount, status, created_at")
        .order("created_at", { ascending: false })
        .limit(20);

    if (ordersErr) throw ordersErr;

    // Fetch latest 10 clients
    const { data: clients, error: clientsErr } = await supabase
        .from("Clients")
        .select("id, fullName, created_at")
        .order("created_at", { ascending: false })
        .limit(10);

    if (clientsErr) throw clientsErr;

    // Transform and merge
    const events = [
        ...orders.map(o => ({
            id: o.id,
            type: o.status === 'cancelled' ? 'cancelled' : 'order',
            title: `Order #${o.id.slice(0, 5)} ${o.status}`,
            subtitle: `${o.full_name} — ${o.total_amount} EGP`,
            time: o.created_at,
            status: o.status
        })),
        ...clients.map(c => ({
            id: c.id,
            type: 'client',
            title: `New client: ${c.fullName}`,
            subtitle: `Registered successfully`,
            time: c.created_at
        }))
    ];

    // Sort descending
    events.sort((a, b) => new Date(b.time) - new Date(a.time));

    // Group by day
    const grouped = events.reduce((acc, event) => {
        const date = new Date(event.time);
        let groupKey = format(date, "MMM dd, yyyy");
        if (isToday(date)) groupKey = "Today";
        else if (isYesterday(date)) groupKey = "Yesterday";

        if (!acc[groupKey]) acc[groupKey] = [];
        acc[groupKey].push(event);
        return acc;
    }, {});

    // Count today's events for the badge
    const unreadCount = grouped["Today"] ? grouped["Today"].length : 0;

    return { groupedEvents: grouped, unreadCount };
};

export const useNotifications = () => {
    return useQuery({
        queryKey: ["admin-notifications"],
        queryFn: fetchRecentEvents,
        refetchInterval: 300000 // 5 mins
    });
};
