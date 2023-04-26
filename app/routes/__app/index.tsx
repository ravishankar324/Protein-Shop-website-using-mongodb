import {Anchor} from '@mantine/core'
import {Category} from '@prisma/client'
import {Link} from '@remix-run/react'
import {useMemo} from 'react'
import {TailwindContainer} from '~/components/TailwindContainer'
import {useAppData, useUser} from '~/utils/hooks'

export default function Dashboard() {
	const {products} = useAppData()
	const {user} = useUser()

	const bmiCategory = useMemo(() => {
		if (!user.bmi) return null

		if (user.bmi < 18.5) {
			return Category.WEIGHT_GAIN
		} else if (user.bmi >= 18.5 && user.bmi < 25) {
			return Category.MUSCLE_GAIN
		}

		return Category.WEIGHT_LOSS
	}, [user.bmi])

	const recommendedProducts = useMemo(() => {
		const recommendedProducts = products.filter(
			product => product.category === bmiCategory
		)

		return recommendedProducts
	}, [bmiCategory, products])

	console.log({recommendedProducts})

	const generalProducts = products.filter(
		product => product.category === Category.GENERAL_HEALTH
	)

	const massGainer = products.filter(
		product => product.category === Category.WEIGHT_GAIN
	)

	const weightLoss = products.filter(
		product => product.category === Category.WEIGHT_LOSS
	)

	const muscleGain = products.filter(
		product => product.category === Category.MUSCLE_GAIN
	)

	return (
		<div className="flex flex-col gap-4 p-4">
			<div className="bg-white">
				<TailwindContainer>
					<div className="py-8 sm:px-4">
						{recommendedProducts.length > 0 && (
							<div>
								<h2 className="text-2xl font-extrabold tracking-tight text-gray-900">
									Recommendations
								</h2>
								<p className="mt-2 text-gray-500">
									We recommend the following products based on your BMI. You've
									to{' '}
									{bmiCategory === Category.WEIGHT_GAIN
										? 'gain weight'
										: bmiCategory === Category.MUSCLE_GAIN
										? 'maintain muscle'
										: 'lose weight'}
									.
								</p>

								<div className="-mx-px mt-4 grid grid-cols-2 border-l border-gray-200 sm:mx-0 md:grid-cols-3 lg:grid-cols-4">
									{recommendedProducts.map(product => (
										<div
											key={product.id}
											className="group relative border-b border-r border-gray-200 p-4 sm:p-6"
										>
											<div className="aspect-h-1 aspect-w-1 overflow-hidden rounded-lg bg-gray-200 group-hover:opacity-75">
												<img
													src={product.image}
													alt={product.name}
													className="h-full w-full object-cover object-center"
												/>
											</div>
											<div className="pb-4 pt-10 text-center">
												<h3 className="text-sm font-medium text-gray-900">
													<Anchor
														to={`/product/${product.slug}`}
														prefetch="intent"
														component={Link}
													>
														{product.name}
													</Anchor>
												</h3>
												<div className="mt-3 flex flex-col items-center"></div>
												<p className="mt-4 text-base font-medium text-gray-900">
													${product.price}
												</p>
											</div>
										</div>
									))}
								</div>
							</div>
						)}

						{generalProducts.length > 0 && (
							<div className="mt-16">
								<h2 className="text-2xl font-extrabold tracking-tight text-gray-900">
									General Health
								</h2>

								<div className="-mx-px mt-4 grid grid-cols-2 border-l border-gray-200 sm:mx-0 md:grid-cols-3 lg:grid-cols-4">
									{recommendedProducts.map(product => (
										<div
											key={product.id}
											className="group relative border-b border-r border-gray-200 p-4 sm:p-6"
										>
											<div className="aspect-h-1 aspect-w-1 overflow-hidden rounded-lg bg-gray-200 group-hover:opacity-75">
												<img
													src={product.image}
													alt={product.name}
													className="h-full w-full object-cover object-center"
												/>
											</div>
											<div className="pb-4 pt-10 text-center">
												<h3 className="text-sm font-medium text-gray-900">
													<Anchor
														to={`/product/${product.slug}`}
														prefetch="intent"
														component={Link}
													>
														{product.name}
													</Anchor>
												</h3>
												<div className="mt-3 flex flex-col items-center"></div>
												<p className="mt-4 text-base font-medium text-gray-900">
													${product.price}
												</p>
											</div>
										</div>
									))}
								</div>
							</div>
						)}

						{massGainer.length > 0 && (
							<div className="mt-16">
								<h2 className="text-2xl font-extrabold tracking-tight text-gray-900">
									Mass Gainer
								</h2>

								<div className="-mx-px mt-4 grid grid-cols-2 border-l border-gray-200 sm:mx-0 md:grid-cols-3 lg:grid-cols-4">
									{massGainer.map(product => (
										<div
											key={product.id}
											className="group relative border-b border-r border-gray-200 p-4 sm:p-6"
										>
											<div className="aspect-h-1 aspect-w-1 overflow-hidden rounded-lg bg-gray-200 group-hover:opacity-75">
												<img
													src={product.image}
													alt={product.name}
													className="h-full w-full object-cover object-center"
												/>
											</div>
											<div className="pb-4 pt-10 text-center">
												<h3 className="text-sm font-medium text-gray-900">
													<Anchor
														to={`/product/${product.slug}`}
														prefetch="intent"
														component={Link}
													>
														{product.name}
													</Anchor>
												</h3>
												<div className="mt-3 flex flex-col items-center"></div>
												<p className="mt-4 text-base font-medium text-gray-900">
													${product.price}
												</p>
											</div>
										</div>
									))}
								</div>
							</div>
						)}

						{weightLoss.length > 0 && (
							<div className="mt-16">
								<h2 className="text-2xl font-extrabold tracking-tight text-gray-900">
									Weight Loss
								</h2>
								<p className="mt-2 text-gray-500">
									We recommend the following products based on your BMI. You've
									to{' '}
									{bmiCategory === Category.WEIGHT_GAIN
										? 'gain weight'
										: bmiCategory === Category.MUSCLE_GAIN
										? 'maintain muscle'
										: 'lose weight'}
									.
								</p>

								<div className="-mx-px mt-4 grid grid-cols-2 border-l border-gray-200 sm:mx-0 md:grid-cols-3 lg:grid-cols-4">
									{weightLoss.map(product => (
										<div
											key={product.id}
											className="group relative border-b border-r border-gray-200 p-4 sm:p-6"
										>
											<div className="aspect-h-1 aspect-w-1 overflow-hidden rounded-lg bg-gray-200 group-hover:opacity-75">
												<img
													src={product.image}
													alt={product.name}
													className="h-full w-full object-cover object-center"
												/>
											</div>
											<div className="pb-4 pt-10 text-center">
												<h3 className="text-sm font-medium text-gray-900">
													<Anchor
														to={`/product/${product.slug}`}
														prefetch="intent"
														component={Link}
													>
														{product.name}
													</Anchor>
												</h3>
												<div className="mt-3 flex flex-col items-center"></div>
												<p className="mt-4 text-base font-medium text-gray-900">
													${product.price}
												</p>
											</div>
										</div>
									))}
								</div>
							</div>
						)}

						{muscleGain.length > 0 && (
							<div className="mt-16">
								<h2 className="text-2xl font-extrabold tracking-tight text-gray-900">
									Muscle Gain
								</h2>

								<div className="-mx-px mt-4 grid grid-cols-2 border-l border-gray-200 sm:mx-0 md:grid-cols-3 lg:grid-cols-4">
									{muscleGain.map(product => (
										<div
											key={product.id}
											className="group relative border-b border-r border-gray-200 p-4 sm:p-6"
										>
											<div className="aspect-h-1 aspect-w-1 overflow-hidden rounded-lg bg-gray-200 group-hover:opacity-75">
												<img
													src={product.image}
													alt={product.name}
													className="h-full w-full object-cover object-center"
												/>
											</div>
											<div className="pb-4 pt-10 text-center">
												<h3 className="text-sm font-medium text-gray-900">
													<Anchor
														to={`/product/${product.slug}`}
														prefetch="intent"
														component={Link}
													>
														{product.name}
													</Anchor>
												</h3>
												<div className="mt-3 flex flex-col items-center"></div>
												<p className="mt-4 text-base font-medium text-gray-900">
													${product.price}
												</p>
											</div>
										</div>
									))}
								</div>
							</div>
						)}
					</div>
				</TailwindContainer>
			</div>
		</div>
	)
}
