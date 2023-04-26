import {Category} from '@prisma/client'

export const products = [
	{
		name: 'Whey Protein Powder Isolate',
		description:
			'24g of whey protein per serving to support muscle growth and maintenance',
		image:
			'https://images.unsplash.com/photo-1595622206924-a47ace58ad70?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=1470&q=80',
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
			'https://plus.unsplash.com/premium_photo-1681138866291-0c1553539be8?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=764&q=80',
		quantity: 10,
		price: 59.99,
		vendor: 'Optimum Nutrition',
		type: Category.WEIGHT_GAIN,
	},
	{
		name: 'Super Mass Gainer Protein Powder',
		description:
			'52g of protein and 244g of carbohydrates per serving to support weight gain',
		image:
			'https://images.unsplash.com/photo-1584116831289-e53912463c35?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=1470&q=80',
		quantity: 15,
		price: 69.99,
		vendor: 'Dymatize',
		type: Category.WEIGHT_GAIN,
	},
	{
		name: 'Brown Rice Protein Powder',
		description:
			'80g of protein and 400g of carbohydrates per serving to support weight gain',
		image:
			'https://plus.unsplash.com/premium_photo-1680859871535-1a4a313c7b06?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=764&q=80',
		quantity: 8,
		price: 79.99,
		vendor: 'MuscleTech',
		type: Category.WEIGHT_LOSS,
	},
	{
		name: 'Low Carb Protein Powder',
		description:
			'Low carb protein powder with 25g of protein per serving to support muscle growth and recovery. Good source of calcium, too.',
		image:
			'https://images.unsplash.com/photo-1619302286299-5acffbac3f43?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=764&q=80',
		quantity: 8,
		price: 79.99,
		vendor: 'MuscleTech',
		type: Category.GENERAL_HEALTH,
	},
	{
		name: 'Vegan Protein Powder Blend',
		description:
			'25g of plant-based protein per serving, with a mix of pea, rice, and hemp protein to support muscle growth and maintenance',
		image:
			'https://images.unsplash.com/photo-1622484212839-2425bcf558f3?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=764&q=80',
		quantity: 12,
		price: 44.99,
		vendor: 'Vega',
		type: Category.MUSCLE_GAIN,
	},
	{
		name: 'Whey Protein Hydrolysate Powder',
		description:
			'28g of hydrolyzed whey protein per serving for rapid absorption and muscle recovery',
		image:
			'https://images.unsplash.com/photo-1595002754613-a457cea51c3d?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=687&q=80',
		quantity: 20,
		price: 54.99,
		vendor: 'Optimum Nutrition',
		type: Category.GENERAL_HEALTH,
	},
	{
		name: 'Protein Bars Variety Pack',
		description:
			'Mixed pack of 12 delicious protein bars with 20g of protein per bar, perfect for on-the-go nutrition',
		image:
			'https://images.unsplash.com/photo-1621057621391-7ed446a24b41?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=1114&q=80',
		quantity: 30,
		price: 24.99,
		vendor: 'Quest Nutrition',
		type: Category.WEIGHT_LOSS,
	},
	{
		name: 'BCAA Amino Acids Supplement',
		description:
			'Supports muscle recovery and endurance with a 2:1:1 ratio of leucine, isoleucine, and valine',
		image:
			'https://images.unsplash.com/photo-1566408669374-5a6d5dca1ef5?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=687&q=80',
		quantity: 25,
		price: 29.99,
		vendor: 'Scivation',
		type: Category.MUSCLE_GAIN,
	},
]
