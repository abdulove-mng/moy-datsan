// Временная страница-заглушка: показывает, какой раздел здесь будет и на каком этапе.
interface StubPageProps {
  emoji: string
  title: string
  subtitle: string
}

export default function StubPage({ emoji, title, subtitle }: StubPageProps) {
  return (
    <section className="page">
      <div className="page__placeholder">
        <span className="page__emoji">{emoji}</span>
      </div>
      <h1 className="page__title">{title}</h1>
      <p className="page__subtitle">{subtitle}</p>
    </section>
  )
}
