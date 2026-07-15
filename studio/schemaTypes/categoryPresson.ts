import { defineField, defineType } from 'sanity'

export const categoryPresson = defineType({
  name: 'categoryPresson',
  title: 'Categoria de Press On',
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
