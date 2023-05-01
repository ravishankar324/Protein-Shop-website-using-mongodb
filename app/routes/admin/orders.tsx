import {Badge, Button} from '@mantine/core'
import {OrderStatus} from '@prisma/client'
import type {ActionFunction, LoaderArgs} from '@remix-run/node'
import {json} from '@remix-run/node'
import {useFetcher, useLoaderData} from '@remix-run/react'
import {TailwindContainer} from '~/components/TailwindContainer'
import {approveOrder, cancelOrder, completeOrder} from '~/lib/order.server'
import {db} from '~/lib/prisma.server'
import {requireUser} from '~/lib/session.server'
import type {ManageProductSchema} from '~/lib/zod.schema'
import {statusLookup} from '~/utils/misc'
import type {inferErrors} from '~/utils/validation'

export const loader = async ({request}: LoaderArgs) => {
	await requireUser(request)

	const orders = await db.order.findMany({
		orderBy: {
			createdAt: 'desc',
		},
		include: {
			products: true,
			payment: true,
			user: true,
		},
	})

	return json({
		orders,
	})
}

interface ActionData {
	success: boolean
	fieldErrors?: inferErrors<typeof ManageProductSchema>
}

export const action: ActionFunction = async ({request}) => {
	const formData = await request.formData()

	const intent = formData.get('intent')?.toString()

	if (!intent) {
		return json({success: false, message: 'Unauthorized'}, {status: 401})
	}

	switch (intent) {
		case 'reject-order': {
			const orderId = formData.get('orderId')?.toString()
			if (!orderId) {
				return json(
					{success: false, message: 'Invalid order id'},
					{status: 400}
				)
			}

			return cancelOrder(orderId)
				.then(() => json({success: true}))
				.catch(e => json({success: false, message: e.message}, {status: 500}))
		}

		case 'approve-order': {
			const orderId = formData.get('orderId')?.toString()
			if (!orderId) {
				return json(
					{success: false, message: 'Invalid order id'},
					{status: 400}
				)
			}

			return approveOrder(orderId)
				.then(() => json({success: true}))
				.catch(e => json({success: false, message: e.message}, {status: 500}))
		}

		case 'complete-order': {
			const orderId = formData.get('orderId')?.toString()
			if (!orderId) {
				return json(
					{success: false, message: 'Invalid order id'},
					{status: 400}
				)
			}

			return completeOrder(orderId)
				.then(() => json({success: true}))
				.catch(e => json({success: false, message: e.message}, {status: 500}))
		}

		default:
			return json({success: false, message: 'Invalid intent'}, {status: 400})
	}
}

export default function ManageOrders() {
	const fetcher = useFetcher<ActionData>()
	const orderFetcher = useFetcher()
	const {orders} = useLoaderData<typeof loader>()

	const isSubmitting = fetcher.state !== 'idle'

	return (
		<>
			<TailwindContainer className="rounded-md bg-white">
				<div className="px-4 py-10 sm:px-6 lg:px-8">
					<div className="sm:flex sm:flex-auto sm:items-center sm:justify-between">
						<div>
							<h1 className="text-3xl font-semibold text-gray-900">
								Manage Orders
							</h1>
						</div>
					</div>
					<div className="mt-8 flex flex-col">
						<div className="-mx-4 -my-2 overflow-x-auto sm:-mx-6 lg:-mx-8">
							<div className="inline-block min-w-full py-2 align-middle md:px-6 lg:px-8">
								{orders.length > 0 ? (
									<>
										<table className="min-w-full divide-y divide-gray-300">
											<thead>
												<tr>
													<th
														scope="col"
														className="py-3.5 pl-4 pr-3 text-left text-sm font-semibold text-gray-900 sm:pl-6 md:pl-0"
													>
														Id
													</th>
													<th
														scope="col"
														className="py-3.5 pl-4 pr-3 text-left text-sm font-semibold text-gray-900 sm:pl-6 md:pl-0"
													>
														Name
													</th>
													<th
														scope="col"
														className="py-3.5 pl-4 pr-3 text-left text-sm font-semibold text-gray-900 sm:pl-6 md:pl-0"
													>
														Orderer At
													</th>
													<th
														scope="col"
														className="hidden px-3 py-3.5 text-left text-sm font-semibold text-gray-900 sm:table-cell"
													>
														Price
													</th>
													<th
														scope="col"
														className="hidden px-3 py-3.5 text-left text-sm font-semibold text-gray-900 sm:table-cell"
													>
														Status
													</th>
													<th
														scope="col"
														className="relative py-3.5 pl-3 pr-4 sm:pr-6 md:pr-0"
													>
														<span className="sr-only">Actions</span>
													</th>
												</tr>
											</thead>
											<tbody className="divide-y divide-gray-200">
												{orders.map(order => (
													<tr key={order.id}>
														<td className="whitespace-nowrap py-4 pl-4 pr-3 text-sm font-medium text-gray-900 sm:pl-6 md:pl-0">
															{order.id}
														</td>
														<td className="whitespace-nowrap py-4 text-sm text-gray-500">
															<p className="font-bold">{order.user.name}</p>
															<p>{order.user.email}</p>
														</td>
														<td className="whitespace-nowrap py-4 text-sm text-gray-500">
															{new Date(order.createdAt).toLocaleString()}
														</td>
														<td className="whitespace-nowrap px-3 py-4 text-sm text-gray-500">
															${Math.max(0, order.payment?.amount || 0)}
														</td>
														<td className="whitespace-nowrap px-3 py-4 text-sm text-gray-500">
															<Badge
																color={
																	order.status === OrderStatus.CANCELLED ||
																	order.status === OrderStatus.RETURNED
																		? 'red'
																		: order.status === OrderStatus.PROCESSING
																		? 'blue'
																		: 'green'
																}
															>
																{statusLookup[order.status]}
															</Badge>
														</td>

														<td className="relative space-x-4 whitespace-nowrap py-4 pl-3 pr-4 text-left text-sm font-medium sm:pr-6 md:pr-0">
															<div className="flex items-center gap-2">
																<Button
																	loading={isSubmitting}
																	variant="filled"
																	loaderPosition="right"
																	color="green"
																	compact
																	disabled={
																		order.status === OrderStatus.CANCELLED ||
																		order.status === OrderStatus.RETURNED ||
																		order.status === OrderStatus.DELIVERED ||
																		order.status !== OrderStatus.ORDER_PLACED
																	}
																	onClick={() => {
																		orderFetcher.submit(
																			{
																				intent: 'complete-order',
																				orderId: order.id,
																			},
																			{
																				method: 'POST',
																				replace: true,
																			}
																		)
																	}}
																>
																	Complete
																</Button>

																<Button
																	loading={isSubmitting}
																	variant="filled"
																	loaderPosition="right"
																	color="blue"
																	compact
																	disabled={
																		order.status === OrderStatus.CANCELLED ||
																		order.status === OrderStatus.RETURNED ||
																		order.status === OrderStatus.DELIVERED ||
																		order.status === OrderStatus.ORDER_PLACED
																	}
																	onClick={() => {
																		orderFetcher.submit(
																			{
																				intent: 'approve-order',
																				orderId: order.id,
																			},
																			{
																				method: 'POST',
																				replace: true,
																			}
																		)
																	}}
																>
																	Approve
																</Button>

																<Button
																	loading={isSubmitting}
																	variant="filled"
																	loaderPosition="right"
																	color="red"
																	compact
																	disabled={
																		order.status === OrderStatus.CANCELLED ||
																		order.status === OrderStatus.RETURNED ||
																		order.status === OrderStatus.DELIVERED
																	}
																	onClick={() => {
																		orderFetcher.submit(
																			{
																				intent: 'reject-order',
																				orderId: order.id,
																			},
																			{
																				method: 'POST',
																				replace: true,
																			}
																		)
																	}}
																>
																	Reject
																</Button>
															</div>
														</td>
													</tr>
												))}
											</tbody>
										</table>
									</>
								) : (
									<div className="flex items-center justify-center rounded-lg border border-dashed py-20">
										<p className="italic text-gray-500">
											No orders yet. Once a user places an order, it will show
											up here.
										</p>
									</div>
								)}
							</div>
						</div>
					</div>
				</div>
			</TailwindContainer>
		</>
	)
}
