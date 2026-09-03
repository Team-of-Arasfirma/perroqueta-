"use client";

import { useEffect, useRef, useState } from "react";
import {
  AlignCenter,
  AlignJustify,
  AlignLeft,
  AlignRight,
  Bold,
  Code2,
  Eraser,
  Heading1,
  Heading2,
  Heading3,
  ImagePlus,
  Italic,
  Link2,
  List,
  ListOrdered,
  Quote,
  Redo2,
  Strikethrough,
  Underline,
  Undo2,
} from "lucide-react";

const controls = [
  { label: "Bold", icon: Bold, command: "bold" },
  { label: "Italic", icon: Italic, command: "italic" },
  { label: "Underline", icon: Underline, command: "underline" },
  { label: "Strike", icon: Strikethrough, command: "strikeThrough" },

  { label: "H1", icon: Heading1, command: "formatBlock", value: "h1" },
  { label: "H2", icon: Heading2, command: "formatBlock", value: "h2" },
  { label: "H3", icon: Heading3, command: "formatBlock", value: "h3" },

  { label: "Bullets", icon: List, command: "insertUnorderedList" },
  { label: "Numbers", icon: ListOrdered, command: "insertOrderedList" },

  { label: "Quote", icon: Quote, command: "formatBlock", value: "blockquote" },
  { label: "Code", icon: Code2, command: "formatBlock", value: "pre" },

  { label: "Link", icon: Link2, action: "link" },
  { label: "Image", icon: ImagePlus, action: "image" },

  { label: "Left", icon: AlignLeft, command: "justifyLeft" },
  { label: "Center", icon: AlignCenter, command: "justifyCenter" },
  { label: "Right", icon: AlignRight, command: "justifyRight" },
  { label: "Justify", icon: AlignJustify, command: "justifyFull" },

  { label: "Clear", icon: Eraser, command: "removeFormat" },

  { label: "Undo", icon: Undo2, command: "undo" },
  { label: "Redo", icon: Redo2, command: "redo" },
];

const fontSizes = [
  { label: "12", value: "1" },
  { label: "14", value: "2" },
  { label: "16", value: "3" },
  { label: "18", value: "4" },
  { label: "24", value: "5" },
  { label: "32", value: "6" },
  { label: "40", value: "7" },
];

const applyCommand = (editor, command, value = null) => {
  if (!editor) return;

  editor.focus();

  document.execCommand(
    command,
    false,
    value
  );
};

export default function BlogRichTextEditor({
  value,
  onChange,
  placeholder,
}) {
  const editorRef = useRef(null);
  const initializedRef = useRef(false);

  const [fontSize, setFontSize] = useState("3");
  const [textColor, setTextColor] = useState("#252525");
  const [backgroundColor, setBackgroundColor] = useState("#fff3b0");

  // Only initialize editor content once.
  useEffect(() => {
    if (!editorRef.current) return;
    if (initializedRef.current) return;

    editorRef.current.innerHTML = value || "";
    initializedRef.current = true;
  }, [value]);

  // If blog edit record changes completely, refresh content.
  useEffect(() => {
    if (!editorRef.current) return;

    if (
      document.activeElement !== editorRef.current &&
      editorRef.current.innerHTML !== (value || "")
    ) {
      editorRef.current.innerHTML = value || "";
    }
  }, [value]);

  const emitChange = () => {
    if (!editorRef.current) return;

    onChange?.(
      editorRef.current.innerHTML
    );
  };

  const handleCommand = (
    command,
    commandValue = null
  ) => {
    if (!editorRef.current) return;

    applyCommand(
      editorRef.current,
      command,
      commandValue
    );

    emitChange();
  };

  const handleAction = (control) => {
    if (!editorRef.current) return;

    if (control.action === "link") {
      const url = window.prompt("Enter a link URL");

      if (!url?.trim()) return;

      applyCommand(
        editorRef.current,
        "createLink",
        url.trim()
      );

      emitChange();
      return;
    }

    if (control.action === "image") {
      const src = window.prompt("Enter image URL");

      if (!src?.trim()) return;

      const alt =
        window.prompt("Enter image alt text") || "";

      const safeSrc = src
        .trim()
        .replace(/"/g, "&quot;");

      const safeAlt = alt.replace(
        /"/g,
        "&quot;"
      );

      applyCommand(
        editorRef.current,
        "insertHTML",
        `<img src="${safeSrc}" alt="${safeAlt}" />`
      );

      emitChange();
      return;
    }

    applyCommand(
      editorRef.current,
      control.command,
      control.value
    );

    emitChange();
  };

  const handleParagraphStyle = (event) => {
    const selectedValue = event.target.value;

    if (!selectedValue) return;

    handleCommand(
      "formatBlock",
      selectedValue
    );

    event.target.value = "";
  };

  const handleFontSize = (event) => {
    const selectedSize = event.target.value;

    setFontSize(selectedSize);

    handleCommand(
      "fontSize",
      selectedSize
    );
  };

  const handleTextColor = (event) => {
    const color = event.target.value;

    setTextColor(color);

    handleCommand(
      "foreColor",
      color
    );
  };

  const handleBackgroundColor = (event) => {
    const color = event.target.value;

    setBackgroundColor(color);

    handleCommand(
      "hiliteColor",
      color
    );
  };

  return (
    <div className="overflow-hidden rounded-2xl border border-[#DDD7E8] bg-white shadow-[0_4px_18px_rgba(45,25,80,0.04)]">
      {/* Toolbar */}
      <div className="border-b border-[#EEEAF5] bg-[#FBF9FF]">
        <div className="flex flex-wrap items-center gap-2 p-3">
          <select
            defaultValue=""
            onChange={handleParagraphStyle}
            className="h-9 rounded-lg border border-[#E2D8F0] bg-white px-3 text-[12px] font-semibold text-[#5B4A76] outline-none hover:border-[#6030C6] focus:border-[#6030C6]"
          >
            <option value="">Paragraph</option>
            <option value="p">Normal Text</option>
            <option value="h1">Heading 1</option>
            <option value="h2">Heading 2</option>
            <option value="h3">Heading 3</option>
            <option value="h4">Heading 4</option>
          </select>

          <select
            value={fontSize}
            onChange={handleFontSize}
            className="h-9 rounded-lg border border-[#E2D8F0] bg-white px-3 text-[12px] font-semibold text-[#5B4A76] outline-none hover:border-[#6030C6] focus:border-[#6030C6]"
          >
            {fontSizes.map((size) => (
              <option
                key={size.value}
                value={size.value}
              >
                {size.label}px
              </option>
            ))}
          </select>

          <label className="flex h-9 cursor-pointer items-center gap-2 rounded-lg border border-[#E2D8F0] bg-white px-3 text-[12px] font-semibold text-[#5B4A76]">
            <span>A</span>

            <input
              type="color"
              value={textColor}
              onChange={handleTextColor}
              className="h-5 w-5 cursor-pointer border-0 bg-transparent p-0"
            />
          </label>

          <label className="flex h-9 cursor-pointer items-center gap-2 rounded-lg border border-[#E2D8F0] bg-white px-3 text-[12px] font-semibold text-[#5B4A76]">
            <span>BG</span>

            <input
              type="color"
              value={backgroundColor}
              onChange={handleBackgroundColor}
              className="h-5 w-5 cursor-pointer border-0 bg-transparent p-0"
            />
          </label>

          {controls.map((control) => {
            const Icon = control.icon;

            return (
              <button
                key={control.label}
                type="button"
                onMouseDown={(event) =>
                  event.preventDefault()
                }
                onClick={() =>
                  handleAction(control)
                }
                className="inline-flex h-9 items-center justify-center gap-2 rounded-lg border border-[#E2D8F0] bg-white px-2.5 text-[12px] font-semibold text-[#5B4A76] transition hover:border-[#6030C6] hover:bg-[#F7F3FF] hover:text-[#6030C6]"
                title={control.label}
              >
                <Icon className="h-4 w-4" />

                <span className="hidden xl:inline">
                  {control.label}
                </span>
              </button>
            );
          })}
        </div>
      </div>

      {/* Editor */}
      <div className="relative">
        {!value && (
          <span className="pointer-events-none absolute left-5 top-5 text-[15px] text-[#AAA5B3]">
            {placeholder ||
              "Write your blog content here..."}
          </span>
        )}

        <div
          ref={editorRef}
          contentEditable
          suppressContentEditableWarning
          spellCheck
          onInput={emitChange}
          onBlur={emitChange}
          className="
            min-h-[380px]
            max-h-[520px]
            w-full
            overflow-y-auto
            bg-white
            px-5
            py-5
            text-[16px]
            leading-[1.85]
            text-[#333333]
            outline-none

            [&_p]:mb-4

            [&_h1]:mb-4
            [&_h1]:mt-7
            [&_h1]:text-[34px]
            [&_h1]:font-bold
            [&_h1]:leading-[1.15]

            [&_h2]:mb-4
            [&_h2]:mt-7
            [&_h2]:text-[28px]
            [&_h2]:font-bold

            [&_h3]:mb-3
            [&_h3]:mt-6
            [&_h3]:text-[23px]
            [&_h3]:font-bold

            [&_ul]:my-4
            [&_ul]:list-disc
            [&_ul]:pl-7

            [&_ol]:my-4
            [&_ol]:list-decimal
            [&_ol]:pl-7

            [&_a]:text-[#6030C6]
            [&_a]:underline

            [&_blockquote]:my-5
            [&_blockquote]:border-l-4
            [&_blockquote]:border-[#6030C6]
            [&_blockquote]:bg-[#FAF7FF]
            [&_blockquote]:px-5
            [&_blockquote]:py-3

            [&_pre]:my-5
            [&_pre]:overflow-x-auto
            [&_pre]:rounded-xl
            [&_pre]:bg-[#211A2C]
            [&_pre]:p-4
            [&_pre]:text-white

            [&_img]:my-5
            [&_img]:h-auto
            [&_img]:max-w-full
            [&_img]:rounded-xl
          "
        />
      </div>
    </div>
  );
}