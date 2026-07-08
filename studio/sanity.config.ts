import { defineConfig } from 'sanity'
import { structureTool } from 'sanity/structure'
import { visionTool } from '@sanity/vision'
import { dataset, projectId } from './env'
import { schemaTypes } from './schemaTypes'

export default defineConfig({
  name: 'default',
  title: 'Rockstar Studio',
  projectId,
  dataset,
  plugins: [structureTool(), visionTool()],
  schema: { types: schemaTypes },
})
