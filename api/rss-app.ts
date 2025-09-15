import type { VercelApiHandler } from '@vercel/node'
import { request } from 'undici'
import { modifyXml } from '../lib/modifyXml'

const DOMAINS = ['t.co']

const handler: VercelApiHandler = async (req, res) => {
	const { id } = req.query as { id: string }

	const { body } = await request(`https://rss.app/feeds/${id}`)
	let text = await body.text()

	const domainsGroup = DOMAINS.map((d) => d.replaceAll('.', '\\.')).join('|')
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
		toReplace.set(link, typeof location === 'string' ? location : 'link')
	}

	for (const [link, resolvedUrl] of toReplace) {
		text = text.replaceAll(link, resolvedUrl)
	}

	text = modifyXml(text, 'enclosure')

	res
		.status(200)
		.setHeader('content-type', 'text/xml; charset=utf-8')
		.send(text)
}

export default handler
