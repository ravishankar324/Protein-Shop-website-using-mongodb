import type {LoaderFunction} from '@remix-run/node'
import {redirect} from '@remix-run/node'
import {Outlet} from '@remix-run/react'
import appConfig from 'app.config'
import {getUser} from '~/lib/session.server'

export const loader: LoaderFunction = async ({request}) => {
	const user = await getUser(request)
	if (user) return redirect('/')

	return null
}

export default function AuthLayout() {
	return (
		<>
			<div className="grid min-h-full grid-cols-12">
				<div className="col-span-4 flex flex-col justify-center px-4 py-12 sm:px-6 lg:flex-none lg:px-10 xl:px-12">
					<div className="mx-auto w-full max-w-sm lg:w-96">
						<Outlet />
					</div>
				</div>

				<div className="relative col-span-8 hidden lg:block">
					<img
						className="absolute inset-0 h-full w-full object-cover"
						src={appConfig.banner}
						alt=""
					/>
				</div>
			</div>
		</>
	)
}
