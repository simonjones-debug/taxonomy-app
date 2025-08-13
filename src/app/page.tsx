'use client'

import { useState, useEffect } from 'react'

interface Page {
  sys: {
    id: string
    createdAt: string
    updatedAt: string
  }
  fields: Record<string, unknown>
}

export default function Home() {
  const [nodeId, setNodeId] = useState('')
  const [pages, setPages] = useState<Page[]>([])
  const [taxonomyNodes, setTaxonomyNodes] = useState<string[]>([])
  const [relatedInput, setRelatedInput] = useState('')
  const [relatedNodes, setRelatedNodes] = useState<string[]>([])
  const [relatedPages, setRelatedPages] = useState<Page[]>([])
  const [selectedRelatedNode, setSelectedRelatedNode] = useState('')

  //fetch taxonomy nodes
  useEffect(() => {
    const loadTaxonomyFromAPI = async () => {
      const response = await fetch('/api/taxonomy')
      const data = await response.json()
      
      if (data.success) {
        setTaxonomyNodes(data.taxonomyNodes)
      }
    }

    loadTaxonomyFromAPI()
  }, [])

  const fetchPages = async (targetNodeId: string) => {
    if (!targetNodeId.trim()) return
    
    try {
      const response = await fetch(`/api/pages?nodeId=${encodeURIComponent(targetNodeId)}`)
      const data = await response.json()
      
      if (data.success) {
        setPages(data.pages)
        setNodeId(targetNodeId)
      } else {
        setPages([])
      }
    } catch (error) {
      console.error('Error fetching pages:', error)
      setPages([])
    }
  }

  const fetchRelatedPages = async (targetNodeId: string) => {
    if (!targetNodeId.trim()) return
    
    try {
      const response = await fetch(`/api/pages?nodeId=${encodeURIComponent(targetNodeId)}`)
      const data = await response.json()
      
      if (data.success) {
        setRelatedPages(data.pages)
        setSelectedRelatedNode(targetNodeId)
      } else {
        setRelatedPages([])
      }
    } catch (error) {
      console.error('Error fetching related pages:', error)
      setRelatedPages([])
    }
  }

  const handleRelatedAction = async () => {
    if (!relatedInput.trim()) return
    
    try {
      const response = await fetch(`/api/related-nodes?nodeId=${encodeURIComponent(relatedInput)}`)
      const data = await response.json()
      
      if (data.success) {
        setRelatedNodes(data.relatedNodes)
      } else {
        setRelatedNodes([])
      }
    } catch (error) {
      console.error('Error fetching related nodes:', error)
      setRelatedNodes([])
    }
  }

  return (
    <main className="p-4">
      <div className="max-w-2xl mx-auto">
        <h1 className="text-2xl font-bold mb-6">Taxonomy Page Fetcher</h1>
        
        <div className="mb-6">
          <h3 className="text-lg font-semibold mb-2">Available Taxonomy Nodes:</h3>
          <div className="text-sm text-gray-600 mb-2">
            {taxonomyNodes.join(', ')}
          </div>
        </div>
        
        <div className="flex gap-2 mb-6">
          <input
            type="text"
            value={nodeId}
            onChange={(e) => setNodeId(e.target.value)}
            placeholder="Enter node ID"
            className="flex-1 px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
          <button
            onClick={() => fetchPages(nodeId)}
            disabled={!nodeId.trim()}
            className="px-4 py-2 bg-blue-500 text-white rounded-md hover:bg-blue-600 disabled:bg-gray-400 disabled:cursor-not-allowed"
          >
            Fetch Pages
          </button>
        </div>

        {pages.length > 0 && (
          <div>
            <h3 className="text-lg font-semibold mb-2">Pages for &quot;{nodeId}&quot; ({pages.length}):</h3>
            <div className="bg-gray-100 p-4 rounded-md">
              <pre className="text-sm overflow-auto max-h-64">
                {JSON.stringify(pages, null, 2)}
              </pre>
            </div>
          </div>
        )}

        {pages.length === 0 && nodeId && (
          <div className="text-gray-500 text-center py-8">
            No pages found for node ID: {nodeId}
          </div>
        )}

        <div className="mt-8">
          <h2 className="text-xl font-bold mb-4">Related Content</h2>
          <div className="flex gap-2 mb-4">
            <input
              type="text"
              value={relatedInput}
              onChange={(e) => setRelatedInput(e.target.value)}
              placeholder="Enter node ID to find related concepts"
              className="flex-1 px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
            <button
              onClick={handleRelatedAction}
              disabled={!relatedInput.trim()}
              className="px-4 py-2 bg-green-500 text-white rounded-md hover:bg-green-600 disabled:bg-gray-400 disabled:cursor-not-allowed"
            >
              Get Related
            </button>
          </div>

          {relatedNodes.length > 0 && (
            <div>
              <h3 className="text-lg font-semibold mb-2">Related Nodes for &quot;{relatedInput}&quot;:</h3>
              <div className="space-y-2">
                {relatedNodes.map((nodeId) => (
                  <div key={nodeId} className="flex items-center gap-2">
                    <span className="text-sm text-gray-600">{nodeId}</span>
                    <button
                      onClick={() => fetchRelatedPages(nodeId)}
                      className="px-2 py-1 text-xs bg-blue-500 text-white rounded hover:bg-blue-600"
                    >
                      Get Pages
                    </button>
                  </div>
                ))}
              </div>
            </div>
          )}

          {relatedPages.length > 0 && (
            <div className="mt-4">
              <h3 className="text-lg font-semibold mb-2">Pages for &quot;{selectedRelatedNode}&quot; ({relatedPages.length}):</h3>
              <div className="bg-gray-100 p-4 rounded-md">
                <pre className="text-sm overflow-auto max-h-64">
                  {JSON.stringify(relatedPages, null, 2)}
                </pre>
              </div>
            </div>
          )}

          {relatedPages.length === 0 && selectedRelatedNode && (
            <div className="text-gray-500 text-center py-4">
              No pages found for related node: {selectedRelatedNode}
            </div>
          )}

          {relatedNodes.length === 0 && relatedInput && (
            <div className="text-gray-500 text-center py-4">
              No related nodes found for: {relatedInput}
            </div>
          )}
        </div>
      </div>
    </main>
  )
} 