import { AutocompleteItem } from 'prosekit/react/autocomplete'

export default function SlashMenuItem(props: {
  label: string
  kbd?: string
  disabled?: boolean
  onSelect: () => void
}) {
  return (
    <AutocompleteItem
      onSelect={() => {
        if (props.disabled) return
        props.onSelect()
      }}
      className={`relative flex items-center justify-between min-w-32 scroll-my-1 rounded-sm px-3 py-1.5 box-border select-none whitespace-nowrap outline-hidden ${props.disabled ? 'opacity-50 cursor-not-allowed' : 'cursor-default data-focused:bg-gray-100 dark:data-focused:bg-gray-800'}`}
    >
      <span>{props.label}</span>
      {props.kbd && <kbd className="text-xs font-mono text-gray-400 dark:text-gray-500">{props.kbd}</kbd>}
    </AutocompleteItem>
  )
}
