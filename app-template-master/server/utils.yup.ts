import * as y from 'yup';

type Issue = {
	path: string;
	message: string;
};

type MyError = Issue[] | undefined;

const splitName = (name: string) => {
	return name
		.replace(/\[/g, '.[')
		.split('.')
		.filter((v) => v);
};
const normalizeName = (name: string) => splitName(name).join('.');

/** Done like this so value is returned even if error is thrown in schema validation, so even on an error we have default values set */
export const yup_validate = <T extends y.AnySchema>(schema:T|undefined, value:any, stripUnknown?:boolean) => {
	let errors: MyError;
	
	try {
		schema?.validateSync(value, { abortEarly: false, stripUnknown: !!stripUnknown });
	} catch (_error) {
		errors = [];
		const e: any = _error; //as y.ValidationError;
		value = e.value;
		const addError = (
			err //: y.ValidationError
		) => {
			if (!err) return;
			if (err.message) {
				let path = err.path || '';
				let message = err.message.replace(path, '').trim();
				if (message) message = message[0].toUpperCase() + message.substr(1);
				errors?.push({
					path: path && normalizeName(path),
					message: message,
				});
			}
			if (!err?.inner?.length) return;
			err.inner.forEach((ve) => addError(ve));
		};
		addError(e);
	}
	
	return [value, errors]
};

export const validate = <T extends y.AnySchema>(schema:T|undefined, value:any, stripUnknown?:boolean) => {
	const [v,e] = yup_validate(schema,value,stripUnknown);
	if(e?.length)throw e;
	return v as y.InferType<T>;
}