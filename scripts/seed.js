const { PrismaClient } = require('@prisma/client');

const prisma = new PrismaClient();

const users = [
  {
    name: '张三',
    email: 'zhangsan@example.com',
    phone: '13800138001'
  },
  {
    name: '李四',
    email: 'lisi@example.com',
    phone: '13800138002'
  },
  {
    name: '王五',
    email: 'wangwu@example.com',
    phone: '13800138003'
  },
  {
    name: '赵六',
    email: 'zhaoliu@example.com',
    phone: '13800138004'
  },
  {
    name: '钱七',
    email: 'qianqi@example.com',
    phone: '13800138005'
  },
  {
    name: 'John Doe',
    email: 'john@example.com',
    phone: '13800138006'
  },
  {
    name: 'Jane Smith',
    email: 'jane@example.com',
    phone: '13800138007'
  },
  {
    name: 'Mike Johnson',
    email: 'mike@example.com',
    phone: '13800138008'
  },
  {
    name: 'Sarah Williams',
    email: 'sarah@example.com',
    phone: '13800138009'
  },
  {
    name: 'David Brown',
    email: 'david@example.com',
    phone: '13800138010'
  }
];

async function main() {
  console.log('开始生成测试数据...');
  
  // 清空现有数据
  await prisma.user.deleteMany();
  console.log('已清空现有数据');

  // 插入新数据
  for (const user of users) {
    await prisma.user.create({
      data: user
    });
  }
  
  console.log('测试数据生成完成！');
}

main()
  .catch((e) => {
    console.error('错误：', e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
