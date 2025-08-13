import { NextResponse } from 'next/server'
import { TaxonomyRepository } from '@/lib/taxonomyRepository'
import { ConceptTraversalStrategy, SKOSRelationshipType } from '@/lib/conceptTraversalStrategy'

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url)
    const nodeId = searchParams.get('nodeId')

    if (!nodeId) {
      return NextResponse.json(
        { 
          success: false, 
          error: 'nodeId parameter is required' 
        },
        { status: 400 }
      )
    }

    // Load taxonomy repository from JSON file (server-side)
    const taxonomyRepo = await TaxonomyRepository.loadFromFile()
    const strategy = new ConceptTraversalStrategy(taxonomyRepo)
    
    // Get related concepts using the strategy
    const relatedConcepts = strategy.execute(SKOSRelationshipType.RELATED, [nodeId])
    
    // Extract just the IDs from the related concepts
    const relatedNodeIds = relatedConcepts.map(concept => concept.id)
    
    return NextResponse.json({
      success: true,
      relatedNodes: relatedNodeIds,
      nodeId: nodeId
    })

  } catch (error) {
    console.error('Error fetching related nodes:', error)
    return NextResponse.json(
      { 
        success: false, 
        error: error instanceof Error ? error.message : 'Unknown error' 
      },
      { status: 500 }
    )
  }
}
