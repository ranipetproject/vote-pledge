import React, { useState } from 'react'
import * as XLSX from 'xlsx'
import Navbar from '../Components/Navbar'
import { useVisitors } from '../hooks/useVisitors'
import { getAllVisitors, AGE_GROUPS, PAGE_SIZE } from '../Services/apiVisitors'
import { GENDERS, OCCUPATIONS, AREA_TYPES, BLOCKS, ULBS, GENRES, PURPOSES } from '../data/options'

const v = (list) => list.map((o) => (typeof o === 'string' ? o : o.value))

const FILTERS = [
    { key: 'gender', label: 'Gender', options: v(GENDERS) },
    { key: 'age', label: 'Age group', options: Object.keys(AGE_GROUPS) },
    { key: 'occupation', label: 'Occupation', options: v(OCCUPATIONS) },
    { key: 'area_type', label: 'Area', options: v(AREA_TYPES) },
    { key: 'block', label: 'Block', options: BLOCKS },
    { key: 'ulb', label: 'ULB', options: ULBS },
    { key: 'genre', label: 'Book type', options: v(GENRES) },
    { key: 'purpose', label: 'Purpose', options: v(PURPOSES) },
    { key: 'rating', label: 'Rating', options: ['5', '4', '3', '2', '1'] },
]

const ageGroupOf = (age) => Object.entries(AGE_GROUPS).find(([, [a, b]]) => age >= a && age <= b)?.[0] || ''
const place = (p) => p.block || p.ulb || p.other_district || ''
const join = (arr) => (arr || []).join(', ')

const countBy = (rows, fn) => {
    const m = {}
    rows.forEach((r) => [].concat(fn(r) || 'Not given').forEach((k) => { m[k] = (m[k] || 0) + 1 }))
    return Object.entries(m).sort((a, b) => b[1] - a[1])
}

