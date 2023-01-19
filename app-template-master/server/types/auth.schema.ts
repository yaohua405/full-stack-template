import * as y from 'yup';

const login = {
	user:y.string().required(),
	pass:y.string().required(),
}
const register = {
	...login,
	code:y.string(),
	prev:y.string(),
	
}
export const login_schema = y.object(login);
export type login_type = y.InferType<typeof login_schema>;
export const register_schema = y.object(register).test("code-or-prev", "Provide a code (email code), or prev (the previous password)", v => !!v.prev || !!v.code);
export type register_type = y.InferType<typeof register_schema>;