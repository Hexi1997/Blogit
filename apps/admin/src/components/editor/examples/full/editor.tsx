import 'prosekit/basic/style.css'
import 'prosekit/basic/typography.css'

import { createEditor } from 'prosekit/core'
import type { Uploader } from 'prosekit/extensions/file'
import { ProseKit } from 'prosekit/react'
import { useCallback, useEffect, useMemo, useRef } from 'react'
import { defaultMarkdownParser } from 'prosemirror-markdown'
import { ListDOMSerializer } from 'prosemirror-flat-list'
import TurndownService from 'turndown'
import { gfm } from 'turndown-plugin-gfm'

import type { PendingImage } from '@/types'
import { sampleContent } from '../../sample/sample-doc-full'
import { tags } from '../../sample/sample-tag-data'
import { users } from '../../sample/sample-user-data'
import { BlockHandle } from '../../ui/block-handle'
import { DropIndicator } from '../../ui/drop-indicator'
import { InlineMenu } from '../../ui/inline-menu'
import { SlashMenu } from '../../ui/slash-menu'
import { TableHandle } from '../../ui/table-handle'
import { TagMenu } from '../../ui/tag-menu'
import { Toolbar } from '../../ui/toolbar'
import { UserMenu } from '../../ui/user-menu'

import { defineExtension } from './extension'

interface EditorProps {
  content?: string
  onChange?: (markdown: string) => void
  onImageAdd?: (image: PendingImage) => void
}

let imageIdCounter = 0
const INVISIBLE_WHITESPACE_RE = /\s|\u00A0|\u200B|\u200C|\u200D|\u2060|\uFEFF/g

function escapeMarkdownTableCell(value: string) {
  return value.replace(/\|/g, '\\|')
}

function normalizeTableCellMarkdown(value: string) {
  const normalized = value
    .replace(/\r?\n/g, ' ')
    .replace(/\s+/g, ' ')
    .trim()
  return normalized.length > 0 ? escapeMarkdownTableCell(normalized) : ' '
}

function installMarkdownTableRule(service: TurndownService) {
  service.addRule('gfm-table', {
    filter: 'table',
    replacement: (_, node) => {
      const table = node as HTMLTableElement
      const rows = Array.from(table.querySelectorAll('tr')).map((row) => {
        const cells = Array.from(row.children).filter((child) => {
          const tag = child.tagName.toLowerCase()
          return tag === 'th' || tag === 'td'
        })
        return cells.map((cell) => {
          const html = (cell as HTMLElement).innerHTML
          const markdown = service.turndown(html)
          return normalizeTableCellMarkdown(markdown)
        })
      }).filter((row) => row.length > 0)

      if (rows.length === 0) return '\n\n'

      const columnCount = Math.max(1, ...rows.map((row) => row.length))
      const normalizeRow = (row: string[]) => {
        const next = row.slice(0, columnCount)
        while (next.length < columnCount) next.push(' ')
        return `| ${next.join(' | ')} |`
      }

      const header = normalizeRow(rows[0])
      const separator = `| ${Array(columnCount).fill('---').join(' | ')} |`
      const body = rows.slice(1).map(normalizeRow)
      const tableMarkdown = [header, separator, ...body].join('\n')
      return `\n\n${tableMarkdown}\n\n`
    },
  })
}

function installStrikethroughRule(service: TurndownService) {
  service.addRule('strikethrough', {
    filter: ['del', 's'],
    replacement: (content) => `~~${content}~~`,
  })
}

const markdownTokenizer = defaultMarkdownParser.tokenizer
markdownTokenizer.enable('table')
markdownTokenizer.enable('strikethrough')

function isIgnorableLeadingParagraph(doc: { childCount: number; firstChild: { type: { name: string }; childCount: number; child: (i: number) => { type: { name: string }; isText?: boolean; text?: string | null } } | null }) {
  const first = doc.firstChild
  if (!first) return false
  if (doc.childCount <= 1) return false
  if (first.type.name !== 'paragraph') return false
  if (first.childCount === 0) return true

  for (let i = 0; i < first.childCount; i += 1) {
    const child = first.child(i)
    if (child.type.name === 'hardBreak') continue
    if (child.isText) {
      const normalized = (child.text ?? '').replace(INVISIBLE_WHITESPACE_RE, '')
      if (normalized.length === 0) continue
    }
    return false
  }
  return true
}

function isIgnorableParagraphNode(node: { type: { name: string }; childCount: number; child: (i: number) => { type: { name: string }; isText?: boolean; text?: string | null } }) {
  if (node.type.name !== 'paragraph') return false
  if (node.childCount === 0) return true

  for (let i = 0; i < node.childCount; i += 1) {
    const child = node.child(i)
    if (child.type.name === 'hardBreak') continue
    if (child.isText) {
      const normalized = (child.text ?? '').replace(INVISIBLE_WHITESPACE_RE, '')
      if (normalized.length === 0) continue
    }
    return false
  }
  return true
}

