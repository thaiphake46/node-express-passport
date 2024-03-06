import { OKSuccess } from '~/core/SuccessResponse'
import { getUserByEmail } from '~/services/userService'

export const userProfile = async (req, res, next) => {
  const { email } = req.user

  const user = await getUserByEmail(email)

  new OKSuccess({ metadata: user }).json(res)
}
