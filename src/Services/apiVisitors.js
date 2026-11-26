import { supabase } from "./Supabase"

export const TABLE = "bookfair_visitors"

export const AGE_GROUPS = {
    "Below 13": [0, 12],
    "13-18": [13, 18],
    "19-25": [19, 25],
    "26-40": [26, 40],
    "41-60": [41, 60],
    "Above 60": [61, 200],
}

// Apply report filters to a Supabase query
const applyFilters = (query, f = {}) => {
    if (f.gender) query = query.eq("gender", f.gender)
    if (f.age && AGE_GROUPS[f.age]) {
        const [min, max] = AGE_GROUPS[f.age]
        query = query.gte("age", min).lte("age", max)
    }
    if (f.occupation) query = query.eq("occupation", f.occupation)
    if (f.area_type) query = query.eq("area_type", f.area_type)
    if (f.block) query = query.eq("block", f.block)
    if (f.ulb) query = query.eq("ulb", f.ulb)
    if (f.genre) query = query.contains("book_genres", [f.genre])
    if (f.purpose) query = query.contains("visit_purpose", [f.purpose])
    if (f.rating) query = query.eq("rating", Number(f.rating))
    if (f.date) {
        // date is YYYY-MM-DD in India time
        query = query.gte("created_at", `${f.date}T00:00:00+05:30`).lte("created_at", `${f.date}T23:59:59.999+05:30`)
    }
    return query
}

export const PAGE_SIZE = 50

export const getVisitors = async (filters = {}, page = 1) => {
    const from = (page - 1) * PAGE_SIZE
    const to = from + PAGE_SIZE - 1

    const query = applyFilters(
        supabase.from(TABLE).select("*", { count: "exact" }).order("created_at", { ascending: false }).range(from, to),
        filters
    )
    const { data, error, count } = await query
    if (error) throw new Error(error.message)
    return { rows: data, count }
}

// Fetch every matching row (in batches of 1000) – used for Excel download
export const getAllVisitors = async (filters = {}) => {
    const limit = 1000
    let all = []
    for (let page = 0; ; page++) {
        const query = applyFilters(
            supabase.from(TABLE).select("*").order("created_at", { ascending: true }).range(page * limit, page * limit + limit - 1),
            filters
        )
        const { data, error } = await query
        if (error) throw new Error(error.message)
        all = all.concat(data || [])
        if (!data || data.length < limit) break
    }
    return all
}

const fromView = async (view) => {
    const { data, error } = await supabase.from(view).select("*")
    if (error) throw new Error(`${view}: ${error.message}`)
    return data
}

// All numbers for the dashboard page, from the report views in Supabase
export const getDashboard = async () => {
    const [summary, ageGender, genres, purpose, daywise, occupation, location, rating, language, howHeard, feedback] =
        await Promise.all([
            fromView("bf_summary"),
            fromView("bf_age_gender"),
            fromView("bf_genres"),
            fromView("bf_purpose"),
            fromView("bf_daywise"),
            fromView("bf_occupation"),
            fromView("bf_location"),
            fromView("bf_rating"),
            fromView("bf_language"),
            fromView("bf_how_heard"),
            supabase
                .from(TABLE)
                .select("created_at,name,age,gender,rating,feedback,suggestions")
                .or("feedback.not.is.null,suggestions.not.is.null")
                .order("created_at", { ascending: false })
                .limit(25)
                .then(({ data, error }) => {
                    if (error) throw new Error(error.message)
                    return data
                }),
        ])

    return {
        summary: summary?.[0] || {},
        ageGender, genres, purpose, daywise, occupation, location, rating, language, howHeard, feedback,
    }
}
