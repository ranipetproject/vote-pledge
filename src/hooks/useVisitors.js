import { useQuery } from "@tanstack/react-query"
import { getDashboard, getVisitors } from "../Services/apiVisitors"

export const useDashboard = () =>
    useQuery({
        queryKey: ["dashboard"],
        queryFn: getDashboard,
        refetchInterval: 60_000, // refresh every minute during the fair
        refetchOnWindowFocus: true,
    })

export const useVisitors = (filters, page) =>
    useQuery({
        queryKey: ["visitors", filters, page],
        queryFn: () => getVisitors(filters, page),
        refetchOnWindowFocus: false,
        placeholderData: (prev) => prev,
    })
