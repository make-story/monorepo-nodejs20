// $ hygen package new hello
module.exports = {
  prompt: async ({ prompter, args }) => {
    const { path1 } = await prompter.prompt({
      type: 'input',
      name: 'path1',
      message: 'Path1의 값을 입력해주세요.',
    });
    const { path2 } = await prompter.prompt({
      type: 'input',
      name: 'path2',
      message: 'Path2의 값을 입력해주세요.',
    });
    const category = await prompter.select({
      type: 'input',
      name: 'category',
      message: '카테고리 컴포넌트의 카테고리를 선택하세요.',
      choices: ['animation', 'common', 'core', 'util'],
    });

    console.log('category', category);

    if (!path1)
      throw new Error('path1의 값이 비어있습니다. path1 의 값을 입력해주세요');
    if (!path2)
      throw new Error('path2의 값이 비어있습니다. path1 의 값을 입력해주세요');

    return {
      path1,
      path2,
      category,
      args,
    };
  },
};