function Reports() {
    const [filters, setFilters] = useState({})
    const [page, setPage] = useState(1)
    const [downloading, setDownloading] = useState(false)

    const setFilter = (key, value) => {
        setPage(1)
        setFilters((prev) => {
            const next = { ...prev, [key]: value || undefined }
            Object.keys(next).forEach((k) => next[k] === undefined && delete next[k])
            return next
        })
    }

    const { data, isLoading, error } = useVisitors(filters, page)
    const rows = data?.rows || []
    const count = data?.count || 0
    const pages = Math.max(1, Math.ceil(count / PAGE_SIZE))

    const downloadExcel = async () => {
        setDownloading(true)
        try {
            const all = await getAllVisitors(filters)
            if (!all.length) {
                alert('No data to download')
                return
            }

            const total = all.length
            const ratings = all.filter((p) => p.rating)
            const summary = [
                ['Ranipet Book Fair – Visitor Report'],
                ['Generated on', new Date().toLocaleString('en-IN')],
                ['Filters', Object.entries(filters).map(([k, val]) => `${k}: ${val}`).join('; ') || 'None'],
                [],
                ['Total visitors', total],
                ['Male', all.filter((p) => p.gender === 'Male').length],
                ['Female', all.filter((p) => p.gender === 'Female').length],
                ['Transgender', all.filter((p) => p.gender === 'Transgender').length],
                ['Books bought (total)', all.reduce((s, p) => s + (p.books_bought || 0), 0)],
                ['Average rating', ratings.length ? (ratings.reduce((s, p) => s + p.rating, 0) / ratings.length).toFixed(2) : '-'],
            ]

            const detailed = all.map((p, i) => ({
                'S.No': i + 1,
                'Date & Time': new Date(p.created_at).toLocaleString('en-IN'),
                Name: p.name,
                Age: p.age,
                'Age Group': ageGroupOf(p.age),
                Gender: p.gender,
                Mobile: p.mobile || '',
                Occupation: p.occupation,
                Area: p.area_type,
                'Block / ULB / District': place(p),
                'Purpose of Visit': join(p.visit_purpose),
                'Book Types': join(p.book_genres),
                Language: join(p.book_language),
                'Books Bought': p.books_bought ?? '',
                'Amount Spent': p.amount_spent || '',
                'How Heard': p.how_heard || '',
                Rating: p.rating || '',
                Feedback: p.feedback || '',
                Suggestions: p.suggestions || '',
            }))

            // Age group x gender table
            const ageGender = Object.keys(AGE_GROUPS).map((g) => {
                const inGroup = all.filter((p) => ageGroupOf(p.age) === g)
                return {
                    'Age Group': g,
                    Male: inGroup.filter((p) => p.gender === 'Male').length,
                    Female: inGroup.filter((p) => p.gender === 'Female').length,
                    Transgender: inGroup.filter((p) => p.gender === 'Transgender').length,
                    Total: inGroup.length,
                }
            })

            // Book type x gender / age table
            const genreTable = countBy(all, (p) => p.book_genres).map(([genre, n]) => {
                const has = all.filter((p) => (p.book_genres || []).includes(genre))
                const row = { 'Book Type': genre, Total: n }
                v(GENDERS).forEach((g) => { row[g] = has.filter((p) => p.gender === g).length })
                Object.keys(AGE_GROUPS).forEach((ag) => { row[`Age ${ag}`] = has.filter((p) => ageGroupOf(p.age) === ag).length })
                return row
            })

            const simple = (title, entries) => entries.map(([k, n]) => ({ [title]: k, Visitors: n, '%': ((n / total) * 100).toFixed(1) }))

            const wb = XLSX.utils.book_new()
            XLSX.utils.book_append_sheet(wb, XLSX.utils.aoa_to_sheet(summary), 'Summary')
            XLSX.utils.book_append_sheet(wb, XLSX.utils.json_to_sheet(ageGender), 'Age x Gender')
            XLSX.utils.book_append_sheet(wb, XLSX.utils.json_to_sheet(genreTable), 'Book Types')
            XLSX.utils.book_append_sheet(wb, XLSX.utils.json_to_sheet(simple('Purpose', countBy(all, (p) => p.visit_purpose))), 'Purpose')
            XLSX.utils.book_append_sheet(wb, XLSX.utils.json_to_sheet(simple('Occupation', countBy(all, (p) => p.occupation))), 'Occupation')
            XLSX.utils.book_append_sheet(wb, XLSX.utils.json_to_sheet(simple('Place', countBy(all, (p) => place(p) || p.area_type))), 'Place')
            XLSX.utils.book_append_sheet(wb, XLSX.utils.json_to_sheet(simple('Rating', countBy(all, (p) => (p.rating ? `${p.rating} star` : null)))), 'Rating')
            XLSX.utils.book_append_sheet(wb, XLSX.utils.json_to_sheet(detailed), 'All Visitors')

            XLSX.writeFile(wb, `BookFair_Report_${new Date().toISOString().slice(0, 10)}.xlsx`)
        } catch (err) {
            alert('Download failed: ' + err.message)
        } finally {
            setDownloading(false)
        }
    }

    return (
        <>
            <Navbar />
            <div className='p-3 sm:p-5 flex flex-col gap-4 bg-gray-100 min-h-screen'>

                <div className='bg-white p-3 sm:p-5 rounded-2xl flex flex-col gap-3'>
                    <div className='flex flex-wrap gap-3 items-end'>
                        {FILTERS.map((f) => (
                            <select
                                key={f.key}
                                value={filters[f.key] || ''}
                                onChange={(e) => setFilter(f.key, e.target.value)}
                                className={`px-3 py-2 rounded-xl outline-0 min-w-[140px] max-w-[220px] ${filters[f.key] ? 'bg-blue-600 text-white' : 'bg-blue-100 text-blue-800'}`}
                            >
                                <option value=''>{f.label}: All</option>
                                {f.options.map((o) => <option key={o} value={o}>{o}</option>)}
                            </select>
                        ))}
                        <label className='flex items-center gap-2 text-sm text-gray-700'>
                            Date
                            <input type='date' value={filters.date || ''} onChange={(e) => setFilter('date', e.target.value)} className='px-3 py-2 rounded-xl bg-blue-100 text-blue-800' />
                        </label>
                        {Object.keys(filters).length > 0 && (
                            <button onClick={() => { setFilters({}); setPage(1) }} className='px-4 py-2 bg-red-100 text-red-600 rounded-xl hover:bg-red-200'>
                                Reset
                            </button>
                        )}
                    </div>
                    <div className='flex flex-wrap justify-between items-center gap-3'>
                        <p className='text-sm text-gray-700'>
                            <b className='text-gray-900 text-lg'>{count.toLocaleString('en-IN')}</b> visitors match
                        </p>
                        <button
                            onClick={downloadExcel}
                            disabled={downloading}
                            className='px-8 py-2 bg-green-600 text-white rounded-xl hover:bg-green-700 disabled:opacity-50'
                        >
                            {downloading ? 'Downloading...' : 'Download Excel Report'}
                        </button>
                    </div>
                </div>

                <div className='bg-white rounded-2xl overflow-x-auto'>
                    <table className='w-full min-w-[1000px] text-sm'>
                        <thead className='bg-gray-100 text-left text-xs uppercase text-gray-600'>
                            <tr>
                                {['Date', 'Name', 'Age', 'Gender', 'Occupation', 'Place', 'Book Types', 'Rating', 'Feedback'].map((h) => (
                                    <th key={h} className='p-3 font-semibold'>{h}</th>
                                ))}
                            </tr>
                        </thead>
                        <tbody>
                            {rows.map((p) => (
                                <tr key={p.id} className='border-t align-top hover:bg-blue-50'>
                                    <td className='p-3 whitespace-nowrap text-gray-500'>{new Date(p.created_at).toLocaleString('en-IN', { dateStyle: 'short', timeStyle: 'short' })}</td>
                                    <td className='p-3 font-semibold text-gray-900'>{p.name}</td>
                                    <td className='p-3'>{p.age}</td>
                                    <td className='p-3'>{p.gender}</td>
                                    <td className='p-3'>{p.occupation}</td>
                                    <td className='p-3'>{place(p) || p.area_type}</td>
                                    <td className='p-3 max-w-[260px]'>{join(p.book_genres)}</td>
                                    <td className='p-3 text-amber-600 whitespace-nowrap'>{'★'.repeat(p.rating || 0)}</td>
                                    <td className='p-3 max-w-[280px] text-gray-700'>{p.feedback}</td>
                                </tr>
                            ))}
                        </tbody>
                    </table>

                    {isLoading && <p className='p-4 text-center'>Loading...</p>}
                    {error && <p className='p-4 text-red-500 text-center'>Error loading data: {error.message}</p>}
                    {!isLoading && !error && rows.length === 0 && <p className='text-center py-6 text-gray-500'>No visitors match these filters</p>}

                    <div className='flex justify-center items-center gap-4 p-4'>
                        <button disabled={page <= 1} onClick={() => setPage((p) => p - 1)} className='px-4 py-2 bg-gray-200 rounded-lg disabled:opacity-40'>Prev</button>
                        <span>Page {page} / {pages}</span>
                        <button disabled={page >= pages} onClick={() => setPage((p) => p + 1)} className='px-4 py-2 bg-gray-200 rounded-lg disabled:opacity-40'>Next</button>
                    </div>
                </div>
            </div>
        </>
    )
}

export default Reports
