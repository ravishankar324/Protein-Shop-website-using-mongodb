import {Anchor, Button, Footer, ScrollArea} from '@mantine/core'
import type {LoaderArgs, SerializeFrom} from '@remix-run/node'
import {json, redirect} from '@remix-run/node'
import {Form, Link, Outlet} from '@remix-run/react'
import appConfig from 'app.config'
import {TailwindContainer} from '~/components/TailwindContainer'
import {isCustomer, requireUser} from '~/lib/session.server'

export type AppLoaderData = SerializeFrom<typeof loader>
export const loader = async ({request}: LoaderArgs) => {
	await requireUser(request)

	if (await isCustomer(request)) {
		return redirect('/')
	}

	return json({})
}

export default function AppLayout() {
	return (
		<>
			<div className="flex h-full flex-col">
				<HeaderComponent />
				<ScrollArea classNames={{root: 'flex-1'}}>
					<main>
						<Outlet />
					</main>
				</ScrollArea>

				<FooterComponent />
			</div>
		</>
	)
}

function HeaderComponent() {
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
						<Button variant="light" compact component={Link} to="orders">
							Orders
						</Button>
						<Button variant="light" compact type="submit" form="logout-form">
							Logout
						</Button>
					</div>
				</TailwindContainer>
			</header>
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
