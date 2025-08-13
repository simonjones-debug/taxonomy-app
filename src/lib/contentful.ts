import { createClient } from 'contentful'

const client = createClient({
  space: process.env.CONTENTFUL_SPACE_ID!,
  accessToken: process.env.CONTENTFUL_ACCESS_TOKEN!,
})

interface ContentfulQuery {
  content_type: string
  'metadata.concepts.sys.id[in]'?: string
}

export async function getAllPages(nodeId?: string) {
  const query: ContentfulQuery = {
    content_type: 'page',
  }

  if (nodeId) {
    query['metadata.concepts.sys.id[in]'] = nodeId
  }

  const response = await client.getEntries(query)
  return response.items
} 