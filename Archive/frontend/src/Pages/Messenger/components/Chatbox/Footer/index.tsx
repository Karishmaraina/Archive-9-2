import React, { useRef, useState } from "react";
import EmojiPicker from "emoji-picker-react";
import { BsEmojiSmile, BsSend, BsX } from "react-icons/bs";
import { GrAttachment } from "react-icons/gr";

const Footer = ({ sendMessage }) => {
  const [text, setText] = useState("");
  const [file, setFile] = useState(null);
  const [preview, setPreview] = useState(null);
  const [emojisOpened, setEmojisOpened] = useState(false);
  const fileInputRef = useRef(null);

  const handleFileChange = (event) => {
    const selectedFile = event.target.files[0];
    if (!selectedFile) return;

    // Validate file type
    const allowedTypes = [
      'image/jpeg',
      'image/png',
      'image/jpg',
      'application/pdf',
      'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
      'application/vnd.ms-excel'
    ];

    if (!allowedTypes.includes(selectedFile.type)) {
      alert('Invalid file type. Please select a valid file (JPEG, PNG, PDF, DOCX, XLS).');
      return;
    }

    // Validate file size (5MB max)
    const maxSize = 5 * 1024 * 1024; // 5MB
    if (selectedFile.size > maxSize) {
      alert('File size exceeds 5MB limit. Please choose a smaller file.');
      return;
    }

    setFile(selectedFile);

    // Generate preview for images
    if (selectedFile.type.startsWith('image/')) {
      const reader = new FileReader();
      reader.onload = (e) => setPreview(e.target.result);
      reader.readAsDataURL(selectedFile);
    } else {
      setPreview(null);
    }
  };

  const handleRemoveFile = () => {
    setFile(null);
    setPreview(null);
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
  };

  const handleSend = async () => {
    if (!text.trim() && !file) return;

    try {
      await sendMessage(text, file );
      setText("");
      handleRemoveFile();
    } catch (error) {
      console.error("Error sending message:", error);
      alert("Failed to send message. Please try again.");
    }
  };

  return (
    <div className="flex flex-col gap-2 bg-gray-100 px-2 py-2">
      {(preview || file) && (
        <div className="flex items-center justify-between bg-white p-2 rounded-lg">
          <div className="flex items-center gap-2">
            {preview ? (
              <img 
                src={preview} 
                alt="Preview" 
                className="h-12 w-12 object-cover rounded"
              />
            ) : (
              <div className="h-12 w-12 bg-gray-200 flex items-center justify-center rounded">
                <GrAttachment size={18} />
              </div>
            )}
            <span className="text-sm font-medium truncate max-w-[200px]">
              {file?.name}
            </span>
          </div>
          <button
            onClick={handleRemoveFile}
            className="text-red-500 hover:text-red-600"
          >
            <BsX size={24} />
          </button>
        </div>
      )}

      <div className="flex items-center gap-3">
        <div className="flex items-center gap-4">
          <div className="relative">
            <BsEmojiSmile
              className="cursor-pointer text-gray-500 hover:text-gray-700"
              size={22}
              onClick={() => setEmojisOpened((prev) => !prev)}
            />
            {emojisOpened && (
              <div className="absolute bottom-[48px]">
                <EmojiPicker
                  onEmojiClick={(emoji) => setText((prev) => prev + emoji.emoji)}
                />
              </div>
            )}
          </div>
          <GrAttachment
            className="cursor-pointer text-gray-500 hover:text-gray-700"
            size={22}
            onClick={() => fileInputRef.current?.click()}
          />
          <input
            ref={fileInputRef}
            type="file"
            className="hidden"
            accept=".jpeg,.jpg,.png,.pdf,.docx,.xls"
            multiple
            onChange={handleFileChange}
          />
        </div>

        <input
          type="text"
          placeholder="Type a message"
          className="flex-grow px-4 py-2 text-lg outline-none rounded-xl"
          value={text}
          onChange={(e) => setText(e.target.value)}
          onKeyDown={(e) => e.key === "Enter" && handleSend()}
        />

        <button
          className="bg-[#00a884] text-white rounded-full p-2 hover:bg-[#008069] transition"
          onClick={handleSend}
        >
          <BsSend size={20} />
        </button>
      </div>
    </div>
  );
};

export default Footer;