import {Category, OrderStatus} from '@prisma/client'

export function round(number: number, precision: number) {
	const d = Math.pow(10, precision)
	return Math.round((number + Number.EPSILON) * d) / d
}

export function titleCase(string: string) {
	string = string.toLowerCase()
	const wordsArray = string.split(' ')

	for (var i = 0; i < wordsArray.length; i++) {
		wordsArray[i] =
			wordsArray[i].charAt(0).toUpperCase() + wordsArray[i].slice(1)
	}

	return wordsArray.join(' ')
}

// generate 16 digit serial number (only numbers)
export function generateSerialNumber() {
	return Math.floor(
		1000000000000000 + Math.random() * 9000000000000000
	).toString()
}

export function formatDate(date: Date | string) {
	return new Intl.DateTimeFormat('en-US', {
		year: 'numeric',
		month: 'short',
		day: '2-digit',
		hour: 'numeric',
		minute: 'numeric',
	}).format(new Date(date))
}

export const statusLookup = {
	[OrderStatus.PROCESSING]: 'Processing',
	[OrderStatus.DELIVERED]: 'Delivered',
	[OrderStatus.CANCELLED]: 'Cancelled',
	[OrderStatus.RETURNED]: 'Returned',
	[OrderStatus.ORDER_PLACED]: 'Order Placed',
} satisfies Record<OrderStatus, string>

export const statusColorLookup = {
	[OrderStatus.PROCESSING]: 'orange',
	[OrderStatus.DELIVERED]: 'green',
	[OrderStatus.CANCELLED]: 'red',
	[OrderStatus.RETURNED]: 'red',
	[OrderStatus.ORDER_PLACED]: 'blue',
} satisfies Record<OrderStatus, string>

export const categoryLookup = {
	[Category.GENERAL_HEALTH]: 'General Health',
	[Category.MUSCLE_GAIN]: 'Muscle Gain',
	[Category.WEIGHT_LOSS]: 'Weight Loss',
	[Category.WEIGHT_GAIN]: 'Weight Gain',
} satisfies Record<Category, string>
