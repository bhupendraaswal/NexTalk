import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";

const MarkdownRenderer = ({ content }) => {
  const components = {
    code: ({ inline, className, children, ...props }) => {
      return !inline ? (
        <pre className="bg-gray-800 text-white p-2 rounded-md overflow-x-auto scrollbar-custom">
          <code {...props} className={className}>
            {children}
          </code>
        </pre>
      ) : (
        <code className="bg-gray-200 px-1 rounded" {...props}>
          {children}
        </code>
      );
    },
    ul: (props) => <ul className="list-disc list-inside" {...props} />,
    ol: (props) => <ol className="list-decimal list-inside" {...props} />,
    a: (props) => (
      <a
        {...props}
        className="text-blue-500 hover:underline font-medium"
        target="_blank"
        rel="noopener noreferrer"
      />
    ),
  };

  return (
    <ReactMarkdown remarkPlugins={[remarkGfm]} components={components}>
      {content}
    </ReactMarkdown>
  );
};

export default MarkdownRenderer;
