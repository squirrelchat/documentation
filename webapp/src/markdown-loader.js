/*
 * Copyright (c) 2020 Squirrel Chat, All rights reserved.
 *
 * Redistribution and use in source and binary forms, with or without
 * modification, are permitted provided that the following conditions are met:
 *
 * 1. Redistributions of source code must retain the above copyright notice, this
 *    list of conditions and the following disclaimer.
 * 2. Redistributions in binary form must reproduce the above copyright notice,
 *    this list of conditions and the following disclaimer in the
 *    documentation and/or other materials provided with the distribution.
 * 3. Neither the name of the copyright holder nor the names of its contributors
 *    may be used to endorse or promote products derived from this software without
 *    specific prior written permission.
 *
 * THIS SOFTWARE IS PROVIDED BY THE COPYRIGHT HOLDERS AND CONTRIBUTORS "AS IS" AND
 * ANY EXPRESS OR IMPLIED WARRANTIES, INCLUDING, BUT NOT LIMITED TO, THE IMPLIED
 * WARRANTIES OF MERCHANTABILITY AND FITNESS FOR A PARTICULAR PURPOSE ARE
 * DISCLAIMED. IN NO EVENT SHALL THE COPYRIGHT HOLDER OR CONTRIBUTORS BE LIABLE
 * FOR ANY DIRECT, INDIRECT, INCIDENTAL, SPECIAL, EXEMPLARY, OR CONSEQUENTIAL
 * DAMAGES (INCLUDING, BUT NOT LIMITED TO, PROCUREMENT OF SUBSTITUTE GOODS OR
 * SERVICES; LOSS OF USE, DATA, OR PROFITS; OR BUSINESS INTERRUPTION) HOWEVER
 * CAUSED AND ON ANY THEORY OF LIABILITY, WHETHER IN CONTRACT, STRICT LIABILITY,
 * OR TORT (INCLUDING NEGLIGENCE OR OTHERWISE) ARISING IN ANY WAY OUT OF THE USE
 * OF THIS SOFTWARE, EVEN IF ADVISED OF THE POSSIBILITY OF SUCH DAMAGE.
 */

const marked = require('marked')
const shiki = require('shiki')

const rules = [
  [ /(^|\s)(\*\*)([^ *][^*]*)\2/g, ([ , space1,, text ]) => ([ space1, { tag: 'b', children: renderInline(text) } ]) ],
  [ /(^|\s)(__)([^ _][^_]*)\2/g, ([ , space1,, text ]) => ([ space1, { tag: 'u', children: renderInline(text) } ]) ],
  [ /(^|\s)([*_])([^ *_][^*_]*)\2/g, ([ , space1,, text ]) => ([ space1, { tag: 'i', children: renderInline(text) } ]) ],
  [ /(^|\s)(~~)([^~]+)\2/g, ([ , space1,, text ]) => ([ space1, { tag: 'del', children: renderInline(text) } ]) ],
  [ /(^|\s)(`)([^`]+)\2/g, ([ , space1,, text ]) => ([ space1, { tag: 'code', props: { className: 'inlineCode' }, children: renderInline(text) } ]) ],
  [ /!\[([^\]]+)\]\(((?:(?:ftp|https?):\/\/|www\.)?(?:[a-zA-Z0-9-]+\.?)+[^\s<]*)\)/g, ([ , alt, src ]) => ({ tag: 'img', props: { src, alt } }) ],
  [ /\[([^\]]+)\]\(((?:#[\w\d-]+|(?:\/|https?:\/\/)[\w\d./?=#%&-]+))\)/g, ([ , label, link ]) => renderLink(link, label) ],
  [ /((?:(?:ftp|https?):\/\/|www\.)(?:[a-zA-Z0-9-]+\.?)+[^\s<]*)/g, ([ , link ]) => renderLink(link, link) ],
  [ /<br\/?>/g, () => ({ tag: 'br' }) ]
]

function renderInline (content) {
  const react = []
  const matches = []
  for (const rule of rules) {
    for (const match of content.matchAll(rule[0])) {
      matches.push({
        match: [ ...match ],
        replace: rule[1].call(null, [ ...match ]),
        index: match.index,
        length: match[0].length
      })
    }
  }

  let cursor = 0
  matches.sort((a, b) => a.index > b.index ? 1 : a.index < b.index ? -1 : 0).forEach(m => {
    if (m.index - cursor < 0) return
    react.push(content.substring(cursor, m.index))
    react.push(m.replace)
    cursor = m.index + m.length
  })
  react.push(content.substring(cursor))
  return react.filter(Boolean)
}

function renderLink (link, label) {
  if (link.startsWith('/')) {
    return { tag: 'Link', props: { to: link }, children: label }
  }
  return { tag: 'a', props: { href: link }, children: label }
}

function renderHeader (depth, text) {
  const slug = text.toLowerCase().replace(/[^a-z0-9]/g, '-').replace(/-+/g, '-')
  const props = { id: slug, className: 'heading' }
  if (depth === 6) props.className = 'blockHeader'
  return {
    tag: `h${depth}`,
    props,
    children: depth === 1
      ? text
      : [ {
        tag: 'span',
        children: text
      },
      {
        tag: 'a',
        props: { href: `#${slug}`, className: 'anchor' },
        children: [
          { tag: 'Icons.Link', props: { width: '16', height: '16' } }
        ]
      } ]
  }
}

function renderHttp (text) {
  const [ , method, rawPath ] = text.match(/^%% (GET|POST|PUT|PATCH|DELETE|HEAD) ([^\n]+)/)
  const parts = [ { tag: 'span', props: { className: 'method' }, children: method } ]
  for (const m of rawPath.matchAll(/([^{]+)({[^}]+})?/g)) {
    parts.push(m[1])
    if (m[2]) parts.push({ tag: 'span', props: { className: 'param' }, children: m[2] })
  }

  return { tag: 'div', props: { className: 'httpRoute' }, children: parts }
}

function renderList (ordered, items) {
  const parts = []
  items.forEach(item => {
    let str = ''
    item.tokens.forEach(tok => {
      switch (tok.type) {
        case 'text':
          str += `${tok.text}\n`
          break
        case 'list':
          parts.push({ tag: 'li', children: renderInline(str.trim()) })
          str = ''
          parts.push(renderList(tok.ordered, tok.items))
          break
      }
    })
    if (str) parts.push({ tag: 'li', children: renderInline(str.trim()) })
  })
  return { tag: ordered ? 'ol' : 'ul', props: { className: 'list' }, children: parts }
}

function renderTable (header, cells, alignments) {
  return {
    tag: 'table',
    props: { className: 'table' },
    children: [
      {
        tag: 'thead',
        children: [
          {
            tag: 'tr',
            children: header.map(h => ({ tag: 'th', children: renderInline(h) }))
          }
        ]
      },
      {
        tag: 'tbody',
        children: cells.map(cell => ({
          tag: 'tr',
          children: cell.map((c, i) => ({
            tag: 'td',
            props: alignments[i] === 'center' ? { className: 'center' } : null,
            children: renderInline(c)
          }))
        }))
      }
    ]
  }
}

function renderBlockQuote (str) {
  return {
    tag: 'blockquote',
    props: { className: 'quote' },
    children: renderInline(str)
  }
}

function renderNote (type, str) {
  const className = type === 'info' ? 'noteInfo' : type === 'warn' ? 'noteWarning' : 'noteDanger'
  const icon = type === 'info' ? 'Info' : type === 'warn' ? 'Warning' : 'Alert'
  type = type[0].toUpperCase() + type.substring(1)
  return {
    tag: 'div',
    props: { className: [ 'note', className ] },
    children: [
      { tag: `Icons.${icon}`, props: { className: 'icon', width: '32', height: '32' } },
      { tag: 'div', props: { className: 'content' }, children: renderInline(str) }
    ]
  }
}

async function renderCodeblock (language, code) {
  let tokens
  try {
    const highlighter = await shiki.getHighlighter({ theme: 'material-theme-palenight' })
    tokens = highlighter.codeToThemedTokens(code, language)
  } catch (e) {
    tokens = code.split('\n')
  }

  return {
    tag: 'pre',
    props: { className: 'code' },
    children: [
      {
        tag: 'code',
        children: tokens
          .map((line, i) => ({
            tag: 'div',
            props: { className: 'line' },
            children: [
              { tag: 'div', props: { className: 'lineNumber' }, children: (i + 1).toString() },
              {
                tag: 'div',
                children: typeof line === 'string'
                  ? line
                  : line.map(tok => ({
                    tag: 'span',
                    props: { style: `{color:"${tok.color}"}` },
                    children: tok.content
                  }))
              }
            ]
          }))
      }
    ]
  }
}

function treeToCode (tree) {
  return tree.map(node => {
    if (typeof node === 'string') return `"${node.replace(/\n/g, ' ').replace(/"/g, '\\"')}"`
    if (Array.isArray(node)) return treeToCode(node)

    const tag = node.tag[0] === node.tag[0].toUpperCase() ? node.tag : `"${node.tag}"`
    let props = 'null'
    if (node.props) {
      props = `{${Object.entries(node.props)
        .map(([ k, v ]) => {
          if (k === 'className') {
            v = Array.isArray(v) ? v.map(c => `style.${c}`).join('+" "+') : `style.${v}`
          } else if (k !== 'style') {
            v = `"${v.replace(/"/g, '\\"')}"`
          }
          return `${k}:${v}`
        }).join(',')}}`
    }

    const children = node.children ? (typeof node.children === 'string' ? `"${node.children.replace(/\n/g, ' ').replace(/"/g, '\\"')}"` : treeToCode(node.children)) : 'null'
    return `React.createElement(${tag}, ${props}, ${children})`
  }).join(',')
}

function resolveAll (...modules) {
  return Promise.all(modules.map(mod => new Promise(resolve => this.resolve(__dirname, mod, (_, m) => resolve(m)))))
}

module.exports = async function (content) {
  const callback = this.async()
  const [ react, reactRouter ] = await resolveAll.call(this, 'react', 'react-router-dom')
  let code = `const React = require("${react}"); const { Link } = require("${reactRouter}"); const Icons = require("@components/Icons"); const style = require("@styles/markdown.scss");`
  code += 'const Document = () => React.createElement("div", { className: style.container },'

  let title
  const tree = (await Promise.all(
    marked.lexer(content)
      .map(node => {
        switch (node.type) {
          case 'heading':
            if (node.depth === 1) title = node.text
            return renderHeader(node.depth, node.text)
          case 'paragraph':
            return node.text.startsWith('%% ')
              ? renderHttp(node.text)
              : { tag: 'p', props: { className: 'paragraph' }, children: renderInline(node.text) }
          case 'list':
            return renderList(node.ordered, node.items)
          case 'table':
            return renderTable(node.header, node.cells, node.align)
          case 'blockquote': {
            const quoteText = node.text.split('\n').map(s => s.replace(/[ \n]*<br\/?>[ \n]*/ig, '\n'))
            return node.raw.startsWith('> ')
              ? renderBlockQuote(quoteText.join(' '))
              : renderNote(quoteText.shift().toLowerCase(), quoteText.join(' '))
          }
          case 'code':
            return renderCodeblock(node.lang, node.text)
        }
      })
  )).filter(Boolean)

  const slug = title.toLowerCase().replace(/[^a-z0-9]/g, '-').replace(/-+/g, '-')
  code += `${treeToCode(tree)}); Document.displayName = "MarkdownDocument(${title.replace(/ ./g, s => s.substring(1).toUpperCase())})";`
  code += `module.exports = { Document: React.memo(Document), title: "${title}", slug: "${slug}" }`
  callback(null, code)
}
