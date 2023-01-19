import va from "."
import { hasAccess } from "./access"

type AT = {user: string,
	access: string | undefined,
	validate: boolean,
	acccess_e: { read: boolean; write: boolean }}


describe("Access testing", () => {
  const access_test = (
    {user, access, validate, acccess_e}:AT
  ) => {
		const ex = va.default.note({ value: "Nothing much", access })
		if(ex!==!!validate)console.log(`access: '${access}', validate:${!!validate}`)
    expect(ex).toBe(!!validate)
		if(!validate)return;
    expect(hasAccess(user, access)).toEqual(acccess_e)
  }
	const toTest: Record<string,AT[]> = {
		"Access empty not allowed": [
			{access: "", validate: false, user: "john", acccess_e: {read:true,write:true}},
		],
		"Access undefined, full access to any":[
			{user: "rubend", access: undefined, validate: true, acccess_e: {read:true,write:true}},
			{access: undefined, validate: true, user: "john", acccess_e: {read:true,write:true}},
		],
		"User validates correctly":[
			{access: "a", validate: false, user: "john", acccess_e: {read:false,write:false}},
			{access: "ak", validate: true, user: "john", acccess_e: {read:false,write:false}},
			{access: "akk ", validate: false, user: "john", acccess_e: {read:false,write:false}},
			{access: "akk ;", validate: false, user: "john", acccess_e: {read:false,write:false}},
			{access: "akk;", validate: false, user: "john", acccess_e: {read:false,write:false}},
			{access: " akk", validate: false, user: "john", acccess_e: {read:false,write:false}},
			{access: " akk;", validate: false, user: "john", acccess_e: {read:false,write:false}},
			{access: "akk 0", validate: true, user: "john", acccess_e: {read:false,write:false}},
			{access: "akk 00", validate: true, user: "john", acccess_e: {read:false,write:false}},
			{access: "akk 00;", validate: true, user: "john", acccess_e: {read:false,write:false}},
			{access: "akk 00;jo-hn", validate: false, user: "john", acccess_e: {read:false,write:false}},
			{access: "akk 00;jo-hn:mar^a", validate: false, user: "john", acccess_e: {read:false,write:false}},
			{access: "akk 00;jo-hn:mar a", validate: false, user: "john", acccess_e: {read:false,write:false}},
			{access: "akk 00;johnny:maria", validate: true, user: "john", acccess_e: {read:false,write:false}},
			{access: "akk 00;johnny:maria ", validate: true, user: "john", acccess_e: {read:false,write:false}},
			{access: "akk 00;johnny:maria 000", validate: true, user: "john", acccess_e: {read:false,write:false}},
		],
		"Other users are given correct rights":[
			{access: "akk 0", validate: true, user: "akk", acccess_e: {read:true,write:true}},
			{access: "akk 0", validate: true, user: "john", acccess_e: {read:false,write:false}},
			{access: "akk 1", validate: true, user: "akk", acccess_e: {read:true,write:true}},
			{access: "akk 1", validate: true, user: "john", acccess_e: {read:true,write:false}},
			{access: "akk 2", validate: true, user: "akk", acccess_e: {read:true,write:true}},
			{access: "akk 2", validate: true, user: "john", acccess_e: {read:false,write:true}},
			{access: "akk 3", validate: true, user: "akk", acccess_e: {read:true,write:true}},
			{access: "akk 3", validate: true, user: "john", acccess_e: {read:true,write:true}},
			
			{access: "akk 03", validate: true, user: "akk", acccess_e: {read:true,write:true}},
			{access: "akk 03", validate: true, user: "john", acccess_e: {read:false,write:false}},
			{access: "akk 13", validate: true, user: "akk", acccess_e: {read:true,write:true}},
			{access: "akk 13", validate: true, user: "john", acccess_e: {read:true,write:false}},
			{access: "akk 23", validate: true, user: "akk", acccess_e: {read:true,write:true}},
			{access: "akk 23", validate: true, user: "john", acccess_e: {read:false,write:true}},
			{access: "akk 33", validate: true, user: "akk", acccess_e: {read:true,write:true}},
			{access: "akk 33", validate: true, user: "john", acccess_e: {read:true,write:true}},
		],
		"Valid users are given correct rights":[
			{access: "akk 03;wha", validate: true, user: "akk", acccess_e: {read:true,write:true}},
			{access: "akk 03;wha", validate: true, user: "john", acccess_e: {read:false,write:false}},
			{access: "akk 03;wha", validate: true, user: "wha", acccess_e: {read:true,write:true}},
			{access: "akk 13;wha", validate: true, user: "akk", acccess_e: {read:true,write:true}},
			{access: "akk 13;wha", validate: true, user: "john", acccess_e: {read:true,write:false}},
			{access: "akk 13;wha", validate: true, user: "wha", acccess_e: {read:true,write:true}},
			{access: "akk 23;wha", validate: true, user: "akk", acccess_e: {read:true,write:true}},
			{access: "akk 23;wha", validate: true, user: "john", acccess_e: {read:false,write:true}},
			{access: "akk 23;wha", validate: true, user: "wha", acccess_e: {read:true,write:true}},
			{access: "akk 33;wha", validate: true, user: "akk", acccess_e: {read:true,write:true}},
			{access: "akk 33;wha", validate: true, user: "john", acccess_e: {read:true,write:true}},
			{access: "akk 33;wha", validate: true, user: "wha", acccess_e: {read:true,write:true}},
		],
	}
	Object.entries(toTest).forEach(([k,v]) => test(k,()=>v.forEach(v=> {;access_test(v)})))
})

test("Access", () => {})
