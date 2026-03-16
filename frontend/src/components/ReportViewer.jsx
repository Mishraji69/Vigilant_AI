const ReportViewer = ({ content, title }) => {
  // Simple markdown-like rendering (for a full implementation, use a library like react-markdown)
  const renderContent = (text) => {
    if (!text) return null;

    const lines = text.split('\n');
    const elements = [];
    let currentParagraph = [];
    let inCodeBlock = false;
    let codeBlockContent = [];

    lines.forEach((line, index) => {
      // Code blocks
      if (line.startsWith('```')) {
        if (inCodeBlock) {
          elements.push(
            <pre key={`code-${index}`} className="bg-cyber-dark p-4 rounded border border-cyber-blue/20 overflow-x-auto my-4">
              <code className="text-sm text-cyber-green">{codeBlockContent.join('\n')}</code>
            </pre>
          );
          codeBlockContent = [];
          inCodeBlock = false;
        } else {
          if (currentParagraph.length > 0) {
            elements.push(<p key={`p-${index}`} className="my-2">{currentParagraph.join(' ')}</p>);
            currentParagraph = [];
          }
          inCodeBlock = true;
        }
        return;
      }

      if (inCodeBlock) {
        codeBlockContent.push(line);
        return;
      }

      // Headers
      if (line.startsWith('# ')) {
        if (currentParagraph.length > 0) {
          elements.push(<p key={`p-${index}`} className="my-2">{currentParagraph.join(' ')}</p>);
          currentParagraph = [];
        }
        elements.push(<h1 key={index} className="text-3xl font-bold text-cyber-blue mt-6 mb-4">{line.slice(2)}</h1>);
      } else if (line.startsWith('## ')) {
        if (currentParagraph.length > 0) {
          elements.push(<p key={`p-${index}`} className="my-2">{currentParagraph.join(' ')}</p>);
          currentParagraph = [];
        }
        elements.push(<h2 key={index} className="text-2xl font-bold text-cyber-blue mt-5 mb-3">{line.slice(3)}</h2>);
      } else if (line.startsWith('### ')) {
        if (currentParagraph.length > 0) {
          elements.push(<p key={`p-${index}`} className="my-2">{currentParagraph.join(' ')}</p>);
          currentParagraph = [];
        }
        elements.push(<h3 key={index} className="text-xl font-bold text-cyan-400 mt-4 mb-2">{line.slice(4)}</h3>);
      } else if (line.startsWith('#### ')) {
        if (currentParagraph.length > 0) {
          elements.push(<p key={`p-${index}`} className="my-2">{currentParagraph.join(' ')}</p>);
          currentParagraph = [];
        }
        elements.push(<h4 key={index} className="text-lg font-bold text-gray-300 mt-3 mb-2">{line.slice(5)}</h4>);
      }
      // Lists
      else if (line.match(/^[\-\*]\s/)) {
        if (currentParagraph.length > 0) {
          elements.push(<p key={`p-${index}`} className="my-2">{currentParagraph.join(' ')}</p>);
          currentParagraph = [];
        }
        elements.push(
          <li key={index} className="ml-6 my-1 text-gray-300">
            {line.slice(2)}
          </li>
        );
      }
      // Numbered lists
      else if (line.match(/^\d+\.\s/)) {
        if (currentParagraph.length > 0) {
          elements.push(<p key={`p-${index}`} className="my-2">{currentParagraph.join(' ')}</p>);
          currentParagraph = [];
        }
        const match = line.match(/^\d+\.\s(.+)/);
        elements.push(
          <li key={index} className="ml-6 my-1 text-gray-300 list-decimal">
            {match ? match[1] : line}
          </li>
        );
      }
      // Horizontal rule
      else if (line === '---') {
        if (currentParagraph.length > 0) {
          elements.push(<p key={`p-${index}`} className="my-2">{currentParagraph.join(' ')}</p>);
          currentParagraph = [];
        }
        elements.push(<hr key={index} className="my-6 border-cyber-blue/20" />);
      }
      // Empty line - end paragraph
      else if (line.trim() === '') {
        if (currentParagraph.length > 0) {
          elements.push(<p key={`p-${index}`} className="my-2 text-gray-300">{currentParagraph.join(' ')}</p>);
          currentParagraph = [];
        }
      }
      // Regular text
      else {
        // Handle bold **text**
        let processedLine = line.replace(/\*\*(.+?)\*\*/g, '<strong class="text-white font-bold">$1</strong>');
        // Handle inline code `code`
        processedLine = processedLine.replace(/`(.+?)`/g, '<code class="bg-cyber-dark px-1 py-0.5 rounded text-cyber-green text-sm">$1</code>');
        
        currentParagraph.push(processedLine);
      }
    });

    if (currentParagraph.length > 0) {
      elements.push(<p key="final-p" className="my-2 text-gray-300" dangerouslySetInnerHTML={{ __html: currentParagraph.join(' ') }} />);
    }

    return elements;
  };

  return (
    <div className="bg-cyber-darker rounded-lg border border-cyber-blue/20">
      {title && (
        <div className="p-4 border-b border-cyber-blue/20 bg-cyber-dark">
          <h2 className="text-xl font-bold text-cyber-blue">{title}</h2>
        </div>
      )}
      <div className="p-6 max-h-[600px] overflow-y-auto scrollbar-thin prose prose-invert max-w-none">
        {renderContent(content)}
      </div>
    </div>
  );
};

export default ReportViewer;
