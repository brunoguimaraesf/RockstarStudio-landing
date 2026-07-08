import { defineField, defineType } from 'sanity'

export const photo = defineType({
  name: 'photo',
  title: 'Foto',
  type: 'document',
  fields: [
    defineField({
      name: 'title',
      title: 'Titulo',
      type: 'string',
      validation: (rule) => rule.required().error('De um nome para a foto.'),
    }),
    defineField({
      name: 'image',
      title: 'Imagem',
      type: 'image',
      options: { hotspot: true },
      validation: (rule) => rule.required().error('Envie a imagem da nail art.'),
    }),
    defineField({
      name: 'category',
      title: 'Categoria',
      type: 'reference',
      to: [{ type: 'category' }],
      validation: (rule) => rule.required().error('Escolha ou crie uma categoria.'),
    }),
    defineField({
      name: 'featured',
      title: 'Destaque na pagina inicial',
      description: 'Ligue para a foto aparecer na secao de trabalhos da home.',
      type: 'boolean',
      initialValue: false,
    }),
  ],
  preview: {
    select: { title: 'title', subtitle: 'category.title', media: 'image' },
  },
})
