import React from 'react'

// Colours: one hue for single-series bars; fixed order for gender identity.
export const BAR = '#257de0'
export const GENDER_COLORS = { Male: '#257de0', Female: '#f47230', Transgender: '#00b894' }
const GENDER_TA = { Male: 'ஆண்', Female: 'பெண்', Transgender: 'மூ.பா' }

const fmt = (n) => Number(n || 0).toLocaleString('en-IN')

export function Card({ title, subtitle, children, className = '' }) {
    return (
        <div className={`bg-white rounded-2xl shadow p-4 sm:p-5 ${className}`}>
            <h3 className='font-semibold text-gray-900'>{title}</h3>
            {subtitle && <p className='text-xs text-gray-500 mb-1'>{subtitle}</p>}
            <div className='mt-3'>{children}</div>
        </div>
    )
}

export function StatCard({ icon, label, value }) {
    return (
        <div className='bg-white p-5 rounded-2xl shadow flex items-center gap-4'>
            <div className='bg-blue-100 p-4 rounded-xl text-blue-700 text-2xl'>{icon}</div>
            <div>
                <p className='text-gray-500 text-sm'>{label}</p>
                <p className='text-2xl font-bold text-gray-900'>{value}</p>
            </div>
        </div>
    )
}

const Empty = () => <p className='text-sm text-gray-400 py-6 text-center'>இன்னும் தரவு இல்லை / No data yet</p>

// Horizontal bar list: rows = [{ label, value }]
export function BarList({ rows = [], max: maxRows = 15 }) {
    if (!rows.length) return <Empty />
    const data = rows.slice(0, maxRows)
    const max = Math.max(...data.map((r) => Number(r.value) || 0), 1)
    const total = rows.reduce((s, r) => s + Number(r.value || 0), 0)
    return (
        <div className='flex flex-col gap-2.5'>
            {data.map((r) => {
                const v = Number(r.value) || 0
                const pct = total ? ((v / total) * 100).toFixed(1) : 0
                return (
                    <div key={r.label} className='group' title={`${r.label}: ${fmt(v)} (${pct}%)`}>
                        <div className='flex justify-between text-sm text-gray-700'>
                            <span className='truncate pr-2'>{r.label}</span>
                            <span className='font-semibold text-gray-900 tabular-nums'>{fmt(v)}</span>
                        </div>
                        <div className='h-2.5 bg-gray-100 rounded mt-1'>
                            <div
                                className='h-2.5 rounded group-hover:opacity-80'
                                style={{ width: `${(v / max) * 100}%`, background: BAR, minWidth: v ? 4 : 0 }}
                            />
                        </div>
                    </div>
                )
            })}
        </div>
    )
}

function GenderLegend() {
    return (
        <div className='flex flex-wrap gap-4 text-xs text-gray-700 mb-3'>
            {Object.entries(GENDER_COLORS).map(([g, c]) => (
                <span key={g} className='flex items-center gap-1.5'>
                    <span className='w-3 h-3 rounded-sm inline-block' style={{ background: c }} />
                    {GENDER_TA[g]} / {g}
                </span>
            ))}
        </div>
    )
}

// Stacked horizontal bars by gender: rows = [{ label, Male, Female, Transgender }]
export function GenderStackList({ rows = [] }) {
    if (!rows.length) return <Empty />
    const totals = rows.map((r) => Object.keys(GENDER_COLORS).reduce((s, g) => s + (r[g] || 0), 0))
    const max = Math.max(...totals, 1)
    return (
        <div>
            <GenderLegend />
            <div className='flex flex-col gap-3'>
                {rows.map((r, i) => (
                    <div key={r.label}>
                        <div className='flex justify-between text-sm text-gray-700'>
                            <span>{r.label}</span>
                            <span className='font-semibold text-gray-900 tabular-nums'>{fmt(totals[i])}</span>
                        </div>
                        <div className='flex h-3 mt-1 gap-[2px]' style={{ width: `${(totals[i] / max) * 100}%`, minWidth: totals[i] ? 4 : 0 }}>
                            {Object.entries(GENDER_COLORS).map(([g, c]) =>
                                r[g] ? (
                                    <div
                                        key={g}
                                        title={`${r.label} · ${g}: ${fmt(r[g])}`}
                                        className='h-3 first:rounded-l last:rounded-r hover:opacity-80'
                                        style={{ flexGrow: r[g], background: c }}
                                    />
                                ) : null
                            )}
                        </div>
                    </div>
                ))}
            </div>
        </div>
    )
}

// Day-wise column chart: rows = [{ label, value }]
export function ColumnChart({ rows = [] }) {
    if (!rows.length) return <Empty />
    const max = Math.max(...rows.map((r) => Number(r.value) || 0), 1)
    return (
        <div className='overflow-x-auto'>
            <div className='flex items-end gap-2 h-48 border-b border-gray-300 min-w-max px-1'>
                {rows.map((r) => (
                    <div key={r.label} className='flex flex-col items-center justify-end h-full w-12' title={`${r.label}: ${fmt(r.value)}`}>
                        <span className='text-xs font-semibold text-gray-900 mb-1 tabular-nums'>{fmt(r.value)}</span>
                        <div className='w-6 rounded-t hover:opacity-80' style={{ height: `${(r.value / max) * 85}%`, background: BAR, minHeight: r.value ? 4 : 0 }} />
                    </div>
                ))}
            </div>
            <div className='flex gap-2 min-w-max px-1 mt-1'>
                {rows.map((r) => (
                    <span key={r.label} className='w-12 text-center text-[11px] text-gray-500'>{r.label}</span>
                ))}
            </div>
        </div>
    )
}
