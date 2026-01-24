// Utility functions to process and format text from language model responses

export const processLearningPathText = (text) => {
  if (!text) return '';
  
  // Process markdown formatting
  let processed = text;
  
  // Convert headings - improve regex to be more strict
  processed = processed.replace(/^#{3,6}\s+(.*?)$/gm, '<h4>$1</h4>');  // h4-h6
  processed = processed.replace(/^##\s+(.*?)$/gm, '<h3>$1</h3>');      // h2
  processed = processed.replace(/^#\s+(.*?)$/gm, '<h2>$1</h2>');       // h1
  
  // Convert any remaining heading markers that weren't at line start
  processed = processed.replace(/#{1,6}\s+(.*?)$/gm, '$1');
  
  // Convert bold and italic
  processed = processed.replace(/\*\*(.*?)\*\*/g, '<strong>$1</strong>');
  processed = processed.replace(/\*(.*?)\*/g, '<em>$1</em>');
  processed = processed.replace(/__(.*?)__/g, '<strong>$1</strong>');
  processed = processed.replace(/_(.*?)_/g, '<em>$1</em>');
  
  // Convert code blocks
  processed = processed.replace(/```([a-z]*)\n([\s\S]*?)\n```/gm, (match, language, code) => {
    return `<pre><code class="language-${language || 'plaintext'}">${code.trim()}</code></pre>`;
  });
  
  // Convert inline code
  processed = processed.replace(/`([^`]+)`/g, '<code>$1</code>');
  
  // Convert lists
  processed = processed.replace(/^\s*-\s+(.*?)$/gm, '<li>$1</li>');
  processed = processed.replace(/^\s*\*\s+(.*?)$/gm, '<li>$1</li>');
  processed = processed.replace(/^\s*(\d+)\.\s+(.*?)$/gm, '<li>$2</li>');
  
  // Group list items
  processed = processed.replace(/(<li>.*?<\/li>)\s*(<li>)/gs, '$1$2');
  processed = processed.replace(/(<li>.*?<\/li>)(?!\s*<li>)/gs, '<ul>$1</ul>');
  
  // Handle blockquotes
  processed = processed.replace(/^\s*>\s+(.*?)$/gm, '<blockquote>$1</blockquote>');
  processed = processed.replace(/(<blockquote>.*?<\/blockquote>)\s*(<blockquote>)/gs, '$1$2');
  
  // Convert paragraphs (double newlines)
  processed = processed.replace(/\n\n/g, '</p><p>');
  processed = processed.replace(/\n/g, '<br>');
  
  // Simple table support
  processed = processed.replace(/\|(.+)\|/g, (match, content) => {
    const cells = content.split('|').map(cell => cell.trim());
    return `<tr>${cells.map(cell => `<td>${cell}</td>`).join('')}</tr>`;
  });
  processed = processed.replace(/(<tr>.*?<\/tr>)\s*(<tr>)/gs, '$1$2');
  processed = processed.replace(/(<tr>.*?<\/tr>)(?!\s*<tr>)/gs, '<table>$1</table>');
  
  // Wrap in paragraph if not already wrapped
  if (!processed.startsWith('<p>') && 
      !processed.startsWith('<h') && 
      !processed.startsWith('<ul>') && 
      !processed.startsWith('<pre>') && 
      !processed.startsWith('<table>') && 
      !processed.startsWith('<blockquote>')) {
    processed = `<p>${processed}</p>`;
  }
  
  return processed;
};

export const processChatResponse = (text) => {
  if (!text) return '';
  
  // Process markdown formatting
  let processed = text;
  
  // Convert headings - improve regex to be more strict
  processed = processed.replace(/^#{3,6}\s+(.*?)$/gm, '<h4>$1</h4>');  // h4-h6
  processed = processed.replace(/^##\s+(.*?)$/gm, '<h3>$1</h3>');      // h2
  processed = processed.replace(/^#\s+(.*?)$/gm, '<h2>$1</h2>');       // h1
  
  // Convert any remaining heading markers that weren't at line start
  processed = processed.replace(/#{1,6}\s+(.*?)$/gm, '$1');
  
  // Convert bold and italic
  processed = processed.replace(/\*\*(.*?)\*\*/g, '<strong>$1</strong>');
  processed = processed.replace(/\*(.*?)\*/g, '<em>$1</em>');
  processed = processed.replace(/__(.*?)__/g, '<strong>$1</strong>');
  processed = processed.replace(/_(.*?)_/g, '<em>$1</em>');
  
  // Convert code blocks
  processed = processed.replace(/```([a-z]*)\n([\s\S]*?)\n```/gm, (match, language, code) => {
    return `<pre><code class="language-${language || 'plaintext'}">${code.trim()}</code></pre>`;
  });
  
  // Convert inline code
  processed = processed.replace(/`([^`]+)`/g, '<code>$1</code>');
  
  // Convert lists
  processed = processed.replace(/^\s*-\s+(.*?)$/gm, '<li>$1</li>');
  processed = processed.replace(/^\s*\*\s+(.*?)$/gm, '<li>$1</li>');
  processed = processed.replace(/^\s*(\d+)\.\s+(.*?)$/gm, '<li>$2</li>');
  
  // Group list items
  processed = processed.replace(/(<li>.*?<\/li>)\s*(<li>)/gs, '$1$2');
  processed = processed.replace(/(<li>.*?<\/li>)(?!\s*<li>)/gs, '<ul>$1</ul>');
  
  // Handle blockquotes
  processed = processed.replace(/^\s*>\s+(.*?)$/gm, '<blockquote>$1</blockquote>');
  processed = processed.replace(/(<blockquote>.*?<\/blockquote>)\s*(<blockquote>)/gs, '$1$2');
  
  // Simple table support
  processed = processed.replace(/\|(.+)\|/g, (match, content) => {
    const cells = content.split('|').map(cell => cell.trim());
    return `<tr>${cells.map(cell => `<td>${cell}</td>`).join('')}</tr>`;
  });
  processed = processed.replace(/(<tr>.*?<\/tr>)\s*(<tr>)/gs, '$1$2');
  processed = processed.replace(/(<tr>.*?<\/tr>)(?!\s*<tr>)/gs, '<table>$1</table>');
  
  // Convert newlines to <br> tags
  processed = processed.replace(/\n\n/g, '</p><p>');
  processed = processed.replace(/\n/g, '<br>');
  
  // Wrap in paragraph if not already wrapped
  if (!processed.startsWith('<p>') && 
      !processed.startsWith('<h') && 
      !processed.startsWith('<ul>') && 
      !processed.startsWith('<pre>') && 
      !processed.startsWith('<table>') && 
      !processed.startsWith('<blockquote>')) {
    processed = `<p>${processed}</p>`;
  }
  
  return processed;
};

// Common processor for both learning path and chat responses
export const processMarkdownText = (text) => {
  if (!text) return '';
  
  // Use the browser's marked library if available, otherwise use our custom processor
  if (typeof window !== 'undefined' && window.marked) {
    return window.marked.parse(text);
  }
  
  // Fallback to our custom processor
  return processChatResponse(text);
};
