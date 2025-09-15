import { JSDOM } from 'jsdom'

export function modifyXml(xml: string, removeSelector: string): string {
	const dom = new JSDOM(xml, { contentType: 'text/xml' })

	const elements = dom.window.document.querySelectorAll(removeSelector)
	for (const el of elements) {
		el.remove()
	}

	return dom.serialize()
}
