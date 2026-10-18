import { useRef, useState } from 'react'
import ImageUploadModal from './ImageUploadModal'

// Редактор текста материалов (как в «Я стоик»): поле с HTML, кнопки форматирования
// и живой предпросмотр справа — как текст будет выглядеть в приложении.

interface HtmlEditorProps {
  id: string
  value: string
  onChange: (value: string) => void
  placeholder?: string
  rows?: number
}

export default function HtmlEditor({ id, value, onChange, placeholder, rows = 16 }: HtmlEditorProps) {
  const textareaRef = useRef<HTMLTextAreaElement>(null)
  const [showImageModal, setShowImageModal] = useState(false)

  // Обернуть выделенный текст тегами (или вставить заготовку, если ничего не выделено).
  function wrap(open: string, close: string, fallback: string) {
    const textarea = textareaRef.current
    if (!textarea) return
    const { selectionStart: start, selectionEnd: end } = textarea
    const selected = value.slice(start, end) || fallback
    onChange(value.slice(0, start) + open + selected + close + value.slice(end))
    requestAnimationFrame(() => {
      textarea.focus()
      textarea.setSelectionRange(start + open.length, start + open.length + selected.length)
    })
  }

  function insert(html: string) {
    const textarea = textareaRef.current
    const start = textarea?.selectionStart ?? value.length
    const end = textarea?.selectionEnd ?? value.length
    onChange(value.slice(0, start) + html + value.slice(end))
  }

  const buttons: { label: React.ReactNode; title: string; run: () => void; accent?: boolean }[] = [
    { label: 'H2', title: 'Заголовок', run: () => wrap('<h2>', '</h2>', 'Заголовок') },
    { label: 'H3', title: 'Подзаголовок', run: () => wrap('<h3>', '</h3>', 'Подзаголовок') },
    { label: <strong>B</strong>, title: 'Жирный', run: () => wrap('<strong>', '</strong>', 'важное') },
    { label: <em>I</em>, title: 'Курсив', run: () => wrap('<em>', '</em>', 'курсив') },
    { label: '¶', title: 'Абзац', run: () => wrap('<p>', '</p>', 'Абзац') },
    { label: '❝', title: 'Цитата', run: () => wrap('<blockquote>', '</blockquote>', 'Цитата') },
    { label: 'ॐ', title: 'Мантра', run: () => wrap('<p class="mantra">', '</p>', 'ОМ МАНИ ПАДМЕ ХУМ'), accent: true },
    { label: '✦', title: 'Выделенный блок', run: () => wrap('<div class="accent">\n  <p>', '</p>\n</div>', 'Главная мысль'), accent: true },
    { label: '🖼️', title: 'Вставить картинку', run: () => setShowImageModal(true) },
  ]

  return (
    <div className="html-editor">
      <div className="html-editor__pane">
        <div className="html-editor__toolbar" role="toolbar" aria-label="Форматирование">
          {buttons.map((b) => (
            <button
              key={b.title}
              type="button"
              title={b.title}
              className={`html-editor__btn${b.accent ? ' html-editor__btn--accent' : ''}`}
              onClick={b.run}
            >
              {b.label}
            </button>
          ))}
        </div>
        <textarea
          ref={textareaRef}
          id={id}
          className="html-editor__textarea"
          value={value}
          onChange={(e) => onChange(e.target.value)}
          placeholder={placeholder}
          rows={rows}
          spellCheck
        />
      </div>

      <div className="html-editor__pane">
        <div className="html-editor__preview-label">Предпросмотр</div>
        {/* Текст пишет только администратор, поэтому HTML показываем как есть. */}
        <div className="html-editor__preview rich-text" dangerouslySetInnerHTML={{ __html: value }} />
      </div>

      {showImageModal && <ImageUploadModal onInsert={insert} onClose={() => setShowImageModal(false)} />}
    </div>
  )
}
