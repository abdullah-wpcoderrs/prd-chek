import { NextRequest, NextResponse } from 'next/server';
import { JSDOM } from 'jsdom';

export async function POST(request: NextRequest) {
  try {
    const { htmlContent, documentName } = await request.json();

    if (!htmlContent) {
      return NextResponse.json(
        { error: 'HTML content is required' },
        { status: 400 }
      );
    }

    // Convert HTML to Markdown
    const markdown = convertHtmlToMarkdown(htmlContent);

    // Return markdown content
    return NextResponse.json({
      markdown,
      filename: `${documentName || 'document'}.md`
    });

  } catch (error) {
    console.error('Markdown conversion error:', error);
    return NextResponse.json(
      { error: 'Failed to convert to markdown' },
      { status: 500 }
    );
  }
}

function convertHtmlToMarkdown(html: string): string {
  // Parse HTML using JSDOM (server-side DOM parser)
  const dom = new JSDOM(html);
  const doc = dom.window.document;
  
  // Process the body content
  const body = doc.body;
  let markdown = '';

  function processNode(node: Node, indent: string = ''): string {
    let result = '';

    if (node.nodeType === dom.window.Node.TEXT_NODE) {
      const text = node.textContent?.trim() || '';
      if (text) {
        result += text;
      }
      return result;
    }

    if (node.nodeType !== dom.window.Node.ELEMENT_NODE) {
      return result;
    }

    const element = node as HTMLElement;
    const tagName = element.tagName.toLowerCase();

    switch (tagName) {
      case 'h1':
        result += '\n\n# ' + getTextContent(element) + '\n\n';
        break;
      case 'h2':
        result += '\n\n## ' + getTextContent(element) + '\n\n';
        break;
      case 'h3':
        result += '\n\n### ' + getTextContent(element) + '\n\n';
        break;
      case 'h4':
        result += '\n\n#### ' + getTextContent(element) + '\n\n';
        break;
      case 'h5':
        result += '\n\n##### ' + getTextContent(element) + '\n\n';
        break;
      case 'h6':
        result += '\n\n###### ' + getTextContent(element) + '\n\n';
        break;
      case 'p':
        result += '\n\n' + processChildren(element, indent) + '\n\n';
        break;
      case 'br':
        result += '\n';
        break;
      case 'strong':
      case 'b':
        result += '**' + getTextContent(element) + '**';
        break;
      case 'em':
      case 'i':
        result += '*' + getTextContent(element) + '*';
        break;
      case 'code':
        if (element.parentElement?.tagName.toLowerCase() === 'pre') {
          // Already handled by pre tag
          result += getTextContent(element);
        } else {
          result += '`' + getTextContent(element) + '`';
        }
        break;
      case 'pre':
        const codeContent = getTextContent(element);
        result += '\n\n```\n' + codeContent + '\n```\n\n';
        break;
      case 'blockquote':
        const quoteLines = processChildren(element, indent).split('\n');
        result += '\n\n' + quoteLines.map(line => '> ' + line).join('\n') + '\n\n';
        break;
      case 'ul':
        result += '\n';
        Array.from(element.children).forEach((li) => {
          if (li.tagName.toLowerCase() === 'li') {
            result += indent + '- ' + processChildren(li as HTMLElement, indent + '  ').trim() + '\n';
          }
        });
        result += '\n';
        break;
      case 'ol':
        result += '\n';
        Array.from(element.children).forEach((li, index) => {
          if (li.tagName.toLowerCase() === 'li') {
            result += indent + `${index + 1}. ` + processChildren(li as HTMLElement, indent + '   ').trim() + '\n';
          }
        });
        result += '\n';
        break;
      case 'a':
        const href = element.getAttribute('href') || '';
        const linkText = getTextContent(element);
        result += `[${linkText}](${href})`;
        break;
      case 'img':
        const src = element.getAttribute('src') || '';
        const alt = element.getAttribute('alt') || '';
        result += `\n\n![${alt}](${src})\n\n`;
        break;
      case 'hr':
        result += '\n\n---\n\n';
        break;
      case 'table':
        result += '\n\n' + processTable(element) + '\n\n';
        break;
      case 'div':
      case 'section':
      case 'article':
      case 'main':
      case 'header':
      case 'footer':
      case 'nav':
      case 'aside':
        result += processChildren(element, indent);
        break;
      default:
        result += processChildren(element, indent);
        break;
    }

    return result;
  }

  function processChildren(element: HTMLElement, indent: string = ''): string {
    let result = '';
    Array.from(element.childNodes).forEach(child => {
      result += processNode(child, indent);
    });
    return result;
  }

  function getTextContent(element: HTMLElement): string {
    return element.textContent?.trim() || '';
  }

  function processTable(table: HTMLElement): string {
    let result = '';
    const rows = Array.from(table.querySelectorAll('tr'));
    
    if (rows.length === 0) return '';

    // Process header row
    const headerRow = rows[0];
    const headerCells = Array.from(headerRow.querySelectorAll('th, td'));
    const headers = headerCells.map(cell => getTextContent(cell as HTMLElement));
    
    result += '| ' + headers.join(' | ') + ' |\n';
    result += '| ' + headers.map(() => '---').join(' | ') + ' |\n';

    // Process data rows
    for (let i = 1; i < rows.length; i++) {
      const cells = Array.from(rows[i].querySelectorAll('td'));
      const cellContents = cells.map(cell => getTextContent(cell as HTMLElement));
      result += '| ' + cellContents.join(' | ') + ' |\n';
    }

    return result;
  }

  // Process the entire body
  Array.from(body.childNodes).forEach(child => {
    markdown += processNode(child);
  });

  // Clean up excessive newlines
  markdown = markdown.replace(/\n{3,}/g, '\n\n').trim();

  return markdown;
}
