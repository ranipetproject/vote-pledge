import React, { useMemo } from 'react'
import { FaUsers, FaStar, FaBook, FaCalendarDay, FaMale, FaFemale } from 'react-icons/fa'
import Navbar from '../Components/Navbar'
import { Card, StatCard, BarList, GenderStackList, ColumnChart } from '../Components/Charts'
import { useDashboard } from '../hooks/useVisitors'

const fmt = (n) => Number(n || 0).toLocaleString('en-IN')

// [{ key, gender, visitors }] -> [{ label, Male, Female, Transgender }]
const pivotGender = (rows = [], key) => {
    const map = new Map()
    rows.forEach((r) => {
        const label = r[key]
        if (!map.has(label)) map.set(label, { label, total: 0 })
        const o = map.get(label)
        o[r.gender] = (o[r.gender] || 0) + Number(r.visitors)
        o.total += Number(r.visitors)
    })
    return [...map.values()]
}

const toBars = (rows = [], key) => rows.map((r) => ({ label: r[key] ?? 'Not given', value: Number(r.visitors) }))

function Home() {
    const { data, isLoading, error, dataUpdatedAt } = useDashboard()

    const ageRows = useMemo(
        () => pivotGender(data?.ageGender, 'age_group').sort((a, b) => a.label.localeCompare(b.label))
            .map((r) => ({ ...r, label: r.label.replace(/^\d\.\s*/, '') })),
        [data]
    )
    const genreRows = useMemo(
        () => pivotGender(data?.genres, 'genre').sort((a, b) => b.total - a.total),
        [data]
    )
    const daywise = useMemo(
        () => (data?.daywise || []).map((d) => ({
            label: new Date(d.visit_date).toLocaleDateString('en-IN', { day: '2-digit', month: 'short' }),
            value: Number(d.visitors),
        })),
        [data]
    )

    const s = data?.summary || {}

    return (
        <>
            <Navbar />
            <div className='p-3 sm:p-5 flex flex-col bg-gray-100 min-h-screen gap-4'>

                <div className='flex flex-wrap justify-between items-baseline gap-2'>
                    <h1 className='text-xl sm:text-2xl font-bold text-gray-900'>புத்தகத் திருவிழா – டாஷ்போர்டு / Book Fair Dashboard</h1>
                    {dataUpdatedAt > 0 && (
                        <p className='text-xs text-gray-500'>Auto-refresh every 1 min · Last updated {new Date(dataUpdatedAt).toLocaleTimeString('en-IN')}</p>
                    )}
                </div>

                {isLoading && <p className='p-4'>Loading...</p>}
                {error && (
                    <p className='p-4 text-red-600 bg-red-50 rounded-xl'>
                        Error loading data: {error.message}. (Supabase-ல் SQL setup Run செய்யப்பட்டுள்ளதா என்று சரிபார்க்கவும்)
                    </p>
                )}

                {data && (
                    <>
                        <div className='grid grid-cols-2 lg:grid-cols-3 gap-4'>
                            <StatCard icon={<FaUsers />} label='மொத்த வருகை / Total Visitors' value={fmt(s.total_visitors)} />
                            <StatCard icon={<FaCalendarDay />} label='இன்று / Today' value={fmt(s.today)} />
                            <StatCard icon={<FaMale />} label='ஆண் / Male' value={fmt(s.male)} />
                            <StatCard icon={<FaFemale />} label='பெண் / Female' value={fmt(s.female)} />
                            <StatCard icon={<FaBook />} label='வாங்கிய நூல்கள் / Books Bought' value={fmt(s.total_books_bought)} />
                            <StatCard icon={<FaStar />} label='சராசரி மதிப்பீடு / Avg Rating' value={s.avg_rating ? `${s.avg_rating} / 5` : '-'} />
                        </div>

                        <Card title='நாள்வாரி வருகை / Day-wise Footfall'>
                            <ColumnChart rows={daywise} />
                        </Card>

                        <div className='grid grid-cols-1 lg:grid-cols-2 gap-4'>
                            <Card title='வயது பிரிவு & பாலினம் / Age Group by Gender'>
                                <GenderStackList rows={ageRows} />
                            </Card>
                            <Card title='விரும்பும் புத்தக வகைகள் / Preferred Book Types' subtitle='By gender · one visitor can choose many types'>
                                <GenderStackList rows={genreRows} />
                            </Card>
                            <Card title='வருகையின் நோக்கம் / Purpose of Visit' subtitle='One visitor can choose many'>
                                <BarList rows={toBars(data.purpose, 'purpose')} />
                            </Card>
                            <Card title='தொழில் / Occupation'>
                                <BarList rows={toBars(data.occupation, 'occupation')} />
                            </Card>
                            <Card title='ஊர் / Where Visitors Came From'>
                                <BarList rows={toBars(data.location, 'location')} max={25} />
                            </Card>
                            <div className='flex flex-col gap-4'>
                                <Card title='மதிப்பீடு / Rating'>
                                    <BarList rows={[5, 4, 3, 2, 1].map((n) => ({
                                        label: '★'.repeat(n),
                                        value: Number(data.rating?.find((r) => r.rating === n)?.visitors || 0),
                                    }))} />
                                </Card>
                                <Card title='மொழி / Preferred Language'>
                                    <BarList rows={toBars(data.language, 'language')} />
                                </Card>
                            </div>
                            <Card title='எப்படி அறிந்தனர் / How They Heard'>
                                <BarList rows={toBars(data.howHeard, 'how_heard')} />
                            </Card>
                        </div>

                        <Card title='சமீபத்திய கருத்துகள் / Latest Feedback' subtitle='Latest 25 · full list in Reports → Download Excel'>
                            {data.feedback?.length ? (
                                <div className='flex flex-col divide-y'>
                                    {data.feedback.map((f, i) => (
                                        <div key={i} className='py-3'>
                                            <div className='flex flex-wrap gap-x-3 text-xs text-gray-500'>
                                                <span className='font-semibold text-gray-800'>{f.name}</span>
                                                <span>{f.age} yrs · {f.gender}</span>
                                                <span className='text-amber-600'>{'★'.repeat(f.rating || 0)}</span>
                                                <span>{new Date(f.created_at).toLocaleString('en-IN')}</span>
                                            </div>
                                            {f.feedback && <p className='text-sm text-gray-900 mt-1'>{f.feedback}</p>}
                                            {f.suggestions && <p className='text-sm text-gray-600 mt-1'><b>Suggestion:</b> {f.suggestions}</p>}
                                        </div>
                                    ))}
                                </div>
                            ) : <p className='text-sm text-gray-400'>இன்னும் கருத்துகள் இல்லை / No feedback yet</p>}
                        </Card>
                    </>
                )}
            </div>
        </>
    )
}

export default Home
