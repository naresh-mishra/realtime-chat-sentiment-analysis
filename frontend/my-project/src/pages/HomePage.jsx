// Home page fucntionality
import { useChat } from '../store/UseChatStore'; // Import chat context hook
import Sidebar from "../components/Sidebar"; // Sidebar component with user list
import NoChatSelected from "../components/NoChatSelected"; // Component shown when no chat is selected
import ChatContainer from "../components/ChatContainer"; // Component for active chat messages

const HomePage = () => {
  const {selectedUser } = useChat(); // Get selected user from chat context
  return (
     <div className="h-screen bg-base-200"> {/* Full screen height with background color */}
      <div className="flex items-center justify-center pt-20 px-4"> {/* Center content with padding */}
        <div className="bg-base-100 rounded-lg shadow-cl w-full max-w-6xl h-[calc(100vh-8rem)]"> {/* Container with styling */}
          <div className="flex h-full rounded-lg overflow-hidden"> {/* Flex container to hold sidebar and chat */}
            <Sidebar /> {/* User list/sidebar */}

            {/* Conditionally render NoChatSelected or ChatContainer based on if a user is selected */}
            {!selectedUser ? <NoChatSelected /> : <ChatContainer />}
          </div>
        </div>
      </div>
    </div>
  )
}

export default HomePage
