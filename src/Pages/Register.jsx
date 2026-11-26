import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { FaStar } from 'react-icons/fa'
import Navbar from '../Components/Navbar'
import { supabase } from '../supabaseClient'
import {
  GENDERS, OCCUPATIONS, AREA_TYPES, BLOCKS, ULBS, PURPOSES, GENRES,
  LANGUAGES, AMOUNTS, HOW_HEARD,
} from '../data/options'

const TABLE = 'bookfair_visitors'

const initialForm = {
  name: '',
  age: '',
  gender: '',
  mobile: '',
  occupation: '',
  area_type: '',
  block: '',
  ulb: '',
  other_district: '',
  visit_purpose: [],
  book_genres: [],
  book_language: [],
  books_bought: '',
  amount_spent: '',
  how_heard: '',
  rating: 0,
  feedback: '',
  suggestions: '',
}

const inputCls = 'w-full bg-gray-100 p-3 sm:p-4 rounded-xl mt-2 outline-emerald-600'
const labelCls = 'text-sm font-semibold text-emerald-950'

function Label({ ta, en, required }) {
  return (
    <label className={labelCls}>
      {ta} / {en} {required && <span className='text-red-500'>*</span>}
    </label>
  )
}

function Section({ title, children }) {
  return (
    <section className='bg-white rounded-2xl p-4 sm:p-6 md:p-8 shadow space-y-5'>
      <h2 className='text-lg md:text-xl font-bold text-emerald-800 border-b pb-2'>{title}</h2>
      {children}
    </section>
  )
}

function Chips({ options, selected, onToggle }) {
  return (
    <div className='flex flex-wrap gap-2 mt-2'>
      {options.map((o) => {
        const on = selected.includes(o.value)
        return (
          <button
            type='button'
            key={o.value}
            onClick={() => onToggle(o.value)}
            className={`px-3 py-2 rounded-full border text-sm text-left transition
              ${on ? 'bg-emerald-700 border-emerald-700 text-white' : 'bg-white border-gray-300 text-gray-800 hover:border-emerald-600'}`}
          >
            {on ? '✓ ' : ''}{o.ta}
            <span className={`block text-[11px] ${on ? 'text-emerald-100' : 'text-gray-500'}`}>{o.value}</span>
          </button>
        )
      })}
    </div>
  )
}

