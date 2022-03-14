const { v4 } = require('uuid');

class Classification {
  constructor({
    id, name, type, children
  }) {
    this.id = id || v4();
    this.name = name || '';
    // 收入为0，支出为1
    this.type = type === undefined ? 1 : type;
    this.children = children || [];
    this.create_time = Date.now();
    this.update_time = Date.now();
  }
}

module.exports = [
  new Classification({
    name: '餐饮',
    type: 1,
    children: [
      {
        id: v4(),
        name: '日常伙食'
      },
      {
        id: v4(),
        name: '大快朵颐'
      }
    ]
  }),
  new Classification({ name: '交通', type: 1 }),
  new Classification({ name: '日常用品', type: 1 }),
  new Classification({ name: '工资', type: 0 }),
  new Classification({ name: '股票', type: 0 })
];
