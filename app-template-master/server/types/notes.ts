type NoteData = ({type:'text',text:string} | {type:never,text:never}) & {name:string}
export type Note = {
	id: string;
	/** When the note was created, in ms since epoch */
	created: number;
} & NoteData;
export type NotePost = Pick<Note, 'name'> & Partial<Omit<Note, 'name' | 'created' | 'id'>>
export type NotePut = Omit<Note, 'created' | 'id'>;