export default function Register() {
  const navigate = useNavigate()
  const [form, setForm] = useState(initialForm)
  const [submitting, setSubmitting] = useState(false)
  const [errorMessage, setErrorMessage] = useState('')

  const set = (name, value) => {
    setErrorMessage('')
    setForm((prev) => ({ ...prev, [name]: value }))
  }

  const handleChange = (e) => {
    const { name, value } = e.target
    setErrorMessage('')
    if (name === 'area_type') {
      setForm((prev) => ({ ...prev, area_type: value, block: '', ulb: '', other_district: '' }))
      return
    }
    set(name, value)
  }

  const toggle = (field) => (value) => {
    setErrorMessage('')
    setForm((prev) => ({
      ...prev,
      [field]: prev[field].includes(value)
        ? prev[field].filter((v) => v !== value)
        : [...prev[field], value],
    }))
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    setErrorMessage('')

    const age = Number(form.age)
    const mobile = form.mobile.replace(/\D/g, '').slice(-10)

    if (!form.name.trim()) return setErrorMessage('பெயரை உள்ளிடவும் / Please enter your name')
    if (!age || age < 3 || age > 110) return setErrorMessage('சரியான வயதை உள்ளிடவும் / Enter a valid age')
    if (!form.gender) return setErrorMessage('பாலினத்தைத் தேர்வு செய்யவும் / Select gender')
    if (form.mobile && !/^[6-9]\d{9}$/.test(mobile)) return setErrorMessage('சரியான கைபேசி எண் / Enter a valid 10-digit mobile number')
    if (!form.occupation) return setErrorMessage('தொழிலைத் தேர்வு செய்யவும் / Select occupation')
    if (!form.area_type) return setErrorMessage('ஊர் விவரத்தைத் தேர்வு செய்யவும் / Select where you are from')
    if (form.area_type === 'Rural' && !form.block) return setErrorMessage('ஒன்றியத்தைத் தேர்வு செய்யவும் / Select block')
    if (form.area_type === 'Urban' && !form.ulb) return setErrorMessage('நகராட்சியைத் தேர்வு செய்யவும் / Select municipality / town panchayat')
    if (form.visit_purpose.length === 0) return setErrorMessage('வருகையின் நோக்கத்தைத் தேர்வு செய்யவும் / Select purpose of visit')
    if (form.book_genres.length === 0) return setErrorMessage('விரும்பும் புத்தக வகையைத் தேர்வு செய்யவும் / Select at least one book type')
    if (!form.rating) return setErrorMessage('மதிப்பீடு வழங்கவும் / Please give a rating')

    const payload = {
      name: form.name.trim(),
      age,
      gender: form.gender,
      mobile: mobile || null,
      occupation: form.occupation,
      area_type: form.area_type,
      block: form.area_type === 'Rural' ? form.block : null,
      ulb: form.area_type === 'Urban' ? form.ulb : null,
      other_district: form.area_type === 'Other District' ? (form.other_district.trim() || null) : null,
      visit_purpose: form.visit_purpose,
      book_genres: form.book_genres,
      book_language: form.book_language,
      books_bought: form.books_bought === '' ? null : Number(form.books_bought),
      amount_spent: form.amount_spent || null,
      how_heard: form.how_heard || null,
      rating: form.rating,
      feedback: form.feedback.trim() || null,
      suggestions: form.suggestions.trim() || null,
    }

    try {
      setSubmitting(true)
      const { error } = await supabase.from(TABLE).insert(payload)
      if (error) throw error
      navigate('/thanks', { state: { name: payload.name }, replace: true })
    } catch (err) {
      console.error(err)
      setErrorMessage('பதிவு செய்ய இயலவில்லை, மீண்டும் முயற்சிக்கவும் / Could not save, please try again')
    } finally {
      setSubmitting(false)
    }
  }

  return (
    <div className='bg-amber-50 text-[#191c1d] min-h-screen flex flex-col'>
      <Navbar />

      <main className='grow pt-5 pb-16 px-3 sm:px-6 max-w-4xl mx-auto w-full'>
        <button
          className='bg-emerald-700 px-5 text-sm text-white py-2 rounded-full mb-4 hover:bg-emerald-800'
          onClick={() => navigate('/')}
        >
          Back
        </button>

        <h1 className='text-2xl sm:text-3xl md:text-4xl font-bold text-emerald-800'>
          பார்வையாளர் பதிவு
          <span className='block text-lg sm:text-xl font-semibold text-gray-600 mt-1'>Visitor Registration</span>
        </h1>
        <p className='text-sm text-gray-600 mt-2 mb-6'>
          <span className='text-red-500'>*</span> குறியிட்டவை கட்டாயம் / Fields marked * are required
        </p>

        <form className='space-y-6' onSubmit={handleSubmit} noValidate>

          <Section title='1. உங்களைப் பற்றி / About You'>
            <div className='grid grid-cols-1 md:grid-cols-2 gap-5'>
              <div>
                <Label ta='பெயர்' en='Name' required />
                <input name='name' value={form.name} onChange={handleChange} maxLength={100} className={inputCls} />
              </div>
              <div>
                <Label ta='வயது' en='Age' required />
                <input name='age' type='number' inputMode='numeric' min={3} max={110} value={form.age} onChange={handleChange} className={inputCls} />
              </div>
              <div>
                <Label ta='பாலினம்' en='Gender' required />
                <select name='gender' value={form.gender} onChange={handleChange} className={inputCls}>
                  <option value='' disabled>தேர்வு செய்க / Select</option>
                  {GENDERS.map((g) => <option key={g.value} value={g.value}>{g.ta} / {g.value}</option>)}
                </select>
              </div>
              <div>
                <Label ta='கைபேசி எண் (விருப்பம்)' en='Mobile (optional)' />
                <input name='mobile' type='tel' inputMode='numeric' maxLength={10} value={form.mobile} onChange={handleChange} className={inputCls} />
              </div>
              <div className='md:col-span-2'>
                <Label ta='தொழில்' en='Occupation' required />
                <select name='occupation' value={form.occupation} onChange={handleChange} className={inputCls}>
                  <option value='' disabled>தேர்வு செய்க / Select</option>
                  {OCCUPATIONS.map((o) => <option key={o.value} value={o.value}>{o.ta} / {o.value}</option>)}
                </select>
              </div>
              <div>
                <Label ta='நீங்கள் எங்கிருந்து வருகிறீர்கள்?' en='Where are you from?' required />
                <select name='area_type' value={form.area_type} onChange={handleChange} className={inputCls}>
                  <option value='' disabled>தேர்வு செய்க / Select</option>
                  {AREA_TYPES.map((a) => <option key={a.value} value={a.value}>{a.ta} / {a.value}</option>)}
                </select>
              </div>
              {form.area_type === 'Rural' && (
                <div>
                  <Label ta='ஊராட்சி ஒன்றியம்' en='Block' required />
                  <select name='block' value={form.block} onChange={handleChange} className={inputCls}>
                    <option value='' disabled>Select Block</option>
                    {BLOCKS.map((b) => <option key={b}>{b}</option>)}
                  </select>
                </div>
              )}
              {form.area_type === 'Urban' && (
                <div>
                  <Label ta='நகராட்சி / பேரூராட்சி' en='Municipality / Town Panchayat' required />
                  <select name='ulb' value={form.ulb} onChange={handleChange} className={inputCls}>
                    <option value='' disabled>Select</option>
                    {ULBS.map((u) => <option key={u}>{u}</option>)}
                  </select>
                </div>
              )}
              {form.area_type === 'Other District' && (
                <div>
                  <Label ta='மாவட்டத்தின் பெயர்' en='District name' />
                  <input name='other_district' value={form.other_district} onChange={handleChange} maxLength={60} className={inputCls} />
                </div>
              )}
            </div>
          </Section>

          <Section title='2. உங்கள் வருகை / Your Visit'>
            <div>
              <Label ta='வருகையின் நோக்கம் (ஒன்றுக்கு மேல் தேர்வு செய்யலாம்)' en='Purpose of visit (select all that apply)' required />
              <Chips options={PURPOSES} selected={form.visit_purpose} onToggle={toggle('visit_purpose')} />
            </div>
            <div>
              <Label ta='புத்தகத் திருவிழா பற்றி எப்படி அறிந்தீர்கள்?' en='How did you hear about the fair?' />
              <select name='how_heard' value={form.how_heard} onChange={handleChange} className={inputCls}>
                <option value=''>தேர்வு செய்க / Select</option>
                {HOW_HEARD.map((h) => <option key={h.value} value={h.value}>{h.ta} / {h.value}</option>)}
              </select>
            </div>
          </Section>

          <Section title='3. வாசிப்பு விருப்பம் / Reading Interests'>
            <div>
              <Label ta='நீங்கள் வாசிக்க விரும்பும் புத்தக வகைகள்' en='Types of books you like to read' required />
              <Chips options={GENRES} selected={form.book_genres} onToggle={toggle('book_genres')} />
            </div>
            <div>
              <Label ta='விரும்பும் மொழி' en='Preferred language' />
              <Chips options={LANGUAGES} selected={form.book_language} onToggle={toggle('book_language')} />
            </div>
            <div className='grid grid-cols-1 md:grid-cols-2 gap-5'>
              <div>
                <Label ta='வாங்கிய / வாங்க உள்ள புத்தகங்கள் எண்ணிக்கை' en='No. of books bought / planning to buy' />
                <input name='books_bought' type='number' inputMode='numeric' min={0} max={500} value={form.books_bought} onChange={handleChange} className={inputCls} />
              </div>
              <div>
                <Label ta='புத்தகங்களுக்கான செலவு' en='Amount spent on books' />
                <select name='amount_spent' value={form.amount_spent} onChange={handleChange} className={inputCls}>
                  <option value=''>தேர்வு செய்க / Select</option>
                  {AMOUNTS.map((a) => <option key={a.value} value={a.value}>{a.ta}</option>)}
                </select>
              </div>
            </div>
          </Section>

          <Section title='4. உங்கள் கருத்து / Your Feedback'>
            <div>
              <Label ta='புத்தகத் திருவிழாவிற்கு உங்கள் மதிப்பீடு' en='Rate the Book Fair' required />
              <div className='flex gap-2 mt-3'>
                {[1, 2, 3, 4, 5].map((n) => (
                  <button
                    type='button'
                    key={n}
                    aria-label={`${n} star`}
                    onClick={() => set('rating', n)}
                    className={`p-1 ${n <= form.rating ? 'text-amber-500' : 'text-gray-300'}`}
                  >
                    <FaStar size={36} />
                  </button>
                ))}
              </div>
            </div>
            <div>
              <Label ta='புத்தகத் திருவிழா பற்றிய உங்கள் கருத்து' en='Your opinion about the Book Fair' />
              <textarea name='feedback' rows={3} maxLength={1000} value={form.feedback} onChange={handleChange} className={inputCls} />
            </div>
            <div>
              <Label ta='அடுத்த ஆண்டுக்கான ஆலோசனைகள்' en='Suggestions for next year' />
              <textarea name='suggestions' rows={3} maxLength={1000} value={form.suggestions} onChange={handleChange} className={inputCls} />
            </div>
          </Section>

          {errorMessage && <p className='text-red-600 font-medium bg-red-50 p-3 rounded-xl'>{errorMessage}</p>}

          <button
            type='submit'
            disabled={submitting}
            className='w-full bg-emerald-700 text-white py-4 rounded-xl text-lg font-semibold shadow hover:bg-emerald-800 active:scale-95 transition disabled:opacity-60'
          >
            {submitting ? 'சேமிக்கிறது... / Saving...' : 'சமர்ப்பிக்கவும் / Submit'}
          </button>
        </form>
      </main>
    </div>
  )
}
