import type {
	Order,
	OrderType,
	Payment,
	PaymentMethod,
	Product,
	ProductOrder,
	User,
} from '@prisma/client'
import {OrderStatus} from '@prisma/client'
import type {CartItem} from '~/context/CartContext'
import {generateSerialNumber} from '~/utils/misc'
import {db} from './prisma.server'

export function getOrders(userId: User['id']) {
	return db.order.findMany({
		where: {
			userId,
		},
		orderBy: {
			createdAt: 'desc',
		},
		include: {
			products: {
				include: {
					product: true,
				},
			},
			payment: true,
		},
	})
}

export function createOrder({
	userId,
	products,
	amount,
	orderType,
	paymentMethod,
	address,
	pickupDateTime,
}: {
	userId: User['id']
	products: Array<CartItem>
	amount: Payment['amount']
	paymentMethod: PaymentMethod
	orderType: OrderType
	address: Required<Payment['address']>
	pickupDateTime: Order['pickupDateTime']
}) {
	return db.$transaction(async tx => {
		const order = await tx.order.create({
			data: {
				userId,
				type: orderType,
				status: OrderStatus.PROCESSING,
				pickupDateTime,
				payment: {
					create: {
						paymentMethod,
						address,
						amount,
						user: {
							connect: {
								id: userId,
							},
						},
					},
				},
			},
		})

		let productsWithSerialNumber: Array<{
			productId: Product['id']
			orderId: Order['id']
			quantity: number
			serialNo: ProductOrder['serialNo']
			amount: Product['price']
			status: ProductOrder['status']
		}> = []
		products.forEach(p => {
			for (let i = 0; i < p.quantity; i++) {
				productsWithSerialNumber.push({
					productId: p.id,
					orderId: order.id,
					quantity: 1,
					serialNo: generateSerialNumber(),
					amount: p.basePrice,
					status: OrderStatus.PROCESSING,
				})
			}
		})

		await tx.productOrder.createMany({
			data: productsWithSerialNumber,
		})

		await Promise.all(
			products.map(async p => {
				const product = await tx.product.update({
					where: {
						id: p.id,
					},
					data: {
						quantity: {
							decrement: p.quantity,
						},
					},
				})

				if (product.quantity < 0) {
					throw new Error(`Product ${product.name} has insufficient quantity`)
				}
			})
		)

		return order
	})
}

export async function returnOrder(orderId: Order['id']) {
	const order = await db.order.findUnique({
		where: {
			id: orderId,
		},
		include: {
			products: {
				include: {
					product: true,
				},
			},
		},
	})

	if (!order) {
		throw new Error('Order not found')
	}

	await db.order.update({
		where: {
			id: orderId,
		},
		data: {
			status: OrderStatus.RETURNED,
			products: {
				updateMany: {
					where: {
						orderId: orderId,
					},
					data: {
						status: OrderStatus.RETURNED,
					},
				},
			},
		},
	})

	const products = order.products.map(p => ({
		id: p.product.id,
		quantity: p.quantity,
		baseQuantity: p.product.quantity,
	}))

	await Promise.all(
		products.map(p =>
			db.product.update({
				where: {
					id: p.id,
				},
				data: {
					quantity: {
						increment: p.quantity,
					},
				},
			})
		)
	)
}

export async function cancelOrder(orderId: Order['id']) {
	const order = await db.order.findUnique({
		where: {
			id: orderId,
		},
		include: {
			products: {
				include: {
					product: true,
				},
			},
		},
	})

	if (!order) {
		throw new Error('Order not found')
	}

	await db.order.update({
		where: {
			id: orderId,
		},
		data: {
			status: OrderStatus.CANCELLED,
			products: {
				updateMany: {
					where: {
						orderId: orderId,
						status: {
							notIn: [OrderStatus.RETURNED],
						},
					},
					data: {
						status: OrderStatus.CANCELLED,
					},
				},
			},
		},
	})

	const products = order.products.map(p => ({
		id: p.product.id,
		quantity: p.quantity,
		baseQuantity: p.product.quantity,
	}))

	await Promise.all(
		products.map(p =>
			db.product.update({
				where: {
					id: p.id,
				},
				data: {
					quantity: {
						increment: p.quantity,
					},
				},
			})
		)
	)
}

export async function cancelProduct({
	serialNo,
	orderId,
}: {
	serialNo: ProductOrder['serialNo']
	orderId: Order['id']
}) {
	const product = await db.productOrder.findUnique({
		where: {
			serialNo,
		},
	})

	if (!product) {
		throw new Error('Product not found')
	}

	const productPrice = product.amount

	await db.order.update({
		where: {
			id: orderId,
		},
		data: {
			payment: {
				update: {
					amount: {
						decrement: productPrice,
					},
				},
			},
			products: {
				update: {
					where: {
						serialNo,
					},
					data: {
						status: OrderStatus.RETURNED,
						amount: 0,
					},
				},
			},
		},
	})
}

export async function approveOrder(orderId: Order['id']) {
	return await db.order.update({
		where: {
			id: orderId,
		},
		data: {
			status: OrderStatus.ORDER_PLACED,
		},
	})
}

export async function completeOrder(orderId: Order['id']) {
	return await db.order.update({
		where: {
			id: orderId,
		},
		data: {
			status: OrderStatus.DELIVERED,
		},
	})
}
