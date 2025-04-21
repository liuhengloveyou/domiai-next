// import { neon } from '@neondatabase/serverless';
// import { readFileSync } from 'fs';
// import { join } from 'path';
// import { createId } from '@paralleldrive/cuid2';
// import { PrismaClient } from '@prisma/client';

// const prisma = new PrismaClient();

// if (!process.env.DATABASE_URL) {
//   throw new Error('DATABASE_URL 环境变量未设置');
// }

// const sql = neon(process.env.DATABASE_URL);

// export async function query(query: string, values: any[] = []) {
//   try {
//     console.log('开始执行SQL查询...');
//     console.log('SQL:', query);
//     console.log('参数:', values);
    
//     const result = await sql(query, values);
//     console.log('查询结果:', result);
    
//     return result;
//   } catch (error: any) {
//     console.error('数据库查询错误:', error);
//     // 如果是数据库连接错误，尝试重新连接
//     if (error.message?.includes('connection')) {
//       console.log('尝试重新连接数据库...');
//       const newSql = neon(process.env.DATABASE_URL!);
//       const result = await newSql(query, values);
//       console.log('重新连接后的查询结果:', result);
//       return result;
//     }
//     throw error;
//   }
// }

// export async function initializeDatabase() {
//   try {
//     console.log('开始初始化数据库...');
//     console.log('使用的数据库 URL:', process.env.DATABASE_URL);
    
//     const sqlPath = join(process.cwd(), 'scripts', 'create-tables.sql');
//     console.log('SQL 文件路径:', sqlPath);
    
//     const sqlContent = readFileSync(sqlPath, 'utf-8');
//     console.log('SQL 内容:', sqlContent);
    
//     await query(sqlContent);
//     console.log('数据库表创建成功');
//   } catch (error) {
//     console.error('数据库初始化错误:', error);
//     throw error;
//   }
// }

// // 用户相关的数据库操作
// export async function createUser(data: {
//   email: string;
//   password?: string;
//   name?: string;
//   image?: string;
//   provider?: string;
//   providerId?: string;
// }) {
//   try {
//     console.log('开始创建用户...');
//     console.log('用户数据:', { ...data, password: data.password ? '***' : undefined });
    
//     const { email, password, name, image, provider, providerId } = data;
//     const id = createId();
    
//     // 先检查用户是否已存在
//     const existingUser = await getUserByEmail(email);
//     if (existingUser) {
//       console.log('用户已存在:', existingUser);
//       return existingUser;
//     }
    
//     // 使用 RETURNING * 来获取所有插入的数据
//     const result = await query(
//       `INSERT INTO users (id, email, password, name, image, provider, provider_id) 
//        VALUES ($1, $2, $3, $4, $5, $6, $7) 
//        RETURNING *`,
//       [id, email, password, name || null, image || null, provider || null, providerId || null]
//     );
    
//     if (!result || result.length === 0) {
//       throw new Error('用户创建失败：没有返回数据');
//     }
    
//     console.log('用户创建成功，返回数据:', result[0]);
//     return result[0];
//   } catch (error: any) {
//     console.error('创建用户失败:', error);
//     // 如果是唯一约束冲突，返回特定错误
//     if (error.message?.includes('unique constraint') || error.code === '23505') {
//       throw new Error('该邮箱已被注册');
//     }
//     throw error;
//   }
// }

// export async function getUserByEmail(email: string) {
//   try {
//     console.log('通过邮箱查询用户:', email);
//     const result = await query(
//       'SELECT * FROM users WHERE email = $1',
//       [email]
//     );
//     console.log('查询结果:', result[0]);
//     return result[0];
//   } catch (error) {
//     console.error('查询用户失败:', error);
//     throw error;
//   }
// }

// export async function getUserById(id: string) {
//   try {
//     console.log('通过ID查询用户:', id);
//     const result = await query(
//       'SELECT * FROM users WHERE id = $1',
//       [id]
//     );
//     console.log('查询结果:', result[0]);
//     return result[0];
//   } catch (error) {
//     console.error('查询用户失败:', error);
//     throw error;
//   }
// } 

// // 更新用户的字符配额
// export async function updateCharacterQuota(userId: string, usedCharacters: number) {
//   try {
//     console.log('更新用户字符配额:', { userId, usedCharacters });
    
//     // 使用Prisma客户端查询用户和字符配额
//     const user = await prisma.users.findUnique({
//       where: { id: userId },
//       include: { characterQuota: true }
//     });
    
//     if (!user) {
//       throw new Error('用户不存在');
//     }
    
//     // 如果用户没有字符配额记录，创建一个新的
//     if (!user.characterQuota) {
//       await prisma.characterQuota.create({
//         data: {
//           userId: userId,
//           permanentQuota: 0,
//           temporaryQuota: 0,
//           usedCharacters: usedCharacters,
//           lastUpdated: new Date()
//         }
//       });
//     } else {
//       // 更新已有的字符配额记录
//       const newUsedCharacters = user.characterQuota.usedCharacters + usedCharacters;
      
//       await prisma.characterQuota.update({
//         where: { userId: userId },
//         data: {
//           usedCharacters: newUsedCharacters,
//           lastUpdated: new Date()
//         }
//       });
//     }
    
//     // 只更新用户的最后使用时间，不更新totalCharactersUsed字段
//     await prisma.users.update({
//       where: { id: userId },
//       data: { 
//         lastUsedAt: new Date()
//       }
//     });
    
//     console.log('字符配额更新成功');
//     return true;
//   } catch (error) {
//     console.error('更新字符配额失败:', error);
//     throw error;
//   }
// }