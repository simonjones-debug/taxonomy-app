# Taxonomy App

A Next.js application for exploring and querying SKOS taxonomy data with Contentful integration.

## Features

- **Taxonomy Exploration**: Browse and search through SKOS taxonomy concepts
- **Related Content Discovery**: Find related concepts and their associated pages
- **Contentful Integration**: Fetch pages associated with taxonomy nodes
- **Repository Pattern**: Clean data access layer for taxonomy operations
- **Strategy Pattern**: Flexible traversal strategies for different SKOS relationships

## Architecture

### Repository Pattern (`TaxonomyRepository`)

The `TaxonomyRepository` class provides a clean interface for accessing taxonomy data:

```typescript
// Initialize the repository
const repository = await TaxonomyRepository.loadFromFile()

// Get taxonomy information
const scheme = repository.getScheme()
const allConcepts = repository.getAllConcepts()
const concept = repository.getConceptById('concept-id')

// Navigate relationships
const children = repository.getChildrenOf('parent-id')
const parents = repository.getParentsOf('child-id')
```

### Strategy Pattern (`ConceptTraversalStrategy`)

The `ConceptTraversalStrategy` class implements different traversal strategies for SKOS relationships:

```typescript
// Create strategy with repository
const strategy = new ConceptTraversalStrategy(repository)

// Execute different traversal types
const broader = strategy.execute(SKOSRelationshipType.BROADER, ['concept-id'])
const narrower = strategy.execute(SKOSRelationshipType.NARROWER, ['concept-id'])
const related = strategy.execute(SKOSRelationshipType.RELATED, ['concept-id'])

// Get detailed mapping information
const mappings = strategy.executeWithMapping(SKOSRelationshipType.RELATED, ['concept-id'])
```

## API Endpoints

### `/api/taxonomy`
Returns all available taxonomy node IDs.

### `/api/pages?nodeId={nodeId}`
Fetches pages from Contentful associated with a specific taxonomy node.

### `/api/related-nodes?nodeId={nodeId}`
Finds related concepts using the strategy pattern and returns their IDs.

## Usage

### Development

```bash
npm run dev
```

### Production Build

```bash
npm run build
npm start
```

### Taxonomy Data

Place your SKOS taxonomy JSON file at `public/taxonomy.json`. The file should follow this structure:

```json
{
  "scheme": {
    "id": "scheme-id",
    "name": "Scheme Name",
    "topConceptIds": ["concept1", "concept2"]
  },
  "concepts": [
    {
      "id": "concept-id",
      "label": "Concept Label",
      "broader": ["parent-concept-id"],
      "narrower": ["child-concept-id"],
      "related": ["related-concept-id"]
    }
  ]
}
```

## Implementation Details

### Repository Pattern Benefits
- **Single Responsibility**: Repository handles only taxonomy data access
- **Dependency Inversion**: Business logic depends on repository interface
- **Testability**: Easy to mock repository for unit testing
- **Singleton Pattern**: Ensures single instance of taxonomy data in memory

### Strategy Pattern Benefits
- **Open/Closed Principle**: Easy to add new traversal strategies
- **Polymorphism**: Different strategies can be swapped at runtime
- **Maintainability**: Each strategy encapsulates specific traversal logic
- **Reusability**: Strategies can be used across different parts of the application

### SKOS Relationship Types
- **BROADER**: Find parent concepts (broader terms)
- **NARROWER**: Find child concepts (narrower terms)  
- **RELATED**: Find related concepts (related terms)

## Environment Setup

Ensure you have the following environment variables set for Contentful integration:

```env
CONTENTFUL_SPACE_ID=your_space_id
CONTENTFUL_ACCESS_TOKEN=your_access_token
```

## Contributing

1. Follow the existing patterns for repository and strategy implementations
2. Add tests for new traversal strategies
3. Update documentation for new features
4. Ensure TypeScript types are properly defined
