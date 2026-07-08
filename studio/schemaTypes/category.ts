import { defineField, defineType } from 'sanity'

export const category = defineType({
  name: 'category',
  title: 'Categoria',
  type: 'document',
  fields: [
    defineField({
      name: 'title',
      title: 'Nome',
      type: 'string',
      validation: (rule) => rule.required().error('A categoria precisa de um nome.'),
    }),
  ],
})
