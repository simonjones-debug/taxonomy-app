import { NextResponse } from 'next/server'
import { TaxonomyRepository } from '@/lib/taxonomyRepository'
import { ConceptTraversalStrategy, SKOSRelationshipType } from '@/lib/conceptTraversalStrategy'

//fetch taxonomy nodes for navigation
export async function GET() {
  try {
    // Load taxonomy repository from JSON file (server-side)
    const taxonomyRepo = await TaxonomyRepository.loadFromFile()
    const strategy = new ConceptTraversalStrategy(taxonomyRepo)
    
    // Get the root concept (academicPrograms) from the scheme
    const scheme = taxonomyRepo.getScheme()
    const rootConceptId = scheme.topConceptIds[0] // academicPrograms
    
    // Recursive function to traverse the entire tree
    const getAllNodesRecursively = (nodeId: string, visited: Set<string> = new Set()): string[] => {
      // Avoid infinite loops by tracking visited nodes
      if (visited.has(nodeId)) return []
      visited.add(nodeId)
      
      // Get direct children of current node
      const children = strategy.execute(SKOSRelationshipType.NARROWER, [nodeId])
      
      // Recursively get all descendants
      const descendants = children.flatMap(child => getAllNodesRecursively(child.id, visited))
      
      // Return current node + all descendants
      return [nodeId, ...descendants]
    }
    
    // Execute recursive traversal starting from root
    const allNodeIds = getAllNodesRecursively(rootConceptId)
    
    return NextResponse.json({
      success: true,
      taxonomyNodes: allNodeIds,
      scheme: scheme
    })

  } catch (error) {
    console.error('Error loading taxonomy:', error)
    return NextResponse.json(
      { 
        success: false, 
        error: error instanceof Error ? error.message : 'Unknown error' 
      },
      { status: 500 }
    )
  }
} 