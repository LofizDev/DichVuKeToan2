import React, { useEffect, useRef, useState } from 'react';
import { Loader2 } from 'lucide-react';

interface EditorJsFieldProps {
  label: string;
  value: string; // HTML string containing hidden JSON data
  onChange: (htmlContent: string) => void;
  placeholder?: string;
}

// Helper to load external scripts dynamically
const loadScript = (url: string): Promise<void> => {
  return new Promise((resolve, reject) => {
    const existing = document.querySelector(`script[src="${url}"]`);
    if (existing) {
      if (existing.getAttribute('data-loaded') === 'true') {
        resolve();
        return;
      }
      existing.addEventListener('load', () => resolve());
      existing.addEventListener('error', (e) => reject(e));
      return;
    }

    const script = document.createElement('script');
    script.src = url;
    script.async = true;
    script.setAttribute('data-loaded', 'false');
    script.onload = () => {
      script.setAttribute('data-loaded', 'true');
      resolve();
    };
    script.onerror = (e) => reject(e);
    document.body.appendChild(script);
  });
};

export const EditorJsField: React.FC<EditorJsFieldProps> = ({
  label,
  value,
  onChange,
  placeholder = 'Nhập nội dung văn bản...'
}) => {
  const holderId = useRef(`editorjs-${Math.random().toString(36).substr(2, 9)}`);
  const editorRef = useRef<any>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Parse HTML value to extract hidden Editor.js JSON data if present
  const getInitialData = (html: string) => {
    try {
      if (!html) return undefined;
      const match = html.match(/<div id="editorjs-data" style="display:\s*none;?">([\s\S]*?)<\/div>/);
      if (match && match[1]) {
        return JSON.parse(decodeURIComponent(match[1]));
      }
    } catch (e) {
      console.error('Failed to parse embedded EditorJS JSON data:', e);
    }
    
    // Fallback if not editorjs format (regular HTML or plain text)
    if (html) {
      return {
        blocks: [
          {
            type: 'paragraph',
            data: {
              text: html.replace(/<[^>]*>/g, '') // strip tags for plain paragraph
            }
          }
        ]
      };
    }
    return undefined;
  };

  useEffect(() => {
    let isMounted = true;

    const initEditor = async () => {
      try {
        // Load EditorJS and its plugins from jsdelivr CDN
        await Promise.all([
          loadScript('https://cdn.jsdelivr.net/npm/@editorjs/editorjs@2.30.2/dist/editor.min.js'),
          loadScript('https://cdn.jsdelivr.net/npm/@editorjs/header@2.8.8/dist/bundle.min.js'),
          loadScript('https://cdn.jsdelivr.net/npm/@editorjs/list@2.1.0/dist/bundle.min.js'),
          loadScript('https://cdn.jsdelivr.net/npm/@editorjs/quote@2.6.0/dist/bundle.min.js'),
          loadScript('https://cdn.jsdelivr.net/npm/@editorjs/table@2.3.0/dist/bundle.min.js'),
          loadScript('https://cdn.jsdelivr.net/npm/editorjs-html@3.4.3/build/edjsHTML.browser.js')
        ]);

        if (!isMounted) return;

        const win = window as any;
        if (!win.EditorJS) {
          throw new Error('EditorJS failed to load from CDN');
        }

        // Setup EditorJS
        const editor = new win.EditorJS({
          holder: holderId.current,
          placeholder: placeholder,
          data: getInitialData(value),
          tools: {
            header: {
              class: win.Header,
              inlineToolbar: ['link', 'bold', 'italic']
            },
            list: {
              class: win.List,
              inlineToolbar: true
            },
            quote: {
              class: win.Quote,
              inlineToolbar: true
            },
            table: {
              class: win.Table,
              inlineToolbar: true
            }
          },
          onChange: async () => {
            try {
              const savedData = await editor.save();
              
              // Parse JSON blocks to HTML using editorjs-html CDN tool
              let htmlContent = '';
              if (win.edjsHTML) {
                const edjsParser = win.edjsHTML();
                const htmlParts = edjsParser.parse(savedData);
                htmlContent = htmlParts.join('\n');
              } else {
                // Basic fallback parser if edjsHTML failed
                htmlContent = savedData.blocks.map((block: any) => {
                  if (block.type === 'paragraph') return `<p>${block.data.text}</p>`;
                  if (block.type === 'header') return `<h${block.data.level}>${block.data.text}</h${block.data.level}>`;
                  return '';
                }).join('\n');
              }

              // Embed JSON data inside a hidden div in the HTML string for editing next time
              const embeddedJson = `<div id="editorjs-data" style="display:none">${encodeURIComponent(JSON.stringify(savedData))}</div>`;
              const finalOutput = `${htmlContent}\n${embeddedJson}`;
              
              onChange(finalOutput);
            } catch (err) {
              console.error('Error saving EditorJS content:', err);
            }
          }
        });

        editorRef.current = editor;
        setLoading(false);
      } catch (err: any) {
        console.error('Failed to initialize Editor.js:', err);
        setError(err.message || 'Không thể tải Editor.js từ CDN');
        setLoading(false);
      }
    };

    initEditor();

    return () => {
      isMounted = false;
      if (editorRef.current && typeof editorRef.current.destroy === 'function') {
        try {
          editorRef.current.destroy();
        } catch (e) {
          console.warn('Error destroying editor instance:', e);
        }
      }
    };
  }, []);

  return (
    <div className="space-y-1.5 text-left">
      <label className="block text-sm font-semibold text-gray-700">{label}</label>
      
      <div className="border border-gray-300 rounded-lg bg-white overflow-hidden min-h-[300px] flex flex-col">
        {loading && (
          <div className="flex-grow flex items-center justify-center p-8 bg-gray-50/50">
            <div className="flex flex-col items-center gap-2 text-gray-500">
              <Loader2 className="w-6 h-6 animate-spin text-[#124c8d]" />
              <span className="text-xs">Đang tải bộ soạn thảo Editor.js...</span>
            </div>
          </div>
        )}

        {error && (
          <div className="flex-grow flex items-center justify-center p-8 bg-red-50 text-red-600 text-sm">
            {error}
          </div>
        )}

        <div 
          id={holderId.current} 
          className={`flex-grow p-6 prose max-w-none text-sm text-gray-800 ${loading || error ? 'hidden' : 'block'}`}
          style={{ minHeight: '260px' }}
        />
      </div>
    </div>
  );
};

export default EditorJsField;
