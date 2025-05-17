const MessageSkeleton = () => {
  // Create an array of 6 items as placeholders for loading messages
  const skeletonMessages = Array(6).fill(null);

  return (
    // Container for the skeleton messages with vertical spacing and scroll
    <div className="flex-1 overflow-y-auto p-4 space-y-4">
      {skeletonMessages.map((_, idx) => (
        // Alternate message alignment between left (chat-start) and right (chat-end)
        <div key={idx} className={`chat ${idx % 2 === 0 ? "chat-start" : "chat-end"}`}>
          {/* Skeleton avatar placeholder */}
          <div className="chat-image avatar">
            <div className="size-10 rounded-full">
              <div className="skeleton w-full h-full rounded-full" />
            </div>
          </div>

          {/* Skeleton chat header placeholder */}
          <div className="chat-header mb-1">
            <div className="skeleton h-4 w-16" />
          </div>

          {/* Skeleton chat bubble placeholder */}
          <div className="chat-bubble bg-transparent p-0">
            <div className="skeleton h-16 w-[200px]" />
          </div>
        </div>
      ))}
    </div>
  );
};

export default MessageSkeleton;
