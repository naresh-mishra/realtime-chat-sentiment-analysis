import { X } from "lucide-react";
import { useAuth } from "../store/UseAuthStore";
import { useChat } from "../store/UseChatStore";

const ChatHeader = () => {
  // Get selected user and setter from chat store
  const { selectedUser, setSelectedUser } = useChat();
  // Get online users list from auth store
  const { onlineUsers } = useAuth();

  return (
    <div className="p-2.5 border-b border-base-300">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-3">
          {/* User avatar */}
          <div className="avatar">
            <div className="size-10 rounded-full relative">
              <img src={selectedUser.profilePic || "/avatar.png"} alt={selectedUser.fullName} />
            </div>
          </div>

          {/* User name and online status */}
          <div>
            <h3 className="font-medium">{selectedUser.fullName}</h3>
            <p className="text-sm text-base-content/70">
              {onlineUsers.includes(selectedUser._id) ? "Online" : "Offline"}
            </p>
          </div>
        </div>

        {/* Button to deselect user and close chat */}
        <button onClick={() => setSelectedUser(null)}>
          <X />
        </button>
      </div>
    </div>
  );
};
export default ChatHeader;
