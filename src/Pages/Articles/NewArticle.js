import React, { useState, useRef, useEffect } from "react";
import ReactQuill from "react-quill";
import "react-quill/dist/quill.snow.css";
import "./NewArticle.scss";

function NewArticle() {
  const [title, setTitle] = useState("");
  const [content, setContent] = useState("");
  const [isFullscreen, setIsFullscreen] = useState(false);
  const [quillLoaded, setQuillLoaded] = useState(false);

  const containerRef = useRef(null);
  const titleInputRef = useRef(null);
  const quillRef = useRef(null);

  useEffect(() => {
    if (typeof window !== "undefined") {
      import("quill-image-resize-module-react")
        .then((ImageResize) => {
          if (!quillLoaded) {
            const Quill = ReactQuill.Quill;
            Quill.register("modules/imageResize", ImageResize.default);
            setQuillLoaded(true);
          }
        })
        .catch((err) =>
          console.error("Could not load image resize module", err)
        );
    }
  }, [quillLoaded]);

  useEffect(() => {
    if (quillLoaded && quillRef.current) {
      const quill = quillRef.current.getEditor();
      const Delta = ReactQuill.Quill.import("delta");

      // Lưu trữ định dạng cuối cùng
      let lastFormat = {};

      quill.on("editor-change", (eventName, ...args) => {
        if (eventName === "selection-change") {
          // Lưu định dạng hiện tại mỗi khi selection thay đổi
          const [range] = args;
          if (range) {
            lastFormat = quill.getFormat(range);
          }
        } else if (eventName === "text-change") {
          const [delta, oldContents, source] = args;

          // Chỉ xử lý khi người dùng thực hiện thao tác
          if (source === "user") {
            // Kiểm tra xem có phải là thao tác xuống dòng
            const ops = delta.ops || [];
            const hasNewline = ops.some(
              (op) =>
                op.insert &&
                typeof op.insert === "string" &&
                op.insert.includes("\n")
            );

            if (hasNewline && lastFormat.size) {
              // Lấy vị trí selection hiện tại
              const currentSelection = quill.getSelection();
              if (currentSelection) {
                // Áp dụng lại font size
                setTimeout(() => {
                  quill.formatText(
                    currentSelection.index,
                    0,
                    { size: lastFormat.size },
                    "user"
                  );
                }, 10);
              }
            }
          }
        }
      });
    }
  }, [quillLoaded]);

  useEffect(() => {
    titleInputRef.current?.focus();
  }, []);

  // Handle Quill content changes
  const handleQuillChange = (html) => {
    setContent(html);
  };

  // Handle publish action with validation
  const handlePublish = () => {
    if (!title.trim() || !content.trim()) {
      alert("Vui lòng nhập tiêu đề và nội dung trước khi xuất bản.");
      return;
    }
    console.log("Publishing article...");
    console.log("Title:", title);
    console.log("Content:", content);
    alert("Bài viết đã được đăng! (Kiểm tra console log)");
  };

  // Toggle fullscreen mode and refocus editor
  const toggleFullscreen = () => {
    setIsFullscreen(!isFullscreen);
    setTimeout(() => {
      const editor = quillRef.current?.getEditor();
      if (editor) {
        editor.focus();
      }
    }, 50);
  };

  // Quill modules configuration with image resize
  const modules = {
    toolbar: [
      [{ header: [1, 2, false] }],
      [{ size: ["small", false, "large", "huge"] }],
      ["bold", "italic", "underline", "strike", "blockquote"],
      [{ list: "ordered" }, { list: "bullet" }],
      [{ align: [] }],
      ["link", "image"],
      ["clean"],
    ],
    imageResize: {
      parchment: ReactQuill.Quill.import("parchment"),
      displaySize: true,
      modules: ["Resize", "DisplaySize", "Toolbar"],
      handlers: {
        // Custom handlers if needed
      },
    },
  };

  // Quill formats
  const formats = [
    "header",
    "size",
    "bold",
    "italic",
    "underline",
    "strike",
    "blockquote",
    "list",
    "bullet",
    "align",
    "link",
    "image",
  ];

  return (
    <div
      className={`new-article-container ${isFullscreen ? "fullscreen" : ""}`}
      ref={containerRef}
    >
      <div className="editor-header">
        <div className="editor-branding">
          <div className="logo">✈️</div>
          <h1 className="new-article-title">Travel Article</h1>
        </div>
        <div className="editor-actions">
          <button
            className="action-btn fullscreen-btn"
            onClick={toggleFullscreen}
            title={
              isFullscreen ? "Thoát Toàn màn hình" : "Chế độ Toàn màn hình"
            }
          >
            {isFullscreen ? "Exit Fullscreen" : "Fullscreen"}
          </button>
          <button className="action-btn publish-btn" onClick={handlePublish}>
            Xuất bản
          </button>
        </div>
      </div>

      <div className="write-area">
        <input
          ref={titleInputRef}
          className="article-title-input"
          type="text"
          placeholder="Tiêu đề bài viết của bạn..."
          value={title}
          onChange={(e) => setTitle(e.target.value)}
        />

        {quillLoaded && (
          <ReactQuill
            ref={quillRef}
            value={content}
            onChange={handleQuillChange}
            modules={modules}
            formats={formats}
            placeholder="Bắt đầu viết câu chuyện du lịch của bạn ở đây..."
          />
        )}
      </div>
    </div>
  );
}

export default NewArticle;
