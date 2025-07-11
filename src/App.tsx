import { useState } from 'react'
import ChatInterface from './components/ChatInterface'
import DocumentManagement from './components/DocumentManagement'
import FileConnections from './components/FileConnections'
import Sidebar from './components/Sidebar'

export type ActiveTab = 'chat' | 'documents' | 'connections'

function App() {
  const [activeTab, setActiveTab] = useState<ActiveTab>('chat')
  const [sidebarOpen, setSidebarOpen] = useState(true)

  const getHeaderTitle = () => {
    switch (activeTab) {
      case 'chat':
        return 'Chat Assistant'
      case 'documents':
        return 'Document Management'
      case 'connections':
        return 'File Connections'
      default:
        return 'AI Assistant'
    }
  }

  return (
    <div className="flex h-screen bg-gray-100 dark:bg-gray-900">
      <Sidebar 
        activeTab={activeTab} 
        setActiveTab={setActiveTab}
        isOpen={sidebarOpen}
        setIsOpen={setSidebarOpen}
      />
      
      <div className="flex-1 flex flex-col overflow-hidden">
        <header className="bg-white dark:bg-gray-800 shadow-sm border-b border-gray-200 dark:border-gray-700 p-4">
          <div className="flex items-center justify-between">
            <button
              onClick={() => setSidebarOpen(!sidebarOpen)}
              className="p-2 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-lg transition-colors lg:hidden"
              aria-label="Toggle sidebar navigation"
            >
              <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
              </svg>
            </button>
            <h1 className="text-xl font-semibold text-gray-800 dark:text-white">
              {getHeaderTitle()}
            </h1>
            <div className="w-10" /> {/* Spacer for centering */}
          </div>
        </header>

        <main className="flex-1 overflow-hidden">
          {activeTab === 'chat' && <ChatInterface />}
          {activeTab === 'documents' && <DocumentManagement />}
          {activeTab === 'connections' && <FileConnections />}
        </main>
      </div>
    </div>
  )
}

export default App
