export default function PageHeader({ titulo, children }) {
  return (
    <div className="page-header">
      <h1>{titulo}</h1>
      {children}
    </div>
  )
}
