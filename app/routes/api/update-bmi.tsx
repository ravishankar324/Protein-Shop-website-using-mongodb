import type {ActionArgs, LoaderArgs} from '@remix-run/node'
import {json} from '@remix-run/node'
import {redirect} from '@remix-run/node'
import {db} from '~/lib/prisma.server'
import {requireUserId} from '~/lib/session.server'

export const action = async ({request}: ActionArgs) => {
	const userId = await requireUserId(request)
	const formData = await request.formData()

	const height = formData.get('height')?.toString()
	const weight = formData.get('weight')?.toString()

	if (!height || !weight) {
		return null
	}

	const bmi = Number(weight) / (Number(height) * Number(height))

	await db.user.update({
		where: {id: userId},
		data: {
			weight: Number(weight),
			height: Number(height),
			bmi,
		},
	})

	return json({message: 'BMI updated'}, {status: 200})
}
export const loader = async ({request}: LoaderArgs) => {
	return redirect('/')
}
