import type { VercelApiHandler } from '@vercel/node'
import { request } from 'undici'

const handler: VercelApiHandler = async (req, res) => {
	let { text = '', domains = [] } = req.body as {
		text: string
		domains: string[]
	}
	const domainsGroup = domains.map((d) => d.replaceAll('.', '\\.')).join('|')
	const occurences = text.matchAll(
		new RegExp(`https?://(?:${domainsGroup})/\\w+`, 'g'),
	)

	const toReplace = new Map<string, string>()
	for (const [link] of occurences) {
		if (toReplace.has(link)) {
			continue
		}

		// eslint-disable-next-line no-await-in-loop
		const {
			headers: { location },
		} = await request(link, { method: 'HEAD' })
		toReplace.set(link, typeof location === 'string' ? location : '')
	}

	for (const [link, resolvedUrl] of toReplace) {
		text = text.replaceAll(link, resolvedUrl)
	}

	res.send({ text })
}

export default handler
