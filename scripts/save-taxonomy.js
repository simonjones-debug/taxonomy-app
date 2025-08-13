import dotenv from 'dotenv'
import fs from 'fs/promises'
import { fetchTaxonomyTree } from '../src/lib/fetchTaxonomy.ts'

// Load environment variables
dotenv.config()

async function saveTaxonomy() {
  try {
    console.log('Fetching taxonomy from Contentful...')
    const taxonomy = await fetchTaxonomyTree()
    
    console.log('Writing taxonomy to public/taxonomy.json...')
    await fs.writeFile(
      'public/taxonomy.json',
      JSON.stringify(taxonomy, null, 2),
      'utf8'
    )
    
    console.log('Success! Taxonomy saved to public/taxonomy.json')
    console.log(`Scheme: ${taxonomy.scheme.name} (${taxonomy.scheme.id})`)
    console.log(`Concepts: ${taxonomy.concepts.length}`)
  } catch (error) {
    console.error('Error saving taxonomy:', error.message)
    process.exit(1)
  }
}

saveTaxonomy() 