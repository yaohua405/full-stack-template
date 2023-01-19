import { DBDoc } from '@root/model_dist/ts/default/doc'
import '@server/config'
import { clone, isEqual } from 'lodash'
import designs from './couch_design'
import Nano, { DocumentLookupFailure, DocumentResponseRow, DocumentScope, ServerScope } from './nano'

const default_db_name = process.env.DB_NAME__S
const couchdb_instance_url = process.env.DB_URL
const design_mapping = { default: default_db_name }

export const rowValid = <T extends {}>(
	r?: DocumentLookupFailure | DocumentResponseRow<T>
): r is DocumentResponseRow<T> => !!r && typeof r.error === 'undefined'

const sortKeys = (obj) =>
	Object.keys(obj)
		.sort()
		.reduce((accumulator, key) => {
			accumulator[key] = obj[key]

			return accumulator
		}, {})

export const docChanged = (_a, _b) => {
	let a = typeof _a === 'string' ? JSON.parse(_a) : clone(_a),
		b = typeof _b === 'string' ? JSON.parse(_b) : clone(_b)
	a = sortKeys(a)
	b = sortKeys(b)
	if (Object.hasOwn(a, '_rev')) delete a._rev
	if (Object.hasOwn(b, '_rev')) delete b._rev

	return JSON.stringify(a) !== JSON.stringify(b)
}

const setup_design = async (db: DocumentScope<any>, design: any[]) => {
	// Fetch all design documents in db
	const designs_db = await db.fetch({
		keys: design.map((v) => v._id),
	})

	// Merge with current design objects, only if there are changes
	const to_change = design.reduce((a, d) => {
		const row_db = designs_db.rows.find((r) => r.key === d._id)
		// const key = typeof row_db !== "object" ? row_db : row_db._id;
		const changed = !rowValid(row_db) || docChanged(d, row_db.doc)
		if (changed) {
			a.push({ ...(rowValid(row_db) ? { _rev: row_db.doc._rev } : {}), ...d })
		}
		return a
	}, []) as any[]

	if (!to_change.length) {
		console.log(`'${db.config.db}' designs up to date.`)
		return
	}

	// Push update to DB
	const bulk = await db.bulk({
		docs: to_change,
	})

	const has_errors = bulk.some((v) => !!v.error)
	// Log Update
	console[has_errors ? 'error' : 'log'](
		...[
			`'${db.config.db}' ${!has_errors ? 'pushed' : 'tried pushing'} ${to_change.length} designs:`,
			...(has_errors ? [JSON.stringify(to_change, undefined, 2), JSON.stringify(bulk, undefined, 2)] : [' Success!']),
		]
	)
}

const setup = async (nano: ServerScope) => {
	const dbs = nano.db
	const db_names = await dbs.list()
	for (let design_name in designs) {
		const design = designs[design_name]
		design_name = design_mapping[design_name] ?? design_name

		const create = !db_names.includes(design_name)
		if (create) {
			await nano.db.create(design_name)
			console.log(`Created DB ${design_name}`)
		}
		const db = nano.use(design_name)
		await setup_design(db, design)
	}
}

// const db_user = 'rubend'
// const db_pass = '12345678'
// const db_url = `${process.env.DB_PROTOCOL__S}://${db_user}:${db_pass}@${process.env.DB_HOST__S}`

export const set_auth = (nano: DocumentScope<any> | ServerScope, user: string, pass: string) => {
	nano.config.url = nano.config.url.replace(/\/\/([\w_-]+):([\w_-]+)@/, (s, user_o, pass_o) => `//${user}:${pass}@`)
}

const couchdb_init = async () => {
	if (!couchdb_instance_url || !default_db_name)
		throw `No  DB_URL:"${couchdb_instance_url}"  or  DB_NAME:"${default_db_name}"  ?`

	const nano = Nano(couchdb_instance_url)

	await setup(nano)
	const default_db = nano.use<DBDoc>(default_db_name)

	return default_db
}

export type DBScope = Nano.DocumentScope<DBDoc>

export default couchdb_init
