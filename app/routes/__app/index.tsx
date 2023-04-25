import {Anchor, Button} from '@mantine/core'
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
					<div className="px-4 pb-16 sm:py-20 sm:px-6 lg:px-8">
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

								<div className="mt-6 grid grid-cols-1 gap-x-4 gap-y-10 sm:grid-cols-2 sm:gap-6 md:grid-cols-3 lg:grid-cols-4 lg:gap-x-8">
									{products.map(product => {
										return (
											<div key={product.id} className="mx-auto sm:mx-[unset]">
												<div className="h-48 overflow-hidden rounded-md bg-gray-200 shadow lg:h-64">
													<img
														src={product.image}
														alt={product.name}
														className="h-full w-full object-cover object-center"
													/>
												</div>
												<h3 className="mt-4 text-sm text-gray-700">
													<Anchor
														to={`/product/${product.slug}`}
														prefetch="intent"
														component={Link}
													>
														{product.name}
													</Anchor>
												</h3>
												<p className="mt-1 text-sm font-medium text-gray-900">
													${product.price}
												</p>
												<Button
													to={`/product/${product.slug}`}
													component={Link}
													variant="light"
													fullWidth
													mt="md"
												>
													View
												</Button>
											</div>
										)
									})}
								</div>
							</div>
						)}

						{generalProducts.length > 0 && (
							<div className="mt-8">
								<h2 className="text-2xl font-extrabold tracking-tight text-gray-900">
									General Health
								</h2>
								<div className="mt-6 grid grid-cols-1 gap-x-4 gap-y-10 sm:grid-cols-2 sm:gap-6 md:grid-cols-3 lg:grid-cols-4 lg:gap-x-8">
									{generalProducts.map(product => {
										return (
											<div key={product.id} className="mx-auto sm:mx-[unset]">
												<div className="h-48 overflow-hidden rounded-md bg-gray-200 shadow lg:h-64">
													<img
														src={product.image}
														alt={product.name}
														className="h-full w-full object-cover object-center"
													/>
												</div>
												<h3 className="mt-4 text-sm text-gray-700">
													<Anchor
														to={`/product/${product.slug}`}
														prefetch="intent"
														component={Link}
													>
														{product.name}
													</Anchor>
												</h3>
												<p className="mt-1 text-sm font-medium text-gray-900">
													${product.price}
												</p>
												<Button
													to={`/product/${product.slug}`}
													component={Link}
													variant="light"
													fullWidth
													mt="md"
												>
													View
												</Button>
											</div>
										)
									})}
								</div>
							</div>
						)}

						{massGainer.length > 0 && (
							<div className="mt-8">
								<h2 className="text-2xl font-extrabold tracking-tight text-gray-900">
									Mass Gainer
								</h2>
								<div className="mt-6 grid grid-cols-1 gap-x-4 gap-y-10 sm:grid-cols-2 sm:gap-6 md:grid-cols-3 lg:grid-cols-4 lg:gap-x-8">
									{massGainer.map(product => {
										return (
											<div key={product.id} className="mx-auto sm:mx-[unset]">
												<div className="h-48 overflow-hidden rounded-md bg-gray-200 shadow lg:h-64">
													<img
														src={product.image}
														alt={product.name}
														className="h-full w-full object-cover object-center"
													/>
												</div>
												<h3 className="mt-4 text-sm text-gray-700">
													<Anchor
														to={`/product/${product.slug}`}
														prefetch="intent"
														component={Link}
													>
														{product.name}
													</Anchor>
												</h3>
												<p className="mt-1 text-sm font-medium text-gray-900">
													${product.price}
												</p>
												<Button
													to={`/product/${product.slug}`}
													component={Link}
													variant="light"
													fullWidth
													mt="md"
												>
													View
												</Button>
											</div>
										)
									})}
								</div>
							</div>
						)}

						{weightLoss.length > 0 && (
							<div className="mt-8">
								<h2 className="text-2xl font-extrabold tracking-tight text-gray-900">
									Weight Loss
								</h2>
								<div className="mt-6 grid grid-cols-1 gap-x-4 gap-y-10 sm:grid-cols-2 sm:gap-6 md:grid-cols-3 lg:grid-cols-4 lg:gap-x-8">
									{weightLoss.map(product => {
										return (
											<div key={product.id} className="mx-auto sm:mx-[unset]">
												<div className="h-48 overflow-hidden rounded-md bg-gray-200 shadow lg:h-64">
													<img
														src={product.image}
														alt={product.name}
														className="h-full w-full object-cover object-center"
													/>
												</div>
												<h3 className="mt-4 text-sm text-gray-700">
													<Anchor
														to={`/product/${product.slug}`}
														prefetch="intent"
														component={Link}
													>
														{product.name}
													</Anchor>
												</h3>
												<p className="mt-1 text-sm font-medium text-gray-900">
													${product.price}
												</p>
												<Button
													to={`/product/${product.slug}`}
													component={Link}
													variant="light"
													fullWidth
													mt="md"
												>
													View
												</Button>
											</div>
										)
									})}
								</div>
							</div>
						)}

						{muscleGain.length > 0 && (
							<div className="mt-8">
								<h2 className="text-2xl font-extrabold tracking-tight text-gray-900">
									Muscle Gain
								</h2>
								<div className="mt-6 grid grid-cols-1 gap-x-4 gap-y-10 sm:grid-cols-2 sm:gap-6 md:grid-cols-3 lg:grid-cols-4 lg:gap-x-8">
									{muscleGain.map(product => {
										return (
											<div key={product.id} className="mx-auto sm:mx-[unset]">
												<div className="h-48 overflow-hidden rounded-md bg-gray-200 shadow lg:h-64">
													<img
														src={product.image}
														alt={product.name}
														className="h-full w-full object-cover object-center"
													/>
												</div>
												<h3 className="mt-4 text-sm text-gray-700">
													<Anchor
														to={`/product/${product.slug}`}
														prefetch="intent"
														component={Link}
													>
														{product.name}
													</Anchor>
												</h3>
												<p className="mt-1 text-sm font-medium text-gray-900">
													${product.price}
												</p>
												<Button
													to={`/product/${product.slug}`}
													component={Link}
													variant="light"
													fullWidth
													mt="md"
												>
													View
												</Button>
											</div>
										)
									})}
								</div>
							</div>
						)}
					</div>
				</TailwindContainer>
			</div>
		</div>
	)
}
