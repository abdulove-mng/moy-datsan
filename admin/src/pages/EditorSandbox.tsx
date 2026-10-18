import { useState } from 'react'
import HtmlEditor from '../components/HtmlEditor'

// Песочница: попробовать редактор до того, как появятся настоящие разделы.
// Текст никуда не сохраняется.
const SAMPLE = `<h2>Зелёная Тара</h2>
<p>Ногоон Дара Эхэ — бодхисаттва <strong>сострадательной активности</strong>: быстро приходит на помощь.</p>
<p class="mantra">ОМ ТАРЕ ТУТТАРЕ ТУРЕ СОХА</p>
<div class="accent">
  <p>Главная мысль: страх уходит, когда мы помогаем другим.</p>
</div>`

export default function EditorSandbox() {
  const [html, setHtml] = useState(SAMPLE)

  return (
    <>
      <header className="page-header">
        <div>
          <h1 className="page-header__title">🧪 Редактор текста</h1>
          <p className="page-header__subtitle">
            Песочница: попробуйте кнопки и загрузку картинки. Этот текст не сохраняется — тот же редактор будет в
            главах, хуралах, божествах и практиках.
          </p>
        </div>
      </header>
      <HtmlEditor id="sandbox" value={html} onChange={setHtml} />
    </>
  )
}
