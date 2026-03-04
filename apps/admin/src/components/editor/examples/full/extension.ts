import type { DocChangeHandler } from 'prosekit/core'
import {
  defineBaseCommands,
  defineBaseKeymap,
  defineCommands,
  defineDocChangeHandler,
  defineHistory,
  defineKeymap,
  insertNode,
  union,
} from 'prosekit/core'
import type { Uploader } from 'prosekit/extensions/file'
import { defineBlockquote } from 'prosekit/extensions/blockquote'
import { defineBold } from 'prosekit/extensions/bold'
import { defineCode } from 'prosekit/extensions/code'
import { defineCodeBlock } from 'prosekit/extensions/code-block'
import { defineCodeBlockShiki } from 'prosekit/extensions/code-block'
import { defineDoc } from 'prosekit/extensions/doc'
import { defineGapCursor } from 'prosekit/extensions/gap-cursor'
import { defineHardBreak } from 'prosekit/extensions/hard-break'
import { defineHeading } from 'prosekit/extensions/heading'
import { defineHorizontalRule } from 'prosekit/extensions/horizontal-rule'
import { defineImageUploadHandler } from 'prosekit/extensions/image'
import { defineImage } from 'prosekit/extensions/image'
import { defineInputRule } from 'prosekit/extensions/input-rule'
import { defineItalic } from 'prosekit/extensions/italic'
import { defineLink } from 'prosekit/extensions/link'
import {
  defineListPlugins,
  defineListSerializer,
  defineListSpec,
} from 'prosekit/extensions/list'
import { defineModClickPrevention } from 'prosekit/extensions/mod-click-prevention'
import { defineMath } from 'prosekit/extensions/math'
import { defineMention } from 'prosekit/extensions/mention'
import { defineParagraph } from 'prosekit/extensions/paragraph'
import { definePlaceholder } from 'prosekit/extensions/placeholder'
import { defineStrike } from 'prosekit/extensions/strike'
import { defineTable } from 'prosekit/extensions/table'
import { defineText } from 'prosekit/extensions/text'
import { defineVirtualSelection } from 'prosekit/extensions/virtual-selection'
import type { Command } from 'prosekit/pm/state'
import { chainCommands, deleteSelection } from 'prosekit/pm/commands'
import {
  createMoveListCommand,
  createSplitListCommand,
  createToggleListCommand,
  createUnwrapListCommand,
  createWrapInListCommand,
  deleteCommand,
  enterCommand,
  joinCollapsedListBackward,
  joinListUp,
  parseInteger,
  protectCollapsed,
  wrappingListInputRule,
  type ListAttributes,
} from 'prosemirror-flat-list'

import { renderKaTeXMathBlock, renderKaTeXMathInline } from '../../sample/katex'
import { sampleUploader } from '../../sample/sample-uploader'
import { defineCodeBlockView } from '../../ui/code-block-view'
import { defineImageView } from '../../ui/image-view'

interface DefineExtensionOptions {
  uploader?: Uploader<string>
  onDocChange?: DocChangeHandler
}

function isToggleList(attrs?: ListAttributes) {
  return attrs?.kind === 'toggle'
}

function defineRestrictedListCommands() {
  return defineCommands({
    moveList: createMoveListCommand,
    splitList: createSplitListCommand,
    unwrapList: createUnwrapListCommand,
    toggleList: (attrs?: ListAttributes) => {
      if (isToggleList(attrs)) return () => false
      return createToggleListCommand(attrs ?? {})
    },
    wrapInList: (attrs?: ListAttributes) => {
      if (isToggleList(attrs)) return () => false
      return createWrapInListCommand(attrs ?? {})
    },
    insertList: (attrs?: ListAttributes): Command => {
      if (isToggleList(attrs)) return () => false
      return insertNode({ type: 'list', attrs })
    },
  })
}

function defineRestrictedListKeymap() {
  const backspaceCommand = chainCommands(
    protectCollapsed,
    deleteSelection,
    joinListUp,
    joinCollapsedListBackward,
  )
  return defineKeymap({
    Enter: enterCommand,
    Backspace: backspaceCommand,
    Delete: deleteCommand,
  })
}

function defineRestrictedListInputRules() {
  const rules = [
    wrappingListInputRule<ListAttributes>(/^\s?([*-])\s$/, {
      kind: 'bullet',
      collapsed: false,
    }),
    wrappingListInputRule<ListAttributes>(/^\s?(\d+)\.\s$/, ({ match }) => {
      const order = parseInteger(match[1])
      return {
        kind: 'ordered',
        collapsed: false,
        order: order != null && order >= 2 ? order : null,
      }
    }),
    wrappingListInputRule<ListAttributes>(/^\s?\[([\sXx]?)]\s$/, ({ match }) => {
      return {
        kind: 'task',
        checked: ['x', 'X'].includes(match[1]),
        collapsed: false,
      }
    }),
  ]
  return union(
    rules.map(defineInputRule),
  )
}

function defineRestrictedList() {
  return union(
    defineListSpec(),
    defineListPlugins(),
    defineRestrictedListKeymap(),
    defineRestrictedListInputRules(),
    defineRestrictedListCommands(),
    defineListSerializer(),
  )
}

function defineBasicExtensionWithoutUnderline() {
  return union(
    defineDoc(),
    defineText(),
    defineParagraph(),
    defineHeading(),
    defineRestrictedList(),
    defineBlockquote(),
    defineImage(),
    defineHorizontalRule(),
    defineHardBreak(),
    defineTable(),
    defineCodeBlock(),
    defineItalic(),
    defineBold(),
    defineStrike(),
    defineCode(),
    defineLink(),
    defineBaseKeymap(),
    defineBaseCommands(),
    defineHistory(),
    defineGapCursor(),
    defineVirtualSelection(),
    defineModClickPrevention(),
  )
}

export function defineExtension(options: DefineExtensionOptions = {}) {
  const extensions = [
    defineBasicExtensionWithoutUnderline(),
    definePlaceholder({ placeholder: 'Press / for commands...' }),
    defineMention(),
    defineMath({ renderMathBlock: renderKaTeXMathBlock, renderMathInline: renderKaTeXMathInline }),
    defineCodeBlockShiki({
      themes: ['github-light'],
    }),
    defineHorizontalRule(),
    defineCodeBlockView(),
    defineImageView(),
    defineImageUploadHandler({
      uploader: options.uploader ?? sampleUploader,
    }),
  ]

  if (options.onDocChange) {
    extensions.push(defineDocChangeHandler(options.onDocChange))
  }

  return union(extensions)
}

export type EditorExtension = ReturnType<typeof defineExtension>