export default function ProsekitEditor(props: EditorProps) {
  const { content, onChange, onImageAdd } = props
  const lastEmittedMarkdownRef = useRef<string | null>(null)
  const markdownConverter = useMemo(() => {
    const service = new TurndownService({
      codeBlockStyle: 'fenced',
      bulletListMarker: '-',
      headingStyle: 'atx',
    })
    service.use(gfm)
    installStrikethroughRule(service)
    installMarkdownTableRule(service)
    return service
  }, [])

  const uploader = useCallback<Uploader<string>>(
    async ({ file, onProgress }) => {
      const id = `img_${++imageIdCounter}`
      const ext = file.name.split('.').pop() || 'png'
      const filename = `${id}.${ext}`
      const blobUrl = URL.createObjectURL(file)

      onImageAdd?.({ id, file, blobUrl, filename })
      onProgress({ loaded: file.size, total: file.size })
      return blobUrl
    },
    [onImageAdd],
  )

  const editor = useMemo(() => {
    const extension = defineExtension({
      uploader,
      onDocChange: (view) => {
        if (isIgnorableLeadingParagraph(view.state.doc)) {
          const first = view.state.doc.firstChild
          if (first) {
            view.dispatch(view.state.tr.delete(0, first.nodeSize))
            return
          }
        }

        if (!onChange) return
        const container = document.createElement('div')
        const fragment = ListDOMSerializer.fromSchema(view.state.schema).serializeFragment(
          view.state.doc.content,
          { document },
        )
        container.append(fragment)
        const html = container.innerHTML
        const markdown = markdownConverter.turndown(html).trimEnd()
        lastEmittedMarkdownRef.current = markdown
        onChange(markdown)
      },
    })

    return createEditor({ extension, defaultContent: sampleContent })
  }, [markdownConverter, onChange, uploader])

  const removeLeadingEmptyParagraph = useCallback(() => {
    let { state } = editor.view
    while (isIgnorableLeadingParagraph(state.doc)) {
      const first = state.doc.firstChild
      if (!first) break
      editor.view.dispatch(state.tr.delete(0, first.nodeSize))
      state = editor.view.state
    }
  }, [editor])

  const removeEmptyParagraphBeforeImage = useCallback(() => {
    let changed = false
    let { state } = editor.view

    while (true) {
      let pos = 0
      let removed = false

      for (let i = 0; i < state.doc.childCount - 1; i += 1) {
        const node = state.doc.child(i)
        const next = state.doc.child(i + 1)

        if (isIgnorableParagraphNode(node) && next.type.name === 'image') {
          editor.view.dispatch(state.tr.delete(pos, pos + node.nodeSize))
          state = editor.view.state
          changed = true
          removed = true
          break
        }

        pos += node.nodeSize
      }

      if (!removed) break
    }

    return changed
  }, [editor])

  useEffect(() => {
    const incoming = content ?? ''
    if (incoming === lastEmittedMarkdownRef.current) return

    try {
      // Convert markdown to HTML first, then let Prosekit parse HTML into its own schema.
      const html = markdownTokenizer.render(incoming)
      const container = document.createElement('div')
      container.innerHTML = html

      // markdown-it keeps a trailing newline inside fenced code blocks.
      // Prosekit renders it as an extra blank line in code blocks, so trim one.
      container.querySelectorAll('pre > code').forEach((code) => {
        const text = code.textContent ?? ''
        if (text.endsWith('\n')) {
          code.textContent = text.slice(0, -1)
        }
      })

      editor.setContent(container.innerHTML, 'start')
      removeLeadingEmptyParagraph()
      removeEmptyParagraphBeforeImage()
      lastEmittedMarkdownRef.current = incoming
    } catch {
      editor.setContent(
        incoming.trim()
          ? {
            type: 'doc',
            content: [{ type: 'paragraph', content: [{ type: 'text', text: incoming }] }],
          }
          : { type: 'doc', content: [{ type: 'paragraph' }] },
        'start',
      )
      removeLeadingEmptyParagraph()
      removeEmptyParagraphBeforeImage()
      lastEmittedMarkdownRef.current = incoming
    }
  }, [content, editor, removeLeadingEmptyParagraph, removeEmptyParagraphBeforeImage])

  return (
    <ProseKit editor={editor}>
      <div className="box-border h-full w-full min-h-36 overflow-y-hidden overflow-x-hidden rounded-md border border-solid border-gray-200 dark:border-gray-700 shadow-sm flex flex-col bg-white dark:bg-gray-950 text-black dark:text-white [&_code]:font-geist-mono [&_.ProseMirror_img]:!w-full">
        <Toolbar uploader={uploader} />
        <div className="relative w-full flex-1 box-border overflow-y-auto">
          <div ref={editor.mount} className="ProseMirror box-border min-h-full px-[max(4rem,calc(50%-20rem))] py-8 outline-hidden outline-0 [&_span[data-mention=user]]:text-blue-500 [&_span[data-mention=tag]]:text-violet-500 [&_td]:text-left [&_th]:text-left [&_tr:first-child>td]:bg-gray-100 dark:[&_tr:first-child>td]:bg-gray-800 [&_tr:first-child>th]:bg-gray-100 dark:[&_tr:first-child>th]:bg-gray-800"></div>
          <InlineMenu />
          <SlashMenu />
          <UserMenu users={users} />
          <TagMenu tags={tags} />
          <BlockHandle />
          <TableHandle />
          <DropIndicator />
        </div>
      </div>
    </ProseKit>
  )
}
