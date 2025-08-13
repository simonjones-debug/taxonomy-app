import { TaxonomyRepository } from './taxonomyRepository'

// Core types
export enum SKOSRelationshipType {
  BROADER = 'broader',
  NARROWER = 'narrower',
  RELATED = 'related'
}

// Input-output mapping interface
export interface InputOutputMapping {
  inputNode: string
  outputConcepts: Concept[]
  skosType: SKOSRelationshipType
}

// Import Concept interface from TaxonomyRepository
interface Concept {
  id: string
  label: string
  broader: string[]
  narrower: string[]
  related: string[]
}

export class ConceptTraversalStrategy {
  private repository: TaxonomyRepository

  constructor(repository: TaxonomyRepository) {
    this.repository = repository
  }

  execute(skosType: SKOSRelationshipType, inputNodes: string[]): Concept[] {
    const mappings = this.executeWithMapping(skosType, inputNodes)
    return mappings.flatMap(mapping => mapping.outputConcepts)
  }

  executeWithMapping(skosType: SKOSRelationshipType, inputNodes: string[]): InputOutputMapping[] {
    return inputNodes.map(inputNode => {
      const outputConcepts = this.getConceptsForSKOSType(skosType, inputNode)
      return {
        inputNode,
        outputConcepts,
        skosType
      }
    })
  }

  private getConceptsForSKOSType(skosType: SKOSRelationshipType, inputNode: string): Concept[] {
    switch (skosType) {
      case SKOSRelationshipType.BROADER:
        return this.repository.getParentsOf(inputNode)
      case SKOSRelationshipType.NARROWER:
        return this.repository.getChildrenOf(inputNode)
      case SKOSRelationshipType.RELATED:
        // Get the concept and return its related concepts
        const concept = this.repository.getConceptById(inputNode)
        if (!concept) return []
        
        // Get all related concepts by their IDs
        const relatedConcepts = concept.related.map(relatedId => 
          this.repository.getConceptById(relatedId)
        ).filter(Boolean) as Concept[]
        
        return relatedConcepts
      default:
        throw new Error(`Unsupported SKOS relationship type: ${skosType}`)
    }
  }
} 