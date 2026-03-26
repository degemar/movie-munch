import React, { useState } from 'react'
import { useNavigate, useSearchParams } from 'react-router-dom'
import { useApp } from '../App'

const PLATFORMS = ['Netflix', 'Disney+', 'YouTube', 'Amazon', 'Apple TV+', 'HBO Max', 'Cinema', 'Other']

export default function AddTitle() {
  const { addTitle } = useApp()
  const navigate = useNavigate()
  const [searchParams] = useSearchParams()
  const prefillName = searchParams.get('name') ?? ''

  const [name, setName] = useState(prefillName)
  const [type, setType] = useState<'movie' | 'tv'>('movie')
  const [platform, setPlatform] = useState('')
  const [customPlatform, setCustomPlatform] = useState('')
  const [year, setYear] = useState('')
  const [overview, setOverview] = useState('')
  const [genre, setGenre] = useState('')
  const [runtime, setRuntime] = useState('')
  const [seasons, setSeasons] = useState('')
  const [errors, setErrors] = useState<Record<string, string>>({})

  const effectivePlatform = platform === 'Other' ? customPlatform : platform

  function validate() {
    const e: Record<string, string> = {}
    if (!name.trim()) e.name = 'Title name is required'
    if (!effectivePlatform.trim()) e.platform = 'Platform is required'
    setErrors(e)
    return Object.keys(e).length === 0
  }

  function handleSave() {
    if (!validate()) return
    const id = addTitle({
      type,
      title: name.trim(),
      platform: effectivePlatform.trim(),
      year: year ? parseInt(year) : undefined,
      overview: overview.trim() || undefined,
      genre: genre.trim() || undefined,
      runtimeMinutes: type === 'movie' && runtime ? parseInt(runtime) : undefined,
      seasonsCount: type === 'tv' && seasons ? parseInt(seasons) : undefined,
    })
    navigate(`/title/${id}`)
  }

  const inputStyle: React.CSSProperties = {
    width: '100%',
    padding: '14px 16px',
    borderRadius: 14,
    border: '2px solid var(--border)',
    fontSize: '1rem',
    outline: 'none',
    background: 'white',
    transition: 'border-color 0.15s',
  }
  const errorStyle: React.CSSProperties = {
    color: '#DC2626',
    fontSize: '0.8rem',
    marginTop: 4,
  }

  return (
    <div className="page">
      <div className="page-header">
        <div className="page-title">➕ Add Title</div>
      </div>

      <div style={{ display: 'flex', flexDirection: 'column', gap: 20 }}>

        {/* Title name */}
        <div>
          <label style={{ fontWeight: 700, display: 'block', marginBottom: 8 }}>
            🎬 Title name <span style={{ color: '#DC2626' }}>*</span>
          </label>
          <input
            autoFocus
            placeholder="e.g. The Lion King"
            value={name}
            onChange={e => setName(e.target.value)}
            style={{ ...inputStyle, borderColor: errors.name ? '#DC2626' : undefined, fontSize: '1.05rem' }}
          />
          {errors.name && <div style={errorStyle}>{errors.name}</div>}
        </div>

        {/* Type toggle */}
        <div>
          <label style={{ fontWeight: 700, display: 'block', marginBottom: 10 }}>
            📺 What kind? <span style={{ color: '#DC2626' }}>*</span>
          </label>
          <div style={{ display: 'flex', gap: 10 }}>
            <button
              type="button"
              onClick={() => setType('movie')}
              style={{
                flex: 1, padding: '14px', borderRadius: 14, border: '2px solid',
                borderColor: type === 'movie' ? 'var(--orange)' : 'var(--border)',
                background: type === 'movie' ? '#FFF3EE' : 'white',
                fontWeight: 700, fontSize: '1rem', cursor: 'pointer',
                transition: 'all 0.15s',
              }}
            >
              🎬 Movie
            </button>
            <button
              type="button"
              onClick={() => setType('tv')}
              style={{
                flex: 1, padding: '14px', borderRadius: 14, border: '2px solid',
                borderColor: type === 'tv' ? 'var(--orange)' : 'var(--border)',
                background: type === 'tv' ? '#FFF3EE' : 'white',
                fontWeight: 700, fontSize: '1rem', cursor: 'pointer',
                transition: 'all 0.15s',
              }}
            >
              📺 TV Show
            </button>
          </div>
        </div>

        {/* Platform */}
        <div>
          <label style={{ fontWeight: 700, display: 'block', marginBottom: 10 }}>
            📡 Where to watch? <span style={{ color: '#DC2626' }}>*</span>
          </label>
          <div style={{ display: 'flex', flexWrap: 'wrap', gap: 8, marginBottom: platform === 'Other' ? 10 : 0 }}>
            {PLATFORMS.map(p => (
              <button
                key={p}
                type="button"
                onClick={() => setPlatform(p)}
                style={{
                  padding: '9px 16px', borderRadius: 100, border: '2px solid',
                  borderColor: platform === p ? 'var(--orange)' : 'var(--border)',
                  background: platform === p ? 'var(--orange)' : 'white',
                  color: platform === p ? 'white' : 'var(--text)',
                  fontWeight: 700, fontSize: '0.88rem', cursor: 'pointer',
                  transition: 'all 0.15s',
                }}
              >
                {p}
              </button>
            ))}
          </div>
          {platform === 'Other' && (
            <input
              autoFocus
              placeholder="Enter platform name…"
              value={customPlatform}
              onChange={e => setCustomPlatform(e.target.value)}
              style={{ ...inputStyle, marginTop: 4, borderColor: errors.platform ? '#DC2626' : undefined }}
            />
          )}
          {errors.platform && <div style={errorStyle}>{errors.platform}</div>}
        </div>

        {/* Optional fields */}
        <div style={{ display: 'flex', gap: 12 }}>
          <div style={{ flex: 1 }}>
            <label style={{ fontWeight: 700, display: 'block', marginBottom: 8, fontSize: '0.9rem' }}>
              📅 Year <span style={{ color: 'var(--text-muted)', fontWeight: 400 }}>(optional)</span>
            </label>
            <input
              type="number"
              placeholder="2024"
              value={year}
              onChange={e => setYear(e.target.value)}
              style={{ ...inputStyle }}
            />
          </div>
          <div style={{ flex: 1 }}>
            <label style={{ fontWeight: 700, display: 'block', marginBottom: 8, fontSize: '0.9rem' }}>
              🎭 Genre <span style={{ color: 'var(--text-muted)', fontWeight: 400 }}>(optional)</span>
            </label>
            <input
              placeholder="e.g. Animation"
              value={genre}
              onChange={e => setGenre(e.target.value)}
              style={{ ...inputStyle }}
            />
          </div>
        </div>

        {type === 'movie' && (
          <div>
            <label style={{ fontWeight: 700, display: 'block', marginBottom: 8, fontSize: '0.9rem' }}>
              ⏱ Runtime (minutes) <span style={{ color: 'var(--text-muted)', fontWeight: 400 }}>(optional)</span>
            </label>
            <input
              type="number"
              placeholder="e.g. 98"
              value={runtime}
              onChange={e => setRuntime(e.target.value)}
              style={{ ...inputStyle }}
            />
          </div>
        )}

        {type === 'tv' && (
          <div>
            <label style={{ fontWeight: 700, display: 'block', marginBottom: 8, fontSize: '0.9rem' }}>
              📋 Number of seasons <span style={{ color: 'var(--text-muted)', fontWeight: 400 }}>(optional)</span>
            </label>
            <input
              type="number"
              placeholder="e.g. 3"
              value={seasons}
              onChange={e => setSeasons(e.target.value)}
              style={{ ...inputStyle }}
            />
          </div>
        )}

        <div>
          <label style={{ fontWeight: 700, display: 'block', marginBottom: 8, fontSize: '0.9rem' }}>
            📝 Description <span style={{ color: 'var(--text-muted)', fontWeight: 400 }}>(optional)</span>
          </label>
          <textarea
            placeholder="What's it about?"
            value={overview}
            onChange={e => setOverview(e.target.value)}
            rows={3}
            style={{ ...inputStyle, resize: 'vertical', fontFamily: 'inherit' }}
          />
        </div>

        <button
          className="btn btn-primary btn-full"
          style={{ padding: '16px', fontSize: '1.1rem', marginBottom: 8 }}
          onClick={handleSave}
        >
          Save & Rate It! 🍿
        </button>
      </div>
    </div>
  )
}
