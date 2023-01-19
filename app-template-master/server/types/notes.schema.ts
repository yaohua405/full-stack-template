import * as y from 'yup';
import { Note } from './notes';

export const noteModifyAllowed:(keyof Note)[] = ['text', 'type', 'name'];
const typeAllowed: Note['type'][] = ['text'];
export const schema_note = y.lazy((v) => {
	
	const o:Partial<Record<keyof Note, any>> = {
		id: y.string(),
		name: y.string().required(),
		type: y.mixed().oneOf(typeAllowed),
	};
	
	switch(v.type){
		case 'text':
			o.text = y.string(); 
			break;
	}
	return y.object(o);
})