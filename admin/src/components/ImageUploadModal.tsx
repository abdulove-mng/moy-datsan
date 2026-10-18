import { useEffect, useRef, useState, type ChangeEvent } from 'react'
import type { UploadResponse } from '@datsan/shared'
import { api } from '../lib/api'

// Окно загрузки картинки (как в «Я стоик»): выбрать файл → загрузить на сервер →
// задать ширину и подпись → вставить в текст.

interface ImageUploadModalProps {
  onInsert: (html: string) => void
  onClose: () => void
}

export default function ImageUploadModal({ onInsert, onClose }: ImageUploadModalProps) {
  const [file, setFile] = useState<File | null>(null)
  const [previewUrl, setPreviewUrl] = useState<string | null>(null)
  const [uploadedUrl, setUploadedUrl] = useState<string | null>(null)
  const [width, setWidth] = useState(100)
  const [alt, setAlt] = useState('')
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')
  const inputRef = useRef<HTMLInputElement>(null)

  // Сразу открываем выбор файла.
  useEffect(() => {
    inputRef.current?.click()
  }, [])

  // Освобождаем память от локального предпросмотра.
  useEffect(() => () => {
    if (previewUrl) URL.revokeObjectURL(previewUrl)
  }, [previewUrl])

  function handleSelect(e: ChangeEvent<HTMLInputElement>) {
    const selected = e.target.files?.[0]
    if (!selected) return
    setFile(selected)
    setUploadedUrl(null)
    setError('')
    setPreviewUrl(URL.createObjectURL(selected))
  }

  async function handleUpload() {
    if (!file) return
    setLoading(true)
    setError('')
    const form = new FormData()
    form.append('image', file)
    try {
      const { url } = await api<UploadResponse>('/api/upload', { method: 'POST', body: form })
      setUploadedUrl(url)
    } catch (err) {
      setError((err as Error).message)
    } finally {
      setLoading(false)
    }
  }

  function handleInsert() {
    if (!uploadedUrl) return
    const safeAlt = alt.replace(/"/g, '&quot;')
    onInsert(`<img src="${uploadedUrl}" alt="${safeAlt}" style="width:${width}%" />\n`)
    onClose()
  }

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div className="modal" onClick={(e) => e.stopPropagation()} role="dialog" aria-label="Загрузка изображения">
        <div className="modal__header">
          <h2 className="modal__title">Картинка</h2>
          <button className="modal__close" onClick={onClose} aria-label="Закрыть">
            ✕
          </button>
        </div>

        <input ref={inputRef} type="file" accept="image/jpeg,image/png,image/webp,image/gif" onChange={handleSelect} hidden />

        {!previewUrl ? (
          <button className="modal__empty" onClick={() => inputRef.current?.click()}>
            <span className="modal__empty-icon">🖼️</span>
            Выбрать файл (JPG, PNG, WebP, GIF, до 10 МБ)
          </button>
        ) : (
          <>
            <div className="modal__preview">
              <img src={previewUrl} alt="" style={{ width: `${width}%` }} />
            </div>

            {uploadedUrl ? (
              <>
                <label className="field">
                  <span className="field__label">Ширина: {width}%</span>
                  <input type="range" min={20} max={100} step={5} value={width} onChange={(e) => setWidth(Number(e.target.value))} />
                </label>
                <label className="field">
                  <span className="field__label">Описание (для незрячих и если картинка не загрузится)</span>
                  <input className="field__input" value={alt} onChange={(e) => setAlt(e.target.value)} placeholder="Например: Зелёная Тара" />
                </label>
              </>
            ) : null}

            {error && <p className="login-card__error">{error}</p>}

            <div className="modal__actions">
              {uploadedUrl ? (
                <button className="btn btn--primary" onClick={handleInsert}>
                  Вставить в текст
                </button>
              ) : (
                <button className="btn btn--primary" onClick={handleUpload} disabled={loading}>
                  {loading ? 'Загрузка…' : 'Загрузить на сервер'}
                </button>
              )}
              <button className="btn btn--ghost" onClick={() => inputRef.current?.click()}>
                Другой файл
              </button>
            </div>
          </>
        )}
      </div>
    </div>
  )
}
