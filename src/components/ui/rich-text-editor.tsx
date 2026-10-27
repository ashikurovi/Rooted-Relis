"use client";

import React, { useRef, useState, useEffect } from 'react';
import { 
  Bold, Italic, Underline, List, ListOrdered, 
  Heading1, Heading2, Quote, Link as LinkIcon 
} from 'lucide-react';

interface RichTextEditorProps {
  id?: string;
  value: string;
  onChange: (value: string) => void;
  placeholder?: string;
  minHeight?: string;
}

export function RichTextEditor({ 
  id,
  value, 
  onChange, 
  placeholder = "Write your content here...",
  minHeight = "400px" 
}: RichTextEditorProps) {
  const editorRef = useRef<HTMLDivElement>(null);
  const [isFocused, setIsFocused] = useState(false);

  // Initialize content on first load if value is provided
  useEffect(() => {
    if (editorRef.current && value && editorRef.current.innerHTML === '') {
      editorRef.current.innerHTML = value;
    }
  }, [value]);

  const handleInput = () => {
    if (editorRef.current) {
      onChange(editorRef.current.innerHTML);
    }
  };

  const execCommand = (command: string, value: string | undefined = undefined) => {
    document.execCommand(command, false, value);
    editorRef.current?.focus();
    handleInput();
  };

  const addLink = () => {
    const url = prompt('Enter link URL:', 'https://');
    if (url) {
      execCommand('createLink', url);
    }
  };

  const handleContainerClick = () => {
    // If the user clicks on the container (e.g. empty space), focus the editor
    if (document.activeElement !== editorRef.current) {
      editorRef.current?.focus();
    }
  };

  const ToolbarButton = ({ onClick, icon: Icon, title }: { onClick: () => void, icon: React.ElementType, title: string }) => (
    <button
      type="button"
      onMouseDown={(e) => {
        // VERY IMPORTANT: Prevent default on mousedown so the contentEditable doesn't lose focus
        e.preventDefault(); 
      }}
      onClick={(e) => {
        e.preventDefault();
        e.stopPropagation();
        onClick();
      }}
      title={title}
      className="p-1.5 text-gray-500 hover:text-gray-900 hover:bg-gray-100 rounded transition-colors dark:text-gray-400 dark:hover:text-gray-100 dark:hover:bg-gray-800"
    >
      <Icon className="w-4 h-4" />
    </button>
  );

  return (
    <div 
      className={`w-full border rounded-md overflow-hidden transition-colors cursor-text ${
        isFocused 
          ? "border-gray-400 ring-1 ring-gray-400 dark:border-gray-500 dark:ring-gray-500" 
          : "border-gray-300 dark:border-gray-700"
      }`}
      onClick={handleContainerClick}
    >
      {/* Toolbar */}
      <div 
        className="flex flex-wrap items-center gap-1 border-b p-1.5 bg-gray-50 dark:bg-gray-900 dark:border-gray-700 cursor-default"
        onClick={(e) => e.stopPropagation()} // Prevent clicking toolbar from focusing editor unintentionally
      >
        <ToolbarButton onClick={() => execCommand('bold')} icon={Bold} title="Bold" />
        <ToolbarButton onClick={() => execCommand('italic')} icon={Italic} title="Italic" />
        <ToolbarButton onClick={() => execCommand('underline')} icon={Underline} title="Underline" />
        <div className="w-px h-4 bg-gray-300 mx-1 dark:bg-gray-700"></div>
        <ToolbarButton onClick={() => execCommand('formatBlock', 'H1')} icon={Heading1} title="Heading 1" />
        <ToolbarButton onClick={() => execCommand('formatBlock', 'H2')} icon={Heading2} title="Heading 2" />
        <ToolbarButton onClick={() => execCommand('formatBlock', 'BLOCKQUOTE')} icon={Quote} title="Quote" />
        <div className="w-px h-4 bg-gray-300 mx-1 dark:bg-gray-700"></div>
        <ToolbarButton onClick={() => execCommand('insertUnorderedList')} icon={List} title="Bullet List" />
        <ToolbarButton onClick={() => execCommand('insertOrderedList')} icon={ListOrdered} title="Numbered List" />
        <div className="w-px h-4 bg-gray-300 mx-1 dark:bg-gray-700"></div>
        <ToolbarButton onClick={addLink} icon={LinkIcon} title="Insert Link" />
      </div>

      {/* Editor Area */}
      <div 
        id={id}
        ref={editorRef}
        contentEditable
        className="w-full p-4 text-sm focus:outline-none dark:bg-gray-950 prose dark:prose-invert max-w-none"
        style={{ minHeight }}
        onInput={handleInput}
        onFocus={() => setIsFocused(true)}
        onBlur={() => setIsFocused(false)}
        data-placeholder={placeholder}
        suppressContentEditableWarning
      />
      
      {/* Placeholder CSS Injection */}
      <style dangerouslySetInnerHTML={{__html: `
        [contenteditable]:empty:before {
          content: attr(data-placeholder);
          color: #9ca3af;
          pointer-events: none;
          display: block; /* For Firefox */
        }
      `}} />
    </div>
  );
}
