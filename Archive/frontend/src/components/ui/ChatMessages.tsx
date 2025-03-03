const ChatMessages = ({ messages }) => {
  return (
    <div className="chat-messages">
      {messages.map((msg, index) => {
        const fileUrl = msg.fileUrl ? msg.fileUrl : null;
        const isImage = fileUrl?.toLowerCase().endsWith(".jpeg") || 
                        fileUrl?.toLowerCase().endsWith(".jpg") || 
                        fileUrl?.toLowerCase().endsWith(".png");

        return (
          <div key={msg._id || index} className="message">
            <p className="message-content">{msg.text}</p>

            {fileUrl && (
              <div className="file-attachment">
                {isImage ? (
                  <img src={fileUrl} alt="Attachment" className="chat-image" />
                ) : (
                  <a href={fileUrl} download className="download-link">
                    Download {fileUrl.split("/").pop()}
                  </a>
                )}
              </div>
            )}
          </div>
        );
      })}
    </div>
  );
};
