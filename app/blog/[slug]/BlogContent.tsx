'use client'

import { useMemo } from 'react'

interface BlogContentProps {
  content: string
}

export default function BlogContent({ content }: BlogContentProps) {
  const processedContent = useMemo(() => {
    // Split content by double newlines
    const sections = content.trim().split('\n\n')
    
    return sections.map((section, index) => {
      // Handle h2 headers
      if (section.startsWith('## ')) {
        const text = section.replace('## ', '')
        return (
          <h2 
            key={index} 
            className="text-2xl font-bold text-gray-900 mt-8 mb-4"
            dangerouslySetInnerHTML={{ __html: formatInline(text) }}
          />
        )
      }
      
      // Handle h3 headers
      if (section.startsWith('### ')) {
        const text = section.replace('### ', '')
        return (
          <h3 
            key={index} 
            className="text-xl font-semibold text-gray-900 mt-6 mb-3"
            dangerouslySetInnerHTML={{ __html: formatInline(text) }}
          />
        )
      }
      
      // Handle blockquotes
      if (section.startsWith('> ')) {
        const text = section.replace('> ', '')
        return (
          <blockquote 
            key={index}
            className="border-l-4 border-red-500 pl-4 my-6 italic text-gray-700 bg-red-50 py-3 pr-4 rounded-r-lg"
          >
            <div dangerouslySetInnerHTML={{ __html: formatInline(text) }} />
          </blockquote>
        )
      }
      
      // Handle tables (simple detection)
      if (section.includes('|') && section.includes('---')) {
        const lines = section.split('\n').filter(line => line.trim() && !line.includes('---'))
        const headers = lines[0]?.split('|').map(h => h.trim()).filter(Boolean) || []
        const rows = lines.slice(1)
        
        return (
          <div key={index} className="overflow-x-auto my-6">
            <table className="min-w-full border-collapse border border-gray-300">
              <thead>
                <tr className="bg-gray-100">
                  {headers.map((header, i) => (
                    <th key={i} className="border border-gray-300 px-4 py-2 text-left font-semibold">
                      {header}
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {rows.map((row, rowIndex) => {
                  const cells = row.split('|').map(c => c.trim()).filter(Boolean)
                  return (
                    <tr key={rowIndex} className={rowIndex % 2 === 0 ? 'bg-white' : 'bg-gray-50'}>
                      {cells.map((cell, cellIndex) => (
                        <td key={cellIndex} className="border border-gray-300 px-4 py-2">
                          <span dangerouslySetInnerHTML={{ __html: formatInline(cell) }} />
                        </td>
                      ))}
                    </tr>
                  )
                })}
              </tbody>
            </table>
          </div>
        )
      }
      
      // Handle lists
      if (section.startsWith('- ') || section.startsWith('* ')) {
        const items = section.split('\n').filter(line => line.trim().startsWith('- ') || line.trim().startsWith('* '))
        return (
          <ul key={index} className="list-disc list-inside mb-4 ml-4 space-y-2">
            {items.map((item, i) => {
              const text = item.replace(/^[-*] /, '').trim()
              return (
                <li 
                  key={i} 
                  className="text-gray-700"
                  dangerouslySetInnerHTML={{ __html: formatInline(text) }}
                />
              )
            })}
          </ul>
        )
      }
      
      // Handle numbered lists
      if (/^\d+\.\s/.test(section)) {
        const items = section.split('\n').filter(line => /^\d+\.\s/.test(line.trim()))
        return (
          <ol key={index} className="list-decimal list-inside mb-4 ml-4 space-y-2">
            {items.map((item, i) => {
              const text = item.replace(/^\d+\.\s/, '').trim()
              return (
                <li 
                  key={i} 
                  className="text-gray-700"
                  dangerouslySetInnerHTML={{ __html: formatInline(text) }}
                />
              )
            })}
          </ol>
        )
      }
      
      // Regular paragraph
      if (section.trim()) {
        return (
          <p 
            key={index}
            className="mb-4 text-gray-700 leading-relaxed"
            dangerouslySetInnerHTML={{ __html: formatInline(section) }}
          />
        )
      }
      
      return null
    }).filter(Boolean)
  }, [content])

  return <div className="prose prose-lg max-w-none">{processedContent}</div>
}

// Format inline elements (bold, italic)
function formatInline(text: string): string {
  return text
    .replace(/\*\*(.*?)\*\*/g, '<strong>$1</strong>')
    .replace(/\*(.*?)\*/g, '<em>$1</em>')
    .replace(/`(.*?)`/g, '<code class="bg-gray-100 px-1 py-0.5 rounded text-sm">$1</code>')
}