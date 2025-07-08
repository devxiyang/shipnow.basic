.PHONY: init migrate generate

# 初始化数据库（首次使用）
init:
	npx prisma migrate dev --name init

# 变更 schema 并应用迁移
migrate:
	npx prisma migrate dev

# 生成 Prisma Client
generate:
	npx prisma generate


# 打开 Prisma Studio 查看数据
studio:
	npx prisma studio

# 格式化 schema 文件
format:
	npx prisma format

# 验证 schema 文件
lint:
	npx prisma validate