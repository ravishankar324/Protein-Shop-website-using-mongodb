import {ArrowLeftOnRectangleIcon} from '@heroicons/react/24/solid'

import {
	ShoppingBagIcon,
	ShoppingCartIcon,
	UserIcon,
} from '@heroicons/react/24/outline'

import {
	Anchor,
	Avatar,
	Button,
	Divider,
	Footer,
	Header,
	Indicator,
	Menu,
	Modal,
	ScrollArea,
	TextInput,
} from '@mantine/core'
import type {LoaderArgs, SerializeFrom} from '@remix-run/node'
import {json, redirect} from '@remix-run/node'
import {Form, Link, Outlet, useFetcher, useLoaderData} from '@remix-run/react'
import appConfig from 'app.config'
import * as React from 'react'
import {TailwindContainer} from '~/components/TailwindContainer'
import {useCart} from '~/context/CartContext'
import {getAllProducts} from '~/lib/product.server'
import {isAdmin, isCustomer, requireUser} from '~/lib/session.server'
import {useUser} from '~/utils/hooks'

export type AppLoaderData = SerializeFrom<typeof loader>
export const loader = async ({request}: LoaderArgs) => {
	const user = await requireUser(request)

	if (await isAdmin(request)) {
		return redirect('/admin')
	}

	const products = await getAllProducts()
	const isBmiSet = user.bmi !== null && user.bmi !== undefined

	return json({products, isCustomer: await isCustomer(request), isBmiSet})
}

export default function AppLayout() {
	const {isBmiSet} = useLoaderData<AppLoaderData>()
	const [showBmiModal, setShowBmiModal] = React.useState(!isBmiSet)

	const bmiFetcher = useFetcher()

	React.useEffect(() => {
		if (!isBmiSet) {
			setShowBmiModal(true)
		} else {
			setShowBmiModal(false)
		}
	}, [isBmiSet])

	return (
		<>
			<div className="flex h-full flex-col">
				<HeaderComponent />
				<ScrollArea classNames={{root: 'flex-1 bg-white'}}>
					<main>
						<Outlet />
					</main>
				</ScrollArea>

				<FooterComponent />
			</div>

			<Modal
				title="BMI Calculator"
				opened={showBmiModal}
				onClose={() => setShowBmiModal(false)}
				withCloseButton={false}
				closeOnEscape={false}
				closeOnClickOutside={false}
			>
				<bmiFetcher.Form
					method="post"
					className="space-y-4"
					action="/api/update-bmi"
					replace
				>
					<TextInput
						label="Height (m)"
						name="height"
						type="number"
						required
						min={0}
						step={0.01}
					/>

					<TextInput
						label="Weight (kg)"
						name="weight"
						type="number"
						required
						min={0}
						step={0.01}
					/>

					<Button type="submit" fullWidth>
						Submit
					</Button>
				</bmiFetcher.Form>
			</Modal>
		</>
	)
}

function HeaderComponent() {
	const {user} = useUser()
	const {itemsInCart} = useCart()
	const [showBmiModal, setShowBmiModal] = React.useState(false)

	const bmiFetcher = useFetcher()

	return (
		<>
			<Form replace action="/api/auth/logout" method="post" id="logout-form" />
			<Header height={80} p="md">
				<TailwindContainer>
					<div className="flex h-full w-full items-center justify-between">
						<div className="flex flex-shrink-0 items-center gap-4">
							<Anchor component={Link} to="/">
								<img
									className="h-12 object-cover object-center"
									src={appConfig.logo}
									alt="Logo"
								/>
							</Anchor>
						</div>

						<div className="flex items-center gap-4">
							<Indicator
								inline
								disabled={itemsInCart.length <= 0}
								color="red"
								offset={7}
								size={8}
							>
								<Button
									px={8}
									component={Link}
									variant="subtle"
									to="/cart"
									title="Cart"
									color="gray"
								>
									<ShoppingCartIcon className="h-5 w-5 text-gray-500" />
								</Button>
							</Indicator>

							<Menu
								position="bottom-start"
								withArrow
								transition="pop-top-right"
							>
								<Menu.Target>
									<button>
										<Avatar color="blue" size="md">
											{user.name.charAt(0)}
										</Avatar>
									</button>
								</Menu.Target>

								<Menu.Dropdown>
									<Menu.Item disabled>
										<div className="flex flex-col">
											<p>{user.name}</p>
											<p className="mt-0.5 text-sm">{user.email}</p>
										</div>
									</Menu.Item>
									<Divider />

									<Menu.Item
										icon={<UserIcon className="h-4 w-4" />}
										component="button"
										onClick={() => setShowBmiModal(true)}
									>
										Update BMI
									</Menu.Item>

									<Menu.Item
										icon={<ShoppingBagIcon className="h-4 w-4" />}
										component={Link}
										to="/order-history"
									>
										Your orders
									</Menu.Item>
									<Menu.Item
										icon={<ArrowLeftOnRectangleIcon className="h-4 w-4" />}
										type="submit"
										form="logout-form"
									>
										Logout
									</Menu.Item>
								</Menu.Dropdown>
							</Menu>
						</div>
					</div>
				</TailwindContainer>
			</Header>

			<Modal
				title="Update details"
				opened={showBmiModal}
				onClose={() => setShowBmiModal(false)}
			>
				<bmiFetcher.Form
					method="post"
					className="space-y-4"
					action="/api/update-bmi"
					replace
				>
					<TextInput
						label="Height (m)"
						name="height"
						required
						type="number"
						defaultValue={user?.height || ''}
						min={0}
						step={0.01}
					/>

					<TextInput
						label="Weight (kg)"
						name="weight"
						required
						type="number"
						defaultValue={user?.weight || ''}
						min={0}
						step={0.01}
					/>

					<Button
						type="submit"
						fullWidth
						onClick={() => setShowBmiModal(false)}
					>
						Submit
					</Button>
				</bmiFetcher.Form>
			</Modal>
		</>
	)
}

function FooterComponent() {
	return (
		<Footer
			height={44}
			p="md"
			className="flex items-center justify-center py-1 text-center text-sm"
		>
			<span className="text-gray-400">
				©{new Date().getFullYear()} {appConfig.name}, Inc. All rights reserved.
			</span>
		</Footer>
	)
}
