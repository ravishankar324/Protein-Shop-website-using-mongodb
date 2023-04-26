import {
	Anchor,
	Button,
	Indicator,
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
			<div className="flex h-full flex-col bg-gray-100">
				<HeaderComponent />
				<ScrollArea classNames={{root: 'flex-1'}}>
					<main>
						<Outlet />
					</main>
				</ScrollArea>
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
			<header className="flex h-14 items-center bg-gray-800">
				<TailwindContainer className="flex h-full w-full items-center justify-between px-10">
					<div className="flex flex-shrink-0 items-center gap-4">
						<Anchor component={Link} to="/">
							<img
								className="h-8 object-cover object-center"
								src={appConfig.logo}
								alt="Logo"
							/>
						</Anchor>
					</div>

					<div className="flex items-center gap-4">
						<Indicator inline disabled={itemsInCart.length <= 0} color="red">
							<Button
								component={Link}
								variant="light"
								compact
								to="/cart"
								title="Cart"
							>
								Cart
							</Button>
						</Indicator>

						<Button
							variant="light"
							compact
							onClick={() => setShowBmiModal(true)}
						>
							Update BMI
						</Button>

						<Button
							variant="light"
							compact
							component={Link}
							to="/order-history"
						>
							Your orders
						</Button>
						<Button variant="light" compact type="submit" form="logout-form">
							Logout
						</Button>
					</div>
				</TailwindContainer>
			</header>

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
