export function Hint(props: { title: string; children: React.ReactNode }) {
  return (
    <div>
      {props.children}
      {props.title}
    </div>
  )
}
