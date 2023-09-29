import type { NextApiRequest, NextApiResponse } from 'next';

import { getServerSession } from '@server/auth-options';
import { fetchProjectsByUser } from '@server/queries';
import { dbProjectToUiProject } from '@server/transforms';

export default
async function handler(req: NextApiRequest, res: NextApiResponse) {
	const session = await getServerSession(req, res);

	if(!session) {
		res.status(400).end();

		return;
	}

	try {
		const projects = await fetchProjectsByUser(session.user.id);

		res.send({
			ok: true,
			data: { projects: projects.map(dbProjectToUiProject) },
		});
	} catch {
		res.send({ ok: false });
	}
}
