import { useEditor, EditorContent } from '@tiptap/react';
import StarterKit from '@tiptap/starter-kit';
import Placeholder from '@tiptap/extension-placeholder';
import { useEffect } from 'react';

interface RichTextEditorProps {
  value: string;
  onChange: (value: string) => void;
  placeholder?: string;
  readOnly?: boolean;
  className?: string;
  minRows?: number; // kept for compatibility, though Tiptap grows automatically
  variant?: 'default' | 'zen';
  style?: React.CSSProperties;
}

const MenuBar = ({ editor, readOnly, variant = 'default' }: { editor: any; readOnly: boolean; variant?: 'default' | 'zen' }) => {
  if (!editor || readOnly) {
    return null;
  }

  const toggleBold = (e: React.MouseEvent) => { e.preventDefault(); editor.chain().focus().toggleBold().run(); };
  const toggleItalic = (e: React.MouseEvent) => { e.preventDefault(); editor.chain().focus().toggleItalic().run(); };
  const toggleBulletList = (e: React.MouseEvent) => { e.preventDefault(); editor.chain().focus().toggleBulletList().run(); };
  const toggleOrderedList = (e: React.MouseEvent) => { e.preventDefault(); editor.chain().focus().toggleOrderedList().run(); };

  const containerClass = variant === 'zen'
    ? 'flex items-center gap-1'
    : 'flex items-center gap-1 p-2 bg-surface-container-high border-b border-outline-variant/10 rounded-t-xl mb-2';

  return (
    <div className={containerClass}>
      <button
        onClick={toggleBold}
        className={`p-1.5 rounded-lg flex items-center justify-center transition-colors ${editor.isActive('bold') ? 'bg-primary/20 text-primary' : 'text-on-surface-variant hover:bg-surface-container-highest hover:text-on-surface'}`}
        title="Bold"
      >
        <span className="material-symbols-outlined text-[18px]">format_bold</span>
      </button>
      <button
        onClick={toggleItalic}
        className={`p-1.5 rounded-lg flex items-center justify-center transition-colors ${editor.isActive('italic') ? 'bg-primary/20 text-primary' : 'text-on-surface-variant hover:bg-surface-container-highest hover:text-on-surface'}`}
        title="Italic"
      >
        <span className="material-symbols-outlined text-[18px]">format_italic</span>
      </button>
      
      <div className="w-px h-4 bg-outline-variant/20 mx-1" />
      
      <button
        onClick={toggleBulletList}
        className={`p-1.5 rounded-lg flex items-center justify-center transition-colors ${editor.isActive('bulletList') ? 'bg-primary/20 text-primary' : 'text-on-surface-variant hover:bg-surface-container-highest hover:text-on-surface'}`}
        title="Bullet List"
      >
        <span className="material-symbols-outlined text-[18px]">format_list_bulleted</span>
      </button>
      <button
        onClick={toggleOrderedList}
        className={`p-1.5 rounded-lg flex items-center justify-center transition-colors ${editor.isActive('orderedList') ? 'bg-primary/20 text-primary' : 'text-on-surface-variant hover:bg-surface-container-highest hover:text-on-surface'}`}
        title="Numbered List"
      >
        <span className="material-symbols-outlined text-[18px]">format_list_numbered</span>
      </button>
    </div>
  );
};

export default function RichTextEditor({ value, onChange, placeholder, readOnly = false, className = '', variant = 'default', style }: RichTextEditorProps) {
  const editor = useEditor({
    extensions: [
      StarterKit,
      Placeholder.configure({
        placeholder: placeholder || 'Write something...',
        emptyEditorClass: 'is-editor-empty',
      }),
    ],
    content: value,
    editable: !readOnly,
    onUpdate: ({ editor }) => {
      // Return HTML to save rich formatting
      onChange(editor.getHTML());
    },
    editorProps: {
      attributes: {
        class: `prose prose-sm max-w-none focus:outline-none min-h-[${readOnly ? 'auto' : '60px'}] text-on-surface-variant font-body leading-relaxed w-full`,
      },
    },
  });

  // Update editable state when readOnly changes
  useEffect(() => {
    if (editor && editor.isEditable === readOnly) {
      editor.setEditable(!readOnly);
    }
  }, [readOnly, editor]);

  // Sync value if it changes from outside
  useEffect(() => {
    if (editor && value !== editor.getHTML()) {
      editor.commands.setContent(value, false);
    }
  }, [value, editor]);

  const containerClass = readOnly 
    ? '' 
    : variant === 'zen'
      ? ''
      : 'border border-outline-variant/20 rounded-xl bg-surface-container/30 focus-within:border-primary/50 focus-within:bg-surface-container-low transition-colors';

  const menuClass = variant === 'zen'
    ? 'fixed bottom-8 left-1/2 -translate-x-1/2 z-50 shadow-2xl border border-outline-variant/30 bg-surface/90 backdrop-blur-md rounded-full px-4 py-2'
    : '';

  return (
    <div className={`rich-text-container ${containerClass} ${className}`} style={style}>
      {variant === 'zen' ? (
        <div className={menuClass}>
          <MenuBar editor={editor} readOnly={readOnly} variant={variant} />
        </div>
      ) : (
        <MenuBar editor={editor} readOnly={readOnly} variant={variant} />
      )}
      <div className={readOnly || variant === 'zen' ? '' : 'p-4 pt-2'}>
        <EditorContent editor={editor} className={readOnly ? 'opacity-80' : ''} />
      </div>
    </div>
  );
}
