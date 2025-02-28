const ChatMessages = ({ messages }) => {
    return (
      <div className="chat-messages">
        {messages.map((msg, index) => (
          <div key={index} className="message">
            <p>{msg.text}</p>
            {msg.file && (
              <div>
                {msg.file.endsWith(".jpeg") || msg.file.endsWith(".jpg") || msg.file.endsWith(".png") ? (
                  <img src={`http://localhost:5000${msg.file}`} alt="Attachment" className="chat-image" />
                ) : (
                  <a href={`http://localhost:5000${msg.file}`} download>
                    Download {msg.file.split("/").pop()}
                  </a>
                )}
              </div>
            )}
          </div>
        ))}
      </div>
    );
  };
  