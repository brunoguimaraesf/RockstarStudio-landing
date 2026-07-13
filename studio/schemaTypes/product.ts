import { defineField, defineType } from 'sanity'

export const product = defineType({
  name: 'product',
  title: 'Produto (Press On)',
  type: 'document',
  fields: [
    defineField({
      name: 'name',
      title: 'Nome',
      type: 'string',
      validation: (rule) => rule.required().error('De um nome para o produto.'),
    }),
    defineField({
      name: 'image',
      title: 'Foto',
      type: 'image',
      options: { hotspot: true },
      validation: (rule) => rule.required().error('Envie a foto do kit press on.'),
    }),
    defineField({
      name: 'description',
      title: 'Descricao',
      description:
        'Detalhes do kit: quantas unhas, formato, tamanhos, o que acompanha.',
      type: 'text',
      rows: 3,
    }),
    defineField({
      name: 'price',
      title: 'Preco (R$)',
      description: 'Somente numeros, use ponto para centavos. Ex: 89.90',
      type: 'number',
      validation: (rule) =>
        rule.required().positive().error('Informe o preco em reais. Ex: 89.90'),
    }),
    defineField({
      name: 'available',
      title: 'Disponivel',
      description:
        'Desligue para marcar como esgotado sem precisar excluir o produto.',
      type: 'boolean',
      initialValue: true,
    }),
  ],
  preview: {
    select: { title: 'name', price: 'price', available: 'available', media: 'image' },
    prepare({ title, price, available, media }) {
      const preco =
        typeof price === 'number'
          ? `R$ ${price.toFixed(2).replace('.', ',')}`
          : 'Sem preco'
      return {
        title,
        subtitle: available === false ? `${preco} — Esgotado` : preco,
        media,
      }
    },
  },
})
