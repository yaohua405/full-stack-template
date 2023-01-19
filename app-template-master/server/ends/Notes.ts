// import { Prisma } from "@prisma/client";
// import { NotePost } from "@server/types/notes";
// import auth_endpoints, { authorize, jwt } from "@server/utils/auth";
// import db from "@server/utils/db";
// import errors from "@server/utils/errors";
// import swagger, { wA } from "@server/utils/swagger";
// import { Router } from "express";

// const Notes = (): Router => {
//   const app = Router();
//   const w = swagger(app);

//   w('get', {
//     comment: `Public Notes (they don't need authentication, but they have to be marked public by having an entry with id_user:null in note_access )`,
//   })(
//     "/:id",
//     wA(async (req, res, next) => {
//       const nid = req.params.id;
//       const note_access = await db.note_access.findFirst({
//         where: {
//           id_base: nid,
//           id_user: null,
//           access_level: { lte: 1, gte: 0 },
//         },
//         include: { note: true },
//       });
//       if (!note_access) next();
//       res.send(note_access?.note);
//     })
//   );
  
//   app.use(authorize());

//   //#region Notes
//   w('get', { link: "/notes" })(
//     "/:id?",
//     wA(async (req, res) => {
//       const nid = req.params.id;
//       const user = await db.user.findUnique({
//         where: { id: jwt(res).id },
//         include: {
//           note: nid ? { where: { id: nid } } : true,
//           note_access: {
//             include: { note: true },
//             where: { access_level: { not: null }, id_base: nid || undefined },
//           },
//         },
//       });
//       if (!user) throw "No user found";
//       const notes = [...user.note, ...user.note_access.map((v) => v.note)];
//       if (!notes.length) throw "No notes found";
//       res.send(
//         nid
//           ? notes[0]
//           : notes.sort((a, b) =>
//               Number(b.updated.getTime() - a.updated.getTime())
//             )
//       );
//     })
//   );
//   w('put')(
//     "/:id",
//     wA(async (req, res) => {
//       let n = Prisma.validator<Prisma.noteUpdateInput>()(req.body);
//       n = await db.note.update({
//         where: { id: req.params.id },
//         data: { ...n, updated: BigInt(Math.floor(Date.now() / 1000)) },
//       });
//       res.send(n);
//     })
//   );
//   w('post')(
//     "/",
//     wA(async (req, res) => {
//       const n_post = req.body as NotePost;
//       let n = await db.note.create({
//         data: { ...n_post, createdBy: jwt(res).id },
//       });
//       res.send(n);
//     })
//   );
//   w('delete')(
//     "/:id?",
//     wA(async (req, res) => {
//       const ids = (req.params.id ? [req.params.id] : req.body) as
//         | string[]
//         | undefined;
//       if (!Array.isArray(ids)) throw "\\input";

//       await db.note.deleteMany({ where: { id: { in: ids } } });

//       res.sendStatus(200);
//     })
//   );

//   return app;
// };

// export default Notes;
