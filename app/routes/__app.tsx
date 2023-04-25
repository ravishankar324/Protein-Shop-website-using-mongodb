import {
	ArrowLeftOnRectangleIcon,
	ArrowRightOnRectangleIcon,
	MagnifyingGlassIcon,
	UserPlusIcon,
} from '@heroicons/react/24/solid'

import {ShoppingBagIcon, ShoppingCartIcon} from '@heroicons/react/24/outline'

import {
	ActionIcon,
	Anchor,
	Avatar,
	Button,
	Divider,
	Footer,
	Group,
	Header,
	Indicator,
	Menu,
	ScrollArea,
	Text,
} from '@mantine/core'
import type {SpotlightAction} from '@mantine/spotlight'
import {SpotlightProvider, useSpotlight} from '@mantine/spotlight'
import type {LoaderArgs, SerializeFrom} from '@remix-run/node'
import {json, redirect} from '@remix-run/node'
import type {ShouldReloadFunction} from '@remix-run/react'
import {
	Form,
	Link,
	Outlet,
	useLoaderData,
	useLocation,
	useNavigate,
} from '@remix-run/react'
import appConfig from 'app.config'
import * as React from 'react'
import {TailwindContainer} from '~/components/TailwindContainer'
import {useCart} from '~/context/CartContext'
import {getAllProducts} from '~/lib/product.server'
import {isAdmin, isCustomer, requireUser} from '~/lib/session.server'
import {useOptionalUser} from '~/utils/hooks'

export type AppLoaderData = SerializeFrom<typeof loader>
export const loader = async ({request}: LoaderArgs) => {
	await requireUser(request)

	if (await isAdmin(request)) {
		return redirect('/admin')
	}

	const products = await getAllProducts()
	return json({products, isCustomer: await isCustomer(request)})
}

export default function AppLayout() {
	const navigate = useNavigate()
	const {products} = useLoaderData<typeof loader>()

	const [actions] = React.useState<SpotlightAction[]>(() => {
		const actions = [] as SpotlightAction[]

		products.forEach(product => {
			actions.push({
				title: product.name,
				icon: <Avatar src={product.image} radius="xl" size="sm" />,
				onTrigger: () => navigate(`/product/${product.slug}`),
			})
		})

		return actions
	})

	return (
		<>
			<SpotlightProvider
				shortcut={['mod + K', '/']}
				highlightQuery
				searchPlaceholder="Search for products..."
				searchIcon={<MagnifyingGlassIcon className="h-5 w-5" />}
				limit={5}
				actionsWrapperComponent={ActionsWrapper}
				nothingFoundMessage={<Text>Nothing found</Text>}
				actions={actions}
			>
				<div className="flex h-full flex-col">
					<HeaderComponent />
					<ScrollArea classNames={{root: 'flex-1 bg-gray-100'}}>
						<main>
							<Outlet />
						</main>
					</ScrollArea>

					<FooterComponent />
				</div>
			</SpotlightProvider>
		</>
	)
}

function HeaderComponent() {
	const spotlight = useSpotlight()
	const location = useLocation()
	const {user} = useOptionalUser()
	const {itemsInCart} = useCart()
	const {isCustomer} = useLoaderData<typeof loader>()

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
							<ActionIcon
								title="Search"
								size="lg"
								onClick={() => spotlight.openSpotlight()}
							>
								<MagnifyingGlassIcon className="h-5 w-5 text-gray-500" />
							</ActionIcon>

							<Indicator
								label={itemsInCart.length}
								inline
								size={16}
								disabled={itemsInCart.length <= 0}
								color="red"
								offset={7}
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
										{user ? (
											<Avatar color="blue" size="md">
												{user.name.charAt(0)}
											</Avatar>
										) : (
											<Avatar />
										)}
									</button>
								</Menu.Target>

								<Menu.Dropdown>
									{user ? (
										<>
											<Menu.Item disabled>
												<div className="flex flex-col">
													<p>{user.name}</p>
													<p className="mt-0.5 text-sm">{user.email}</p>
												</div>
											</Menu.Item>
											<Divider />

											{isCustomer ? (
												<Menu.Item
													icon={<ShoppingBagIcon className="h-4 w-4" />}
													component={Link}
													to="/order-history"
												>
													Your orders
												</Menu.Item>
											) : null}
											<Menu.Item
												icon={<ArrowLeftOnRectangleIcon className="h-4 w-4" />}
												type="submit"
												form="logout-form"
											>
												Logout
											</Menu.Item>
										</>
									) : (
										<>
											<Menu.Item
												icon={<ArrowRightOnRectangleIcon className="h-4 w-4" />}
												component={Link}
												to={`/login?redirectTo=${encodeURIComponent(
													location.pathname
												)}`}
											>
												Login
											</Menu.Item>
											<Menu.Item
												icon={<UserPlusIcon className="h-4 w-4" />}
												component={Link}
												to={`/register?redirectTo=${encodeURIComponent(
													location.pathname
												)}`}
											>
												Create account
											</Menu.Item>
										</>
									)}
								</Menu.Dropdown>
							</Menu>
						</div>
					</div>
				</TailwindContainer>
			</Header>
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

function ActionsWrapper({children}: {children: React.ReactNode}) {
	return (
		<div>
			{children}
			<Group
				position="right"
				px={15}
				py="xs"
				className="border-t border-gray-300"
			>
				<Text size="xs" color="dimmed">
					Search powered by {appConfig.name}
				</Text>
			</Group>
		</div>
	)
}

export const unstable_shouldReload: ShouldReloadFunction = ({
	submission,
	prevUrl,
	url,
}) => {
	if (!submission && prevUrl.pathname === url.pathname) {
		return false
	}

	return true
}
