const ReportViewer = ({ content, title }) => {
  // Simple markdown-like rendering (for a full implementation, use a library like react-markdown)
  const renderContent = (text) => {
    if (!text) return null;

    // Some report sources include HTML fragments. This lightweight renderer isn't
    // a full HTML renderer; strip tags so users see normal readable text.
    const stripHtml = (s) => (typeof s === 'string' ? s.replace(/<[^>]*>/g, '') : s);

    const lines = text.split('\n');
    const elements = [];
    let currentParagraph = [];
    let inCodeBlock = false;
    let codeBlockContent = [];

    lines.forEach((line, index) => {
      const safeLine = stripHtml(line);
      // Code blocks
      if (safeLine.startsWith('```')) {
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
            elements.push(<p key={`p-${index}`} className="my-2 text-gray-300">{currentParagraph.join(' ')}</p>);
            currentParagraph = [];
          }
          inCodeBlock = true;
        }
        return;
      }

      if (inCodeBlock) {
        codeBlockContent.push(safeLine);
        return;
      }

      // Headers
      if (safeLine.startsWith('# ')) {
        if (currentParagraph.length > 0) {
          elements.push(<p key={`p-${index}`} className="my-2 text-gray-300">{currentParagraph.join(' ')}</p>);
          currentParagraph = [];
        }
        elements.push(<h1 key={index} className="text-3xl font-bold text-cyber-blue mt-6 mb-4">{safeLine.slice(2)}</h1>);
      } else if (safeLine.startsWith('## ')) {
        if (currentParagraph.length > 0) {
          elements.push(<p key={`p-${index}`} className="my-2 text-gray-300">{currentParagraph.join(' ')}</p>);
          currentParagraph = [];
        }
        elements.push(<h2 key={index} className="text-2xl font-bold text-cyber-blue mt-5 mb-3">{safeLine.slice(3)}</h2>);
      } else if (safeLine.startsWith('### ')) {
        if (currentParagraph.length > 0) {
          elements.push(<p key={`p-${index}`} className="my-2 text-gray-300">{currentParagraph.join(' ')}</p>);
          currentParagraph = [];
        }
        elements.push(<h3 key={index} className="text-xl font-bold text-cyan-400 mt-4 mb-2">{safeLine.slice(4)}</h3>);
      } else if (safeLine.startsWith('#### ')) {
        if (currentParagraph.length > 0) {
          elements.push(<p key={`p-${index}`} className="my-2 text-gray-300">{currentParagraph.join(' ')}</p>);
          currentParagraph = [];
        }
        elements.push(<h4 key={index} className="text-lg font-bold text-gray-300 mt-3 mb-2">{safeLine.slice(5)}</h4>);
      }
      // Lists
      else if (safeLine.match(/^[-*]\s/)) {
        if (currentParagraph.length > 0) {
          elements.push(<p key={`p-${index}`} className="my-2 text-gray-300">{currentParagraph.join(' ')}</p>);
          currentParagraph = [];
        }
        elements.push(
          <li key={index} className="ml-6 my-1 text-gray-300">
            {safeLine.slice(2)}
          </li>
        );
      }
      // Numbered lists
      else if (safeLine.match(/^\d+\.\s/)) {
        if (currentParagraph.length > 0) {
          elements.push(<p key={`p-${index}`} className="my-2 text-gray-300">{currentParagraph.join(' ')}</p>);
          currentParagraph = [];
        }
        const match = safeLine.match(/^\d+\.\s(.+)/);
        elements.push(
          <li key={index} className="ml-6 my-1 text-gray-300 list-decimal">
            {match ? match[1] : safeLine}
          </li>
        );
      }
      // Horizontal rule
      else if (safeLine === '---') {
        if (currentParagraph.length > 0) {
          elements.push(<p key={`p-${index}`} className="my-2 text-gray-300">{currentParagraph.join(' ')}</p>);
          currentParagraph = [];
        }
        elements.push(<hr key={index} className="my-6 border-cyber-blue/20" />);
      }
      // Empty line - end paragraph
      else if (safeLine.trim() === '') {
        if (currentParagraph.length > 0) {
          elements.push(<p key={`p-${index}`} className="my-2 text-gray-300">{currentParagraph.join(' ')}</p>);
          currentParagraph = [];
        }
      }
      // Regular text
      else {
        currentParagraph.push(safeLine);
      }
    });

    if (currentParagraph.length > 0) {
      elements.push(<p key="final-p" className="my-2 text-gray-300">{currentParagraph.join(' ')}</p>);
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
