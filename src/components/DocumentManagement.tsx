import { useState, useRef, useEffect } from 'react'

interface FileSystemItem {
  id: string
  name: string
  type: 'file' | 'folder'
  size?: string
  uploadDate: Date
  status?: 'processed' | 'processing' | 'error'
  fileType?: string
  parentId?: string
  children?: FileSystemItem[]
}

interface ContextMenu {
  x: number
  y: number
  target: FileSystemItem | null
  type: 'background' | 'item'
}

interface CreateDialog {
  isOpen: boolean
  type: 'file' | 'folder'
  parentId?: string
}

interface DeleteDialog {
  isOpen: boolean
  item: FileSystemItem | null
}

interface RenameDialog {
  isOpen: boolean
  item: FileSystemItem | null
}

const FILE_TYPES = [
  { value: 'txt', label: 'Text File (.txt)', icon: '📄' },
  { value: 'md', label: 'Markdown (.md)', icon: '📝' },
  { value: 'pdf', label: 'PDF Document (.pdf)', icon: '📕' },
  { value: 'docx', label: 'Word Document (.docx)', icon: '📘' },
  { value: 'xlsx', label: 'Excel Spreadsheet (.xlsx)', icon: '📊' },
  { value: 'json', label: 'JSON File (.json)', icon: '🔧' },
]

export default function DocumentManagement() {
  const [fileSystem, setFileSystem] = useState<FileSystemItem[]>([
    {
      id: '1',
      name: 'Documents',
      type: 'folder',
      uploadDate: new Date('2024-01-15'),
      children: [
        {
          id: '2',
          name: 'API Documentation.pdf',
          type: 'file',
          size: '2.5 MB',
          uploadDate: new Date('2024-01-15'),
          status: 'processed',
          fileType: 'pdf',
          parentId: '1'
        },
        {
          id: '3',
          name: 'User Guides',
          type: 'folder',
          uploadDate: new Date('2024-01-12'),
          parentId: '1',
          children: [
            {
              id: '4',
              name: 'Getting Started.docx',
              type: 'file',
              size: '1.8 MB',
              uploadDate: new Date('2024-01-12'),
              status: 'processed',
              fileType: 'docx',
              parentId: '3'
            }
          ]
        }
      ]
    },
    {
      id: '5',
      name: 'Templates',
      type: 'folder',
      uploadDate: new Date('2024-01-10'),
      children: [
        {
          id: '6',
          name: 'Email Template.txt',
          type: 'file',
          size: '0.5 MB',
          uploadDate: new Date('2024-01-10'),
          status: 'processing',
          fileType: 'txt',
          parentId: '5'
        }
      ]
    }
  ])

  const [contextMenu, setContextMenu] = useState<ContextMenu | null>(null)
  const [createDialog, setCreateDialog] = useState<CreateDialog>({ isOpen: false, type: 'file' })
  const [deleteDialog, setDeleteDialog] = useState<DeleteDialog>({ isOpen: false, item: null })
  const [renameDialog, setRenameDialog] = useState<RenameDialog>({ isOpen: false, item: null })
  const [draggedItem, setDraggedItem] = useState<FileSystemItem | null>(null)
  const [searchTerm, setSearchTerm] = useState('')
  const [newItemName, setNewItemName] = useState('')
  const [selectedFileType, setSelectedFileType] = useState('txt')
  const [renameValue, setRenameValue] = useState('')
  const [currentFolderId, setCurrentFolderId] = useState<string | null>(null)
  const [breadcrumbs, setBreadcrumbs] = useState<Array<{id: string | null, name: string}>>([
    { id: null, name: 'Home' }
  ])

  const containerRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    const handleClickOutside = () => {
      setContextMenu(null)
    }
    
    document.addEventListener('click', handleClickOutside)
    return () => document.removeEventListener('click', handleClickOutside)
  }, [])

  const findAllItems = (items: FileSystemItem[]): FileSystemItem[] => {
    const result: FileSystemItem[] = []
    const traverse = (items: FileSystemItem[]) => {
      items.forEach(item => {
        result.push(item)
        if (item.children) traverse(item.children)
      })
    }
    traverse(items)
    return result
  }

  const findItemById = (id: string): FileSystemItem | null => {
    return findAllItems(fileSystem).find(item => item.id === id) || null
  }

  const getCurrentFolderItems = (): FileSystemItem[] => {
    if (!currentFolderId) {
      // Return root level items
      return fileSystem
    }
    
    const currentFolder = findItemById(currentFolderId)
    return currentFolder?.children || []
  }

  const updateFileSystem = (updater: (items: FileSystemItem[]) => FileSystemItem[]) => {
    setFileSystem(updater(fileSystem))
  }

  const navigateToFolder = (folderId: string | null) => {
    setCurrentFolderId(folderId)
    
    if (folderId === null) {
      setBreadcrumbs([{ id: null, name: 'Home' }])
    } else {
      const folder = findItemById(folderId)
      if (folder) {
        // Build breadcrumb path
        const path: Array<{id: string | null, name: string}> = [{ id: null, name: 'Home' }]
        
        // Find parent chain
        let currentItem = folder
        const parents: FileSystemItem[] = []
        
        while (currentItem && currentItem.parentId) {
          const parent = findItemById(currentItem.parentId)
          if (parent) {
            parents.unshift(parent)
            currentItem = parent
          } else {
            break
          }
        }
        
        parents.forEach(parent => {
          path.push({ id: parent.id, name: parent.name })
        })
        
        path.push({ id: folder.id, name: folder.name })
        setBreadcrumbs(path)
      }
    }
  }

  const handleDoubleClick = (item: FileSystemItem) => {
    if (item.type === 'folder') {
      navigateToFolder(item.id)
    }
  }

  const handleRightClick = (e: React.MouseEvent, item: FileSystemItem | null) => {
    e.preventDefault()
    e.stopPropagation()
    

    
    setContextMenu({
      x: e.clientX,
      y: e.clientY,
      target: item,
      type: item ? 'item' : 'background'
    })
  }

  const handleCreateNew = (type: 'file' | 'folder', parentId?: string) => {
    setCreateDialog({ isOpen: true, type, parentId: parentId || currentFolderId || undefined })
    setContextMenu(null)
  }

  const handleDelete = (item: FileSystemItem) => {
    setDeleteDialog({ isOpen: true, item })
    setContextMenu(null)
  }

  const handleRename = (item: FileSystemItem) => {
    setRenameDialog({ isOpen: true, item })
    setRenameValue(item.name)
    setContextMenu(null)
  }

  const confirmCreate = () => {
    if (!newItemName.trim()) return

    const newItem: FileSystemItem = {
      id: Date.now().toString(),
      name: createDialog.type === 'file' ? `${newItemName}.${selectedFileType}` : newItemName,
      type: createDialog.type,
      uploadDate: new Date(),
      status: createDialog.type === 'file' ? 'processing' : undefined,
      fileType: createDialog.type === 'file' ? selectedFileType : undefined,
      parentId: createDialog.parentId,
      children: createDialog.type === 'folder' ? [] : undefined
    }

    const addToItems = (items: FileSystemItem[]): FileSystemItem[] => {
      if (!createDialog.parentId) {
        return [...items, newItem]
      }
      return items.map(item => {
        if (item.id === createDialog.parentId && item.type === 'folder') {
          return { ...item, children: [...(item.children || []), newItem] }
        }
        if (item.children) {
          return { ...item, children: addToItems(item.children) }
        }
        return item
      })
    }

    updateFileSystem(addToItems)
    setCreateDialog({ isOpen: false, type: 'file' })
    setNewItemName('')
    setSelectedFileType('txt')
  }

  const confirmDelete = () => {
    if (!deleteDialog.item) return

    const removeFromItems = (items: FileSystemItem[]): FileSystemItem[] => {
      return items.filter(item => item.id !== deleteDialog.item!.id).map(item => {
        if (item.children) {
          return { ...item, children: removeFromItems(item.children) }
        }
        return item
      })
    }

    updateFileSystem(removeFromItems)
    setDeleteDialog({ isOpen: false, item: null })
  }

  const confirmRename = () => {
    if (!renameDialog.item || !renameValue.trim()) return

    const renameInItems = (items: FileSystemItem[]): FileSystemItem[] => {
      return items.map(item => {
        if (item.id === renameDialog.item!.id) {
          return { ...item, name: renameValue.trim() }
        }
        if (item.children) {
          return { ...item, children: renameInItems(item.children) }
        }
        return item
      })
    }

    updateFileSystem(renameInItems)
    setRenameDialog({ isOpen: false, item: null })
    setRenameValue('')
  }

  const handleDragStart = (e: React.DragEvent, item: FileSystemItem) => {
    setDraggedItem(item)
    e.dataTransfer.effectAllowed = 'move'
  }

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault()
    e.dataTransfer.dropEffect = 'move'
  }

  const handleDrop = (e: React.DragEvent, targetItem: FileSystemItem | null) => {
    e.preventDefault()
    if (!draggedItem || draggedItem.id === targetItem?.id) return

    const moveItem = (items: FileSystemItem[]): FileSystemItem[] => {
      // Remove item from current location
      const removeItem = (items: FileSystemItem[]): FileSystemItem[] => {
        return items.filter(item => item.id !== draggedItem.id).map(item => {
          if (item.children) {
            return { ...item, children: removeItem(item.children) }
          }
          return item
        })
      }

      // Add item to new location
      const addItem = (items: FileSystemItem[]): FileSystemItem[] => {
        const newParentId = targetItem?.type === 'folder' ? targetItem.id : currentFolderId
        
        if (!newParentId) {
          // Drop to root level
          return [...items, { ...draggedItem, parentId: undefined }]
        }
        
        return items.map(item => {
          if (item.id === newParentId && item.type === 'folder') {
            return { 
              ...item, 
              children: [...(item.children || []), { ...draggedItem, parentId: newParentId }]
            }
          }
          if (item.children) {
            return { ...item, children: addItem(item.children) }
          }
          return item
        })
      }

      return addItem(removeItem(items))
    }

    updateFileSystem(moveItem)
    setDraggedItem(null)
  }

  const getFileIcon = (item: FileSystemItem) => {
    if (item.type === 'folder') {
      return '📁'
    }
    
    switch (item.fileType?.toLowerCase()) {
      case 'pdf': return '📕'
      case 'docx': 
      case 'doc': return '📘'
      case 'txt': return '📄'
      case 'md': return '📝'
      case 'xlsx': 
      case 'xls': return '📊'
      case 'json': return '🔧'
      default: return '📄'
    }
  }

  const getStatusColor = (status: FileSystemItem['status']) => {
    switch (status) {
      case 'processed': return 'text-green-600 bg-green-100 dark:bg-green-900 dark:text-green-300'
      case 'processing': return 'text-yellow-600 bg-yellow-100 dark:bg-yellow-900 dark:text-yellow-300'
      case 'error': return 'text-red-600 bg-red-100 dark:bg-red-900 dark:text-red-300'
      default: return 'text-gray-600 bg-gray-100 dark:bg-gray-900 dark:text-gray-300'
    }
  }

  const renderFileSystemItem = (item: FileSystemItem) => {
    const isVisible = !searchTerm || item.name.toLowerCase().includes(searchTerm.toLowerCase())
    if (!isVisible) return null

    return (
      <div
        key={item.id}
        className={`flex items-center p-3 hover:bg-gray-100 dark:hover:bg-gray-700 cursor-pointer border border-transparent hover:border-blue-500 rounded-lg select-none file-item ${
          draggedItem?.id === item.id ? 'opacity-50' : ''
        }`}
        draggable
        onDragStart={(e) => handleDragStart(e, item)}
        onDragOver={handleDragOver}
        onDrop={(e) => handleDrop(e, item)}
        onContextMenu={(e) => handleRightClick(e, item)}
        onDoubleClick={() => handleDoubleClick(item)}
      >
        <div className="flex items-center space-x-3 flex-1">
          <span className="text-2xl">{getFileIcon(item)}</span>
          <div>
            <div className="text-sm font-medium text-gray-900 dark:text-white">{item.name}</div>
            <div className="text-xs text-gray-500 dark:text-gray-400">
              {item.uploadDate.toLocaleDateString()}
              {item.size && ` • ${item.size}`}
            </div>
          </div>
        </div>
        
        <div className="flex items-center space-x-2">
          {item.status && (
            <span className={`px-2 py-1 text-xs font-medium rounded-full ${getStatusColor(item.status)}`}>
              {item.status}
            </span>
          )}
          {item.type === 'folder' && (
            <span className="text-xs text-gray-500 dark:text-gray-400">
              {item.children?.length || 0} items
            </span>
          )}
        </div>
      </div>
    )
  }

  const currentItems = getCurrentFolderItems()
  const filteredItems = currentItems.filter(item => 
    !searchTerm || item.name.toLowerCase().includes(searchTerm.toLowerCase())
  )

  return (
    <div className="flex flex-col h-full bg-white dark:bg-gray-900" ref={containerRef}>
      {/* Header */}
      <div className="p-6 border-b border-gray-200 dark:border-gray-700">
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between space-y-4 sm:space-y-0">
          <div>
            <h2 className="text-2xl font-bold text-gray-900 dark:text-white">File Explorer</h2>
            <p className="text-gray-500 dark:text-gray-400">Manage your knowledge base files and folders</p>
          </div>
          <div className="flex space-x-2">
            <input
              type="text"
              placeholder="Search files and folders..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 dark:bg-gray-800 dark:text-white"
              aria-label="Search files and folders"
            />
            <button 
              onClick={() => handleCreateNew('folder')}
              className="px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition-colors"
              aria-label="Create new folder"
            >
              📁 New Folder
            </button>
            <button 
              onClick={() => handleCreateNew('file')}
              className="px-4 py-2 bg-green-500 text-white rounded-lg hover:bg-green-600 transition-colors"
              aria-label="Create new file"
            >
              📄 New File
            </button>
          </div>
        </div>
      </div>

      {/* Breadcrumb Navigation */}
      <div className="px-6 py-3 bg-gray-50 dark:bg-gray-800 border-b border-gray-200 dark:border-gray-700">
        <div className="flex items-center space-x-2 text-sm">
          {breadcrumbs.map((crumb, index) => (
            <div key={crumb.id || 'home'} className="flex items-center space-x-2">
              {index > 0 && (
                <svg className="w-4 h-4 text-gray-400 dark:text-gray-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                </svg>
              )}
              <button
                onClick={() => navigateToFolder(crumb.id)}
                className={`hover:text-blue-600 dark:hover:text-blue-400 ${
                  index === breadcrumbs.length - 1 
                    ? 'text-gray-900 dark:text-white font-medium' 
                    : 'text-blue-600 dark:text-blue-400'
                }`}
              >
                {crumb.name}
              </button>
            </div>
          ))}
        </div>
      </div>

      {/* File System */}
      <div 
        className="flex-1 overflow-y-auto p-4"
        onContextMenu={(e) => {
          // Only handle background clicks if the target is the container itself
          if (e.target === e.currentTarget) {
            handleRightClick(e, null)
          }
        }}
        onDragOver={handleDragOver}
        onDrop={(e) => handleDrop(e, null)}
      >
        {filteredItems.length === 0 ? (
          <div className="text-center py-12">
            <span className="text-6xl">📁</span>
            <h3 className="mt-2 text-sm font-medium text-gray-900 dark:text-white">
              {searchTerm ? 'No files or folders found' : 'This folder is empty'}
            </h3>
            <p className="mt-1 text-sm text-gray-500 dark:text-gray-400">
              {searchTerm ? 'Try adjusting your search terms.' : 'Right-click to create new files or folders.'}
            </p>
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
            {filteredItems.map(item => renderFileSystemItem(item))}
          </div>
        )}
      </div>

              {/* Context Menu */}
      {contextMenu && (
        <div
          className="fixed bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-lg shadow-lg py-2 z-50 w-48 animate-scale-in"
          style={{ 
            top: contextMenu.y, 
            left: contextMenu.x,
            animation: 'scaleIn 0.15s ease-out'
          }}
          onClick={(e) => e.stopPropagation()}
        >

          {contextMenu.type === 'background' ? (
            <>
              <button
                onClick={() => handleCreateNew('folder')}
                className="w-full px-4 py-2 text-left hover:bg-gray-100 dark:hover:bg-gray-700 flex items-center space-x-2 text-gray-900 dark:text-white context-menu-button"
              >
                <span>📁</span>
                <span>New Folder</span>
              </button>
              <button
                onClick={() => handleCreateNew('file')}
                className="w-full px-4 py-2 text-left hover:bg-gray-100 dark:hover:bg-gray-700 flex items-center space-x-2 text-gray-900 dark:text-white context-menu-button"
              >
                <span>📄</span>
                <span>New File</span>
              </button>
            </>
          ) : (
            <>
              {/* Show folder-specific options if target is a folder */}
              {contextMenu.target?.type === 'folder' && (
                <>
                  <button
                    onClick={() => handleCreateNew('folder', contextMenu.target?.id)}
                    className="w-full px-4 py-2 text-left hover:bg-gray-100 dark:hover:bg-gray-700 flex items-center space-x-2 text-gray-900 dark:text-white context-menu-button"
                  >
                    <span>📁</span>
                    <span>New Folder</span>
                  </button>
                  <button
                    onClick={() => handleCreateNew('file', contextMenu.target?.id)}
                    className="w-full px-4 py-2 text-left hover:bg-gray-100 dark:hover:bg-gray-700 flex items-center space-x-2 text-gray-900 dark:text-white context-menu-button"
                  >
                    <span>📄</span>
                    <span>New File</span>
                  </button>
                  <div className="border-t border-gray-200 dark:border-gray-700 my-1"></div>
                </>
              )}
              
              {/* Always show rename and delete for any item */}
              <button
                onClick={() => contextMenu.target && handleRename(contextMenu.target)}
                className="w-full px-4 py-2 text-left hover:bg-blue-100 dark:hover:bg-blue-900 text-blue-600 dark:text-blue-400 flex items-center space-x-2 context-menu-button"
              >
                <span>✏️</span>
                <span>Rename</span>
              </button>
              <button
                onClick={() => contextMenu.target && handleDelete(contextMenu.target)}
                className="w-full px-4 py-2 text-left hover:bg-red-100 dark:hover:bg-red-900 text-red-600 dark:text-red-400 flex items-center space-x-2 context-menu-button"
              >
                <span>🗑️</span>
                <span>Delete</span>
              </button>
            </>
          )}
        </div>
      )}

      {/* Create Dialog */}
      {createDialog.isOpen && (
        <div 
          className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50"
          style={{ 
            animation: 'fadeIn 0.2s ease-out' 
          }}
        >
          <div 
            className="bg-white dark:bg-gray-800 rounded-lg p-6 w-96"
            style={{ 
              animation: 'slideUp 0.3s ease-out' 
            }}
          >
            <h3 className="text-lg font-semibold mb-4 text-gray-900 dark:text-white">
              Create New {createDialog.type === 'file' ? 'File' : 'Folder'}
            </h3>
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium mb-1 text-gray-900 dark:text-white">Name</label>
                <input
                  type="text"
                  value={newItemName}
                  onChange={(e) => setNewItemName(e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 dark:bg-gray-700 dark:text-white"
                  placeholder={`Enter ${createDialog.type} name...`}
                  autoFocus
                />
              </div>
              
              {createDialog.type === 'file' && (
                <div>
                  <label className="block text-sm font-medium mb-1 text-gray-900 dark:text-white">File Type</label>
                  <select
                    value={selectedFileType}
                    onChange={(e) => setSelectedFileType(e.target.value)}
                    className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 dark:bg-gray-700 dark:text-white"
                  >
                    {FILE_TYPES.map(type => (
                      <option key={type.value} value={type.value}>
                        {type.icon} {type.label}
                      </option>
                    ))}
                  </select>
                </div>
              )}
            </div>
            
            <div className="flex justify-end space-x-2 mt-6">
              <button
                onClick={() => setCreateDialog({ isOpen: false, type: 'file' })}
                className="px-4 py-2 text-gray-600 dark:text-gray-400 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-lg transition-colors duration-200"
              >
                Cancel
              </button>
              <button
                onClick={confirmCreate}
                disabled={!newItemName.trim()}
                className="px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 disabled:opacity-50 transition-all duration-200"
              >
                Create
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Delete Dialog */}
      {deleteDialog.isOpen && deleteDialog.item && (
        <div 
          className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50"
          style={{ 
            animation: 'fadeIn 0.2s ease-out' 
          }}
        >
          <div 
            className="bg-white dark:bg-gray-800 rounded-lg p-6 w-96"
            style={{ 
              animation: 'slideUp 0.3s ease-out' 
            }}
          >
            <h3 className="text-lg font-semibold mb-4 text-red-600 dark:text-red-400">
              ⚠️ Delete {deleteDialog.item.type === 'file' ? 'File' : 'Folder'}
            </h3>
            <p className="text-gray-700 dark:text-gray-300 mb-4">
              Are you sure you want to delete "<strong className="text-gray-900 dark:text-white">{deleteDialog.item.name}</strong>"?
              {deleteDialog.item.type === 'folder' && ' This will also delete all files and subfolders inside it.'}
            </p>
            <p className="text-sm text-red-500 dark:text-red-400 mb-6">
              This action cannot be undone.
            </p>
            
            <div className="flex justify-end space-x-2">
              <button
                onClick={() => setDeleteDialog({ isOpen: false, item: null })}
                className="px-4 py-2 text-gray-600 dark:text-gray-400 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-lg transition-colors duration-200"
              >
                Cancel
              </button>
              <button
                onClick={confirmDelete}
                className="px-4 py-2 bg-red-500 text-white rounded-lg hover:bg-red-600 transition-all duration-200"
              >
                Delete
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Rename Dialog */}
      {renameDialog.isOpen && renameDialog.item && (
        <div 
          className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50"
          style={{ 
            animation: 'fadeIn 0.2s ease-out' 
          }}
        >
          <div 
            className="bg-white dark:bg-gray-800 rounded-lg p-6 w-96"
            style={{ 
              animation: 'slideUp 0.3s ease-out' 
            }}
          >
            <h3 className="text-lg font-semibold mb-4 text-gray-900 dark:text-white">
              🏷️ Rename {renameDialog.item.type === 'file' ? 'File' : 'Folder'}
            </h3>
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium mb-1 text-gray-900 dark:text-white">New Name</label>
                <input
                  type="text"
                  value={renameValue}
                  onChange={(e) => setRenameValue(e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 dark:bg-gray-700 dark:text-white transition-all duration-200"
                  placeholder="Enter new name..."
                  autoFocus
                  onKeyDown={(e) => {
                    if (e.key === 'Enter') {
                      confirmRename()
                    } else if (e.key === 'Escape') {
                      setRenameDialog({ isOpen: false, item: null })
                      setRenameValue('')
                    }
                  }}
                />
              </div>
            </div>
            
            <div className="flex justify-end space-x-2 mt-6">
              <button
                onClick={() => {
                  setRenameDialog({ isOpen: false, item: null })
                  setRenameValue('')
                }}
                className="px-4 py-2 text-gray-600 dark:text-gray-400 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-lg transition-colors duration-200"
              >
                Cancel
              </button>
              <button
                onClick={confirmRename}
                disabled={!renameValue.trim()}
                className="px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 disabled:opacity-50 transition-all duration-200"
              >
                Rename
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  )
} 