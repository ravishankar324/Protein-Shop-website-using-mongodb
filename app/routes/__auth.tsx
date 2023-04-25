import type {LoaderFunction} from '@remix-run/node'
import {redirect} from '@remix-run/node'
import {Outlet} from '@remix-run/react'
import {getUser} from '~/lib/session.server'

export const loader: LoaderFunction = async ({request}) => {
	const user = await getUser(request)
	if (user) return redirect('/')

	return null
}

export default function AuthLayout() {
	return (
		<>
			<div className="flex min-h-full">
				<div className="flex flex-1 flex-col justify-center py-12 px-4 sm:px-6 lg:flex-none lg:px-20 xl:px-24">
					<div className="mx-auto w-full max-w-sm lg:w-96">
						<Outlet />
					</div>
				</div>

				<div className="relative hidden flex-1 lg:block">
					<img
						className="absolute inset-0 h-full w-full object-cover"
						src="https://images.unsplash.com/photo-1449247666642-264389f5f5b1?auto=format&fit=crop&w=1469&q=80"
						alt=""
					/>
				</div>
			</div>
		</>
	)
}
