

// Outside process.env because its a boolean
declare const __DEBUG__: boolean;
// This defines 
declare namespace NodeJS {
  export interface ProcessEnv {
		VERSION: string
		APP_PATH: string,
		APP_DEBUG: boolean,
  }
}



declare module "*.sty" {
	const T : Record<string,string|undefined>
	export default T;
}
declare module "*.style" {
	const T : Record<string,string|undefined>
	export default T;
}

declare module "*.module.css" {
	const T : Record<string,string|undefined>
	export default T;
}
declare module "*.module.scss" {
	const T : Record<string,string|undefined>
	export default T;
}
declare module "*.module.sass" {
	const T : Record<string,string|undefined>
	export default T;
}

declare module "*.mod.css" {
	const T : Record<string,string|undefined>
	export default T;
}
declare module "*.mod.scss" {
	const T : Record<string,string|undefined>
	export default T;
}
declare module "*.mod.sass" {
	const T : Record<string,string|undefined>
	export default T;
}

declare module "*.m.css" {
	const T : Record<string,string|undefined>
	export default T;
}
declare module "*.m.scss" {
	const T : Record<string,string|undefined>
	export default T;
}
declare module "*.m.sass" {
	const T : Record<string,string|undefined>
	export default T;
}

declare module "*.css" {
	export default undefined;
}
declare module "*.scss" {
	export default undefined;
}
declare module "*.sass" {
	export default undefined;
}

declare module "*.graphql" {
	const T : string
	export default T;
}
declare module "*.gql" {
	const T : string
	export default T;
}

declare module "*.couchjs" {
	const T : string
	export default T;
}

declare module "*couch_design"{
	const T : Record<string, {_id: string, [k: string]:any}[]>
	export default T;
}