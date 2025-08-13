import fs from 'fs/promises'

interface Concept {
  id: string
  label: string
  broader: string[]
  narrower: string[]
  related: string[]
}

interface ConceptScheme {
  id: string
  name: string
  topConceptIds: string[]
}

interface TaxonomyTree {
  scheme: ConceptScheme
  concepts: Concept[]
}

export class TaxonomyRepository {
  private static instance: TaxonomyRepository | null = null
  private taxonomy: TaxonomyTree

  private constructor(taxonomy: TaxonomyTree) {
    this.taxonomy = taxonomy
  }

  static initialize(taxonomyData: TaxonomyTree): TaxonomyRepository {
    if (!TaxonomyRepository.instance) {
      TaxonomyRepository.instance = new TaxonomyRepository(taxonomyData)
    }
    return TaxonomyRepository.instance
  }

  static getInstance(): TaxonomyRepository {
    if (!TaxonomyRepository.instance) {
      throw new Error('TaxonomyRepository not initialized. Call initialize() first.')
    }
    return TaxonomyRepository.instance
  }

  getScheme(): ConceptScheme {
    return this.taxonomy.scheme
  }

  getAllConcepts(): Concept[] {
    return this.taxonomy.concepts
  }

  getConceptById(id: string): Concept | undefined {
    return this.taxonomy.concepts.find(concept => concept.id === id)
  }

  getChildrenOf(id: string): Concept[] {
    return this.taxonomy.concepts.filter(concept => 
      concept.broader.includes(id)
    )
  }

  getParentsOf(id: string): Concept[] {
    return this.taxonomy.concepts.filter(concept => 
      concept.narrower.includes(id)
    )
  }

  static async loadFromFile(): Promise<TaxonomyRepository> {
    try {
      const data = await fs.readFile('public/taxonomy.json', 'utf8')
      const taxonomy: TaxonomyTree = JSON.parse(data)
      return TaxonomyRepository.initialize(taxonomy)
    } catch (error) {
      throw new Error(`Failed to load taxonomy data: ${error}`)
    }
  }
} 