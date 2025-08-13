import axios from 'axios'

interface ConceptScheme {
  id: string
  name: string
  topConceptIds: string[]
}

interface Concept {
  id: string
  label: string
  broader: string[]
  narrower: string[]
  related: string[]
}

interface TaxonomyTree {
  scheme: ConceptScheme
  concepts: Concept[]
}

export async function fetchTaxonomyTree(): Promise<TaxonomyTree> {
  const orgId = process.env.CONTENTFUL_ORG_ID!
  
  // First, get concept schemes
  const schemesResponse = await axios.get(
    `https://api.contentful.com/organizations/${orgId}/taxonomy/concept-schemes`,
    {
      headers: { 
        'Content-Type': 'application/vnd.contentful.management.v1+json',
        'Authorization': `Bearer ${process.env.CONTENTFUL_MANAGEMENT_TOKEN}`
      },
    }
  )
  
  if (!schemesResponse.data.items?.length) {
    throw new Error('No concept schemes found')
  }
  
  const scheme = schemesResponse.data.items[0]
  
  // Get concepts for this scheme
  const conceptsResponse = await axios.get(
    `https://api.contentful.com/organizations/${orgId}/taxonomy/concepts`,
    {
      headers: { 
        'Content-Type': 'application/vnd.contentful.management.v1+json',
        'Authorization': `Bearer ${process.env.CONTENTFUL_MANAGEMENT_TOKEN}`
      }
    }
  )

  return {
    scheme: {
      id: scheme.sys.id,
      name: (scheme.prefLabel?.['en-US'] || 'Untitled Scheme').trim(),
      topConceptIds: scheme.topConcepts?.map((link: { sys: { id: string } }) => link.sys.id) || [],
    },
    concepts: conceptsResponse.data.items.map((c: { 
      sys: { id: string }
      prefLabel?: { 'en-US'?: string }
      broader?: Array<{ sys: { id: string } }>
      narrower?: Array<{ sys: { id: string } }>
      related?: Array<{ sys: { id: string } }>
    }) => ({
      id: c.sys.id,
      label: (c.prefLabel?.['en-US'] || 'Untitled Concept').trim(),
      broader: c.broader?.map((b) => b.sys.id) || [],
      narrower: c.narrower?.map((n) => n.sys.id) || [],
      related: c.related?.map((r) => r.sys.id) || [],
    })),
  }
} 