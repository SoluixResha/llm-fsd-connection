import { useState, useRef } from 'react'

interface FileNode {
  id: string
  name: string
  type: 'research' | 'policy' | 'manual' | 'report' | 'specification' | 'contract'
  size: number
  connections: string[]
  contentSummary: string
  pageCount: number
  x?: number
  y?: number
}

interface Connection {
  source: string
  target: string
  type: 'content_reference' | 'policy_alignment' | 'data_dependency' | 'concept_overlap' | 'contradiction' | 'supplement'
  strength: number
  description: string
  reason: string
  pageNumbers?: string
  confidenceScore: number
}

interface FilterState {
  nodeTypes: string[]
  connectionTypes: string[]
  minConnections: number
  searchTerm: string
}

export default function FileConnections() {
  const [nodes, setNodes] = useState<FileNode[]>([  // eslint-disable-line @typescript-eslint/no-unused-vars
    {
      id: '1',
      name: 'AI Ethics Guidelines.pdf',
      type: 'policy',
      size: 20,
      connections: ['2', '3', '4', '5'],
      contentSummary: 'Comprehensive guidelines for ethical AI development and deployment',
      pageCount: 45,
      x: 400,
      y: 300
    },
    {
      id: '2',
      name: 'Machine Learning Research.pdf',
      type: 'research',
      size: 18,
      connections: ['1', '6', '7'],
      contentSummary: 'Latest research findings on ML algorithms and their implications',
      pageCount: 78,
      x: 200,
      y: 200
    },
    {
      id: '3',
      name: 'Data Privacy Manual.pdf',
      type: 'manual',
      size: 15,
      connections: ['1', '4', '8'],
      contentSummary: 'Step-by-step guide for implementing data privacy measures',
      pageCount: 32,
      x: 600,
      y: 200
    },
    {
      id: '4',
      name: 'Compliance Report Q3.pdf',
      type: 'report',
      size: 12,
      connections: ['1', '3', '5'],
      contentSummary: 'Quarterly compliance assessment and regulatory alignment',
      pageCount: 28,
      x: 300,
      y: 450
    },
    {
      id: '5',
      name: 'Technical Specifications.pdf',
      type: 'specification',
      size: 14,
      connections: ['1', '2', '6'],
      contentSummary: 'Detailed technical requirements for AI system implementation',
      pageCount: 52,
      x: 100,
      y: 350
    },
    {
      id: '6',
      name: 'Research Methodology.pdf',
      type: 'research',
      size: 10,
      connections: ['2', '5', '7'],
      contentSummary: 'Standardized research methods and experimental protocols',
      pageCount: 24,
      x: 700,
      y: 350
    },
    {
      id: '7',
      name: 'Partnership Contract.pdf',
      type: 'contract',
      size: 8,
      connections: ['2', '6', '8'],
      contentSummary: 'Legal framework for AI research collaboration agreements',
      pageCount: 18,
      x: 500,
      y: 450
    },
    {
      id: '8',
      name: 'Security Assessment.pdf',
      type: 'report',
      size: 16,
      connections: ['3', '4', '7'],
      contentSummary: 'Comprehensive security evaluation of AI systems and data handling',
      pageCount: 41,
      x: 400,
      y: 150
    }
  ])

  const [connections, setConnections] = useState<Connection[]>([  // eslint-disable-line @typescript-eslint/no-unused-vars
    { 
      source: '1', target: '2', type: 'policy_alignment', strength: 0.9,
      description: 'Ethics guidelines directly influence ML research methodologies',
      reason: 'Research practices must align with ethical AI principles defined in the guidelines',
      pageNumbers: '12-15, 23-28',
      confidenceScore: 0.92
    },
    { 
      source: '1', target: '3', type: 'content_reference', strength: 0.8,
      description: 'Privacy guidelines referenced throughout data handling procedures',
      reason: 'Data privacy manual incorporates specific ethical frameworks for data protection',
      pageNumbers: '8-12, 19-22',
      confidenceScore: 0.85
    },
    { 
      source: '1', target: '4', type: 'policy_alignment', strength: 0.7,
      description: 'Compliance report validates adherence to ethics guidelines',
      reason: 'Quarterly assessment measures compliance against ethical AI standards',
      pageNumbers: '5-8, 14-17',
      confidenceScore: 0.78
    },
    { 
      source: '2', target: '5', type: 'data_dependency', strength: 0.8,
      description: 'Research findings inform technical implementation requirements',
      reason: 'ML research discoveries directly impact system architecture specifications',
      pageNumbers: '35-42, 58-65',
      confidenceScore: 0.89
    },
    { 
      source: '3', target: '4', type: 'concept_overlap', strength: 0.6,
      description: 'Privacy compliance measures overlap with quarterly assessment metrics',
      reason: 'Both documents address data protection standards and implementation success',
      pageNumbers: '18-21, 25-28',
      confidenceScore: 0.72
    },
    { 
      source: '2', target: '6', type: 'supplement', strength: 0.7,
      description: 'Research methodology document provides procedural framework for ML studies',
      reason: 'Methodology standards complement and enhance research quality assurance',
      pageNumbers: '10-15, 20-24',
      confidenceScore: 0.81
    },
    { 
      source: '5', target: '8', type: 'data_dependency', strength: 0.5,
      description: 'Technical specifications influence security assessment protocols',
      reason: 'System architecture requirements determine specific security evaluation criteria',
      pageNumbers: '28-32, 38-41',
      confidenceScore: 0.68
    },
    { 
      source: '3', target: '8', type: 'policy_alignment', strength: 0.9,
      description: 'Privacy manual and security assessment share data protection frameworks',
      reason: 'Both documents implement similar privacy-by-design principles and security measures',
      pageNumbers: '15-19, 22-26',
      confidenceScore: 0.94
    },
    { 
      source: '6', target: '7', type: 'content_reference', strength: 0.4,
      description: 'Research methodology standards referenced in partnership agreements',
      reason: 'Contract specifies adherence to established research protocols and quality standards',
      pageNumbers: '8-12, 16-18',
      confidenceScore: 0.63
    },
    { 
      source: '4', target: '8', type: 'contradiction', strength: 0.3,
      description: 'Compliance report identifies gaps in security implementation',
      reason: 'Assessment reveals discrepancies between required and actual security measures',
      pageNumbers: '22-25, 31-34',
      confidenceScore: 0.59
    },
    { 
      source: '7', target: '8', type: 'content_reference', strength: 0.6,
      description: 'Partnership contract references security assessment requirements',
      reason: 'Legal agreement mandates specific security evaluation standards for collaboration',
      pageNumbers: '11-14, 16-18',
      confidenceScore: 0.76
    },
    { 
      source: '1', target: '5', type: 'policy_alignment', strength: 0.8,
      description: 'Technical specifications must comply with ethical AI development standards',
      reason: 'System design requirements incorporate ethical principles and responsible AI practices',
      pageNumbers: '20-25, 35-40',
      confidenceScore: 0.87
    }
  ])

  const [filters, setFilters] = useState<FilterState>({
    nodeTypes: ['research', 'policy', 'manual', 'report', 'specification', 'contract'],
    connectionTypes: ['content_reference', 'policy_alignment', 'data_dependency', 'concept_overlap', 'contradiction', 'supplement'],
    minConnections: 0,
    searchTerm: ''
  })

  const [selectedNode, setSelectedNode] = useState<string | null>(null)
  const [viewMode, setViewMode] = useState<'network' | 'hierarchy' | 'force'>('network')
  const [isAnalyzing, setIsAnalyzing] = useState(false)
  const svgRef = useRef<SVGSVGElement>(null)

  const getNodeColor = (type: string) => {
    const colors = {
      research: '#3B82F6', // blue
      policy: '#10B981', // green
      manual: '#F59E0B', // yellow
      report: '#EF4444', // red
      specification: '#8B5CF6', // purple
      contract: '#06B6D4' // cyan
    }
    return colors[type as keyof typeof colors] || '#6B7280'
  }

  const getConnectionColor = (type: string) => {
    const colors = {
      content_reference: '#3B82F6',
      policy_alignment: '#10B981',
      data_dependency: '#F59E0B',
      concept_overlap: '#EF4444',
      contradiction: '#DC2626',
      supplement: '#8B5CF6'
    }
    return colors[type as keyof typeof colors] || '#6B7280'
  }

  const filteredNodes = nodes.filter(node => {
    const matchesType = filters.nodeTypes.includes(node.type)
    const matchesConnections = node.connections.length >= filters.minConnections
    const matchesSearch = filters.searchTerm === '' || 
      node.name.toLowerCase().includes(filters.searchTerm.toLowerCase())
    return matchesType && matchesConnections && matchesSearch
  })

  const filteredConnections = connections.filter(conn => {
    const matchesType = filters.connectionTypes.includes(conn.type)
    const sourceFitsFilter = filteredNodes.some(node => node.id === conn.source)
    const targetFitsFilter = filteredNodes.some(node => node.id === conn.target)
    return matchesType && sourceFitsFilter && targetFitsFilter
  })

  const handleNodeClick = (nodeId: string) => {
    setSelectedNode(selectedNode === nodeId ? null : nodeId)
  }

  const handleAnalyze = () => {
    setIsAnalyzing(true)
    setTimeout(() => {
      setIsAnalyzing(false)
    }, 2000)
  }

  const updateFilter = (key: keyof FilterState, value: string | number | string[]) => {
    setFilters(prev => ({ ...prev, [key]: value }))
  }

  const toggleArrayFilter = (key: 'nodeTypes' | 'connectionTypes', value: string) => {
    setFilters(prev => ({
      ...prev,
      [key]: prev[key].includes(value)
        ? prev[key].filter(item => item !== value)
        : [...prev[key], value]
    }))
  }

  return (
    <div className="flex h-full bg-white dark:bg-gray-900">
      {/* Control Panel */}
      <div className="w-80 bg-gray-50 dark:bg-gray-800 border-r border-gray-200 dark:border-gray-700 p-4 overflow-y-auto">
        <div className="space-y-6">
          {/* Header */}
          <div className="flex items-center justify-between">
            <h2 className="text-lg font-semibold text-gray-800 dark:text-white">
              Document Connections
            </h2>
            <button
              onClick={handleAnalyze}
              disabled={isAnalyzing}
              className="px-3 py-1 bg-blue-500 text-white text-sm rounded-md hover:bg-blue-600 disabled:opacity-50 transition-colors"
            >
              {isAnalyzing ? 'Analyzing...' : 'Analyze'}
            </button>
          </div>

          {/* Search */}
          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
              Search Documents
            </label>
            <input
              type="text"
              value={filters.searchTerm}
              onChange={(e) => updateFilter('searchTerm', e.target.value)}
              placeholder="Filter by document name..."
              className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 dark:bg-gray-700 dark:text-white"
            />
          </div>

          {/* View Mode */}
          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
              View Mode
            </label>
            <div className="flex space-x-2">
              {['network', 'hierarchy', 'force'].map(mode => (
                                 <button
                   key={mode}
                   onClick={() => setViewMode(mode as 'network' | 'hierarchy' | 'force')}
                   className={`px-3 py-1 text-sm rounded-md transition-colors ${
                     viewMode === mode
                       ? 'bg-blue-500 text-white'
                       : 'bg-gray-200 dark:bg-gray-700 text-gray-700 dark:text-gray-300 hover:bg-gray-300 dark:hover:bg-gray-600'
                   }`}
                 >
                   {mode.charAt(0).toUpperCase() + mode.slice(1)}
                 </button>
              ))}
            </div>
          </div>

          {/* Node Types Filter */}
          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
              Document Types
            </label>
            <div className="space-y-2">
              {['research', 'policy', 'manual', 'report', 'specification', 'contract'].map(type => (
                <label key={type} className="flex items-center">
                  <input
                    type="checkbox"
                    checked={filters.nodeTypes.includes(type)}
                    onChange={() => toggleArrayFilter('nodeTypes', type)}
                    className="mr-2 rounded border-gray-300 text-blue-600 focus:ring-blue-500"
                  />
                  <span className="text-sm text-gray-700 dark:text-gray-300 capitalize">
                    {type}
                  </span>
                  <div
                    className="w-3 h-3 rounded-full ml-2"
                    style={{ backgroundColor: getNodeColor(type) }}
                  />
                </label>
              ))}
            </div>
          </div>

          {/* Connection Types Filter */}
          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
              Relationship Types
            </label>
            <div className="space-y-2">
              {['content_reference', 'policy_alignment', 'data_dependency', 'concept_overlap', 'contradiction', 'supplement'].map(type => (
                <label key={type} className="flex items-center">
                  <input
                    type="checkbox"
                    checked={filters.connectionTypes.includes(type)}
                    onChange={() => toggleArrayFilter('connectionTypes', type)}
                    className="mr-2 rounded border-gray-300 text-blue-600 focus:ring-blue-500"
                  />
                  <span className="text-sm text-gray-700 dark:text-gray-300 capitalize">
                    {type.replace('_', ' ')}
                  </span>
                  <div
                    className="w-3 h-3 rounded-full ml-2"
                    style={{ backgroundColor: getConnectionColor(type) }}
                  />
                </label>
              ))}
            </div>
          </div>

          {/* Minimum Connections */}
          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
              Minimum Connections: {filters.minConnections}
            </label>
            <input
              type="range"
              min="0"
              max="5"
              value={filters.minConnections}
              onChange={(e) => updateFilter('minConnections', parseInt(e.target.value))}
              className="w-full"
            />
          </div>

          {/* Statistics */}
          <div className="bg-white dark:bg-gray-700 rounded-lg p-4 border border-gray-200 dark:border-gray-600">
            <h3 className="font-medium text-gray-800 dark:text-white mb-2">Statistics</h3>
            <div className="space-y-1 text-sm text-gray-600 dark:text-gray-300">
              <div>Documents: {filteredNodes.length}</div>
              <div>Relationships: {filteredConnections.length}</div>
              <div>Avg. Relationships: {filteredNodes.length ? (filteredConnections.length / filteredNodes.length).toFixed(1) : 0}</div>
            </div>
          </div>
        </div>
      </div>

      {/* Visualization Area */}
      <div className="flex-1 relative">
        <svg
          ref={svgRef}
          className="w-full h-full"
          viewBox="0 0 800 600"
        >
          {/* Background grid */}
          <defs>
            <pattern id="grid" width="50" height="50" patternUnits="userSpaceOnUse">
              <path d="M 50 0 L 0 0 0 50" fill="none" stroke="#e5e7eb" strokeWidth="1" opacity="0.3"/>
            </pattern>
          </defs>
          <rect width="100%" height="100%" fill="url(#grid)" />

          {/* Connections */}
          {filteredConnections.map((conn, index) => {
            const sourceNode = filteredNodes.find(n => n.id === conn.source)
            const targetNode = filteredNodes.find(n => n.id === conn.target)
            
            if (!sourceNode || !targetNode) return null

            return (
              <g key={index}>
                <line
                  x1={sourceNode.x}
                  y1={sourceNode.y}
                  x2={targetNode.x}
                  y2={targetNode.y}
                  stroke={getConnectionColor(conn.type)}
                  strokeWidth={conn.strength * 3}
                  strokeOpacity={0.6}
                  className="transition-all duration-300 hover:stroke-opacity-100 cursor-pointer"
                >
                  <title>
                    {`${conn.type}: ${conn.description}\nReason: ${conn.reason}${conn.pageNumbers ? `\nPages: ${conn.pageNumbers}` : ''}\nConfidence: ${(conn.confidenceScore * 100).toFixed(1)}%`}
                  </title>
                </line>
                {/* Connection label */}
                <text
                  x={(sourceNode.x! + targetNode.x!) / 2}
                  y={(sourceNode.y! + targetNode.y!) / 2}
                  textAnchor="middle"
                  className="text-xs fill-gray-700 dark:fill-gray-300 pointer-events-none"
                  fontSize="10"
                >
                  {conn.type}
                </text>
              </g>
            )
          })}

          {/* Nodes */}
          {filteredNodes.map((node) => (
            <g key={node.id}>
              <circle
                cx={node.x}
                cy={node.y}
                r={node.size}
                fill={getNodeColor(node.type)}
                stroke={selectedNode === node.id ? '#000' : '#fff'}
                strokeWidth={selectedNode === node.id ? 3 : 2}
                className="cursor-pointer transition-all duration-300 hover:opacity-80"
                onClick={() => handleNodeClick(node.id)}
              />
              <text
                x={node.x}
                y={node.y! + node.size + 15}
                textAnchor="middle"
                className="text-xs fill-gray-800 dark:fill-gray-200 pointer-events-none"
                fontSize="11"
              >
                {node.name}
              </text>
            </g>
          ))}
        </svg>

        {/* Node Details Panel */}
        {selectedNode && (
          <div className="absolute top-4 right-4 bg-white dark:bg-gray-800 rounded-lg shadow-lg border border-gray-200 dark:border-gray-600 p-4 max-w-md max-h-[80vh] overflow-y-auto">
            {(() => {
              const node = filteredNodes.find(n => n.id === selectedNode)
              if (!node) return null
              
              const incomingConnections = filteredConnections.filter(conn => conn.target === node.id)
              const outgoingConnections = filteredConnections.filter(conn => conn.source === node.id)
              
              return (
                <div>
                  <div className="flex items-center justify-between mb-4">
                    <h3 className="font-medium text-gray-800 dark:text-white text-lg">
                      {node.name}
                    </h3>
                    <button
                      onClick={() => setSelectedNode(null)}
                      className="text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-200"
                    >
                      <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                      </svg>
                    </button>
                  </div>
                  
                  {/* Basic Info */}
                  <div className="space-y-3 mb-4">
                    <div className="flex items-center">
                      <span className="text-gray-600 dark:text-gray-400 font-medium">Type:</span>
                      <span className="ml-2 px-2 py-1 bg-gray-100 dark:bg-gray-700 rounded text-xs">
                        {node.type}
                      </span>
                    </div>
                    <div className="flex items-center">
                      <span className="text-gray-600 dark:text-gray-400 font-medium">Pages:</span>
                      <span className="ml-2 font-medium">{node.pageCount}</span>
                    </div>
                    <div className="flex items-center">
                      <span className="text-gray-600 dark:text-gray-400 font-medium">Relationships:</span>
                      <span className="ml-2 font-medium">{node.connections.length}</span>
                    </div>
                    <div className="mt-2">
                      <span className="text-gray-600 dark:text-gray-400 font-medium">Summary:</span>
                      <p className="mt-1 text-sm text-gray-700 dark:text-gray-300">{node.contentSummary}</p>
                    </div>
                  </div>

                  {/* Incoming Connections */}
                  {incomingConnections.length > 0 && (
                    <div className="mb-4">
                      <h4 className="font-medium text-gray-800 dark:text-white mb-2 flex items-center">
                        <svg className="w-4 h-4 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 8l4 4m0 0l-4 4m4-4H3" />
                        </svg>
                        Incoming ({incomingConnections.length})
                      </h4>
                      <div className="space-y-2">
                                                 {incomingConnections.map((conn, index) => {
                           const sourceNode = filteredNodes.find(n => n.id === conn.source)
                           return (
                             <div key={index} className="p-2 bg-gray-50 dark:bg-gray-700 rounded-lg">
                               <div className="flex items-center justify-between mb-1">
                                 <span className="font-medium text-sm text-gray-800 dark:text-gray-200">{sourceNode?.name}</span>
                                 <span className={`px-2 py-1 text-xs rounded-full text-white`} 
                                       style={{ backgroundColor: getConnectionColor(conn.type) }}>
                                   {conn.type}
                                 </span>
                               </div>
                               <p className="text-xs text-gray-600 dark:text-gray-300 mb-1">
                                 {conn.description}
                               </p>
                                                             <p className="text-xs text-gray-500 dark:text-gray-400">
                                <span className="font-medium text-gray-600 dark:text-gray-300">Reason:</span> {conn.reason}
                              </p>
                              {conn.pageNumbers && (
                                <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">
                                  <span className="font-medium text-gray-600 dark:text-gray-300">Pages:</span> {conn.pageNumbers}
                                </p>
                              )}
                              <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">
                                <span className="font-medium text-gray-600 dark:text-gray-300">Confidence:</span> {(conn.confidenceScore * 100).toFixed(1)}%
                              </p>
                             </div>
                           )
                         })}
                      </div>
                    </div>
                  )}

                  {/* Outgoing Connections */}
                  {outgoingConnections.length > 0 && (
                    <div className="mb-4">
                      <h4 className="font-medium text-gray-800 dark:text-white mb-2 flex items-center">
                        <svg className="w-4 h-4 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 16l-4-4m0 0l4-4m-4 4h18" />
                        </svg>
                        Outgoing ({outgoingConnections.length})
                      </h4>
                      <div className="space-y-2">
                                                 {outgoingConnections.map((conn, index) => {
                           const targetNode = filteredNodes.find(n => n.id === conn.target)
                           return (
                             <div key={index} className="p-2 bg-gray-50 dark:bg-gray-700 rounded-lg">
                               <div className="flex items-center justify-between mb-1">
                                 <span className="font-medium text-sm text-gray-800 dark:text-gray-200">{targetNode?.name}</span>
                                 <span className={`px-2 py-1 text-xs rounded-full text-white`} 
                                       style={{ backgroundColor: getConnectionColor(conn.type) }}>
                                   {conn.type}
                                 </span>
                               </div>
                               <p className="text-xs text-gray-600 dark:text-gray-300 mb-1">
                                 {conn.description}
                               </p>
                                                             <p className="text-xs text-gray-500 dark:text-gray-400">
                                <span className="font-medium text-gray-600 dark:text-gray-300">Reason:</span> {conn.reason}
                              </p>
                              {conn.pageNumbers && (
                                <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">
                                  <span className="font-medium text-gray-600 dark:text-gray-300">Pages:</span> {conn.pageNumbers}
                                </p>
                              )}
                              <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">
                                <span className="font-medium text-gray-600 dark:text-gray-300">Confidence:</span> {(conn.confidenceScore * 100).toFixed(1)}%
                              </p>
                             </div>
                           )
                         })}
                      </div>
                    </div>
                  )}

                  {/* No connections message */}
                  {incomingConnections.length === 0 && outgoingConnections.length === 0 && (
                                         <div className="text-center py-4 text-gray-500 dark:text-gray-400">
                       <svg className="w-12 h-12 mx-auto mb-2 opacity-50" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                         <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13.828 10.172a4 4 0 00-5.656 0l-4 4a4 4 0 105.656 5.656l1.102-1.101m-.758-4.899a4 4 0 005.656 0l4-4a4 4 0 00-5.656-5.656l-1.1 1.1" />
                       </svg>
                       <p className="text-sm text-gray-500 dark:text-gray-400">No relationships found</p>
                     </div>
                  )}
                </div>
              )
            })()}
          </div>
        )}

        {/* Loading overlay */}
        {isAnalyzing && (
          <div className="absolute inset-0 bg-black bg-opacity-50 flex items-center justify-center">
            <div className="bg-white dark:bg-gray-800 rounded-lg p-6 flex items-center space-x-3">
              <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-500"></div>
              <span className="text-gray-700 dark:text-gray-300">
                Analyzing document relationships...
              </span>
            </div>
          </div>
        )}
      </div>
    </div>
  )
} 