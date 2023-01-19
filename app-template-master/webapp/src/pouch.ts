import pouchdb from 'pouchdb-browser'

const gen_random = () => {
	return 'rubend'
}

const get_creds = () =>
	__DEBUG__
		? {
				user: 'rubend',
				pass: '12345678',
		  }
		: (localStorage.getItem('local_id') && JSON.parse(localStorage.getItem('local_id') || '')) ?? {
				user: 'user' + Math.random(),
				pass: 'user' + Math.random(),
		  }

const { user, pass } = get_creds()
console.log(`user: '${user}', pass: '${pass}'`)

const db_url = `${process.env.DB_PROTOCOL__S}://${user}:${pass}@${process.env.DB_HOST__S}/${process.env.DB_NAME__S}`

const pouch = new pouchdb(db_url)

;(async () => {
	console.log('All docs:', await pouch.allDocs({ include_docs: true }))
})()

export default pouch
