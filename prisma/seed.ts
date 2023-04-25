import {Category, PrismaClient, Role} from '@prisma/client'
import slugify from 'slugify'
import {createPasswordHash} from '~/utils/misc.server'

const db = new PrismaClient()

async function seed() {
	await db.user.deleteMany()
	await db.product.deleteMany()
	await db.productOrder.deleteMany()

	await db.user.create({
		data: {
			name: 'John Doe',
			email: 'user@app.com',
			password: await createPasswordHash('password'),
			role: Role.CUSTOMER,
			address: '123 Main St',
		},
	})

	await db.user.create({
		data: {
			name: 'Roxanna',
			email: 'admin@app.com',
			password: await createPasswordHash('password'),
			role: Role.ADMIN,
		},
	})

	for (const product of products) {
		await db.product.create({
			data: {
				name: product.name,
				description: product.description,
				price: product.price,
				image: product.image,
				slug: slugify(product.name, {lower: true}),
				quantity: product.quantity,
				vendor: product.vendor,
				category: product.type,
			},
		})
	}

	console.log(`Database has been seeded. 🌱`)
}

seed()
	.catch(e => {
		console.error(e)
		process.exit(1)
	})
	.finally(async () => {
		await db.$disconnect()
	})

const products = [
	{
		name: 'Gold Standard 100% Whey Protein Powder',
		description:
			'24g of whey protein per serving to support muscle growth and maintenance',
		image:
			'https://images.unsplash.com/photo-1593095948071-474c5cc2989d?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=1470&q=80',
		quantity: 20,
		price: 49.99,
		vendor: 'Optimum Nutrition',
		type: Category.MUSCLE_GAIN,
	},
	{
		name: 'Serious Mass Weight Gainer Protein Powder',
		description:
			'50g of protein and 252g of carbohydrates per serving to support weight gain',
		image:
			'https://images.unsplash.com/photo-1593095948071-474c5cc2989d?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=1470&q=80',
		quantity: 10,
		price: 59.99,
		vendor: 'Optimum Nutrition',
		type: Category.WEIGHT_GAIN,
	},
	{
		name: 'Dymatize Super Mass Gainer Protein Powder',
		description:
			'52g of protein and 244g of carbohydrates per serving to support weight gain',
		image:
			'https://images.unsplash.com/photo-1593095948071-474c5cc2989d?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=1470&q=80',
		quantity: 15,
		price: 69.99,
		vendor: 'Dymatize',
		type: Category.WEIGHT_GAIN,
	},
	{
		name: 'MuscleTech Mass-Tech Extreme 2000 Weight Gainer Protein Powder',
		description:
			'80g of protein and 400g of carbohydrates per serving to support weight gain',
		image:
			'https://images.unsplash.com/photo-1593095948071-474c5cc2989d?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=1470&q=80',
		quantity: 8,
		price: 79.99,
		vendor: 'MuscleTech',
		type: Category.WEIGHT_GAIN,
	},
	{
		name: 'MuscleTech Mass-Tech Extreme 2000 Weight Gainer Protein Powder',
		description:
			'80g of protein and 400g of carbohydrates per serving to support weight gain',
		image:
			'https://images.unsplash.com/photo-1593095948071-474c5cc2989d?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=1470&q=80',
		quantity: 8,
		price: 79.99,
		vendor: 'MuscleTech',
		type: Category.WEIGHT_GAIN,
	},
]
