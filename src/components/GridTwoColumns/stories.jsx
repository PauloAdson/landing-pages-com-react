import { GridTwoColumns } from '.'

export default {
  title: 'GridTwoColumns',
  component: GridTwoColumns,
  args: {
    title: 'Grid Two Columns',
    text: `Lorem ipsum dolor sit amet consectetur adipisicing elit. Porro quidem eos facilis, architecto minima sequi quia. Sequi aut inventore laboriosam libero esse dolores in autem quisquam! Earum rem obcaecati consequatur.`,
    srcImg: 'assets/images/javascript.svg',
  },
  argTypes: {
    children: { type: 'string' },
  },
}

export const Template = (args) => {
  return (
    <div>
      <GridTwoColumns {...args} />
    </div>
  )
}
