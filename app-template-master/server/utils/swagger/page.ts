import { ends } from "."

//#region style
const swagger_style = `
<style>
	/* Hide scrollbar for Chrome, Safari and Opera */
	.hide_scroll::-webkit-scrollbar,textarea::-webkit-scrollbar {
		display: none;
	}

	/* Hide scrollbar for IE, Edge and Firefox */
	.hide_scroll,textarea {
		-ms-overflow-style: none;  /* IE and Edge */
		scrollbar-width: none;  /* Firefox */
	}
	body{
		font-size:25px;
	}
	.section {
		padding:.3em;
		margin:.5em;
		border: 1px solid rgba(127,127,127,.5);
	}
	h1,h2,h3{
		text-align:center
	}
	h4{
		margin:.5em auto 0;
	}
	h2,h3{
		margin:0.6em auto 1em;
	}
	.endpoint {
		margin:.5em;
		padding:.2em;
		border: 1px solid rgba(127,127,127,.5);
		background: rgba(127,127,127,.1);
	}
	.comment{
		color: rgba(127,127,127,1);
		margin-inline: .6em;
	}
	.radius{
		border-radius:.3em;
	}
	col::before,
	.col::after {
		display: block;
		content: " ";
		clear: both;
	}
	.col-0 {
		float: left;
		width: 0%;
	}
	
	.col-1 {
		float: left;
		width: 8.3333333333%;
	}
	
	.col-2 {
		float: left;
		width: 16.6666666667%;
	}
	
	.col-3 {
		float: left;
		width: 25%;
	}
	
	.col-4 {
		float: left;
		width: 33.3333333333%;
	}
	
	.col-5 {
		float: left;
		width: 41.6666666667%;
	}
	
	.col-6 {
		float: left;
		width: 50%;
	}
	
	.col-7 {
		float: left;
		width: 58.3333333333%;
	}
	
	.col-8 {
		float: left;
		width: 66.6666666667%;
	}
	
	.col-9 {
		float: left;
		width: 75%;
	}
	
	.col-10 {
		float: left;
		width: 83.3333333333%;
	}
	
	.col-11 {
		float: left;
		width: 91.6666666667%;
	}
	
	.col-12 {
		float: left;
		width: 100%;
	}
	</style>
`
//#endregion
export const swagger_page = (req, res) => {
  res.send(`
	${swagger_style}
	<link rel="stylesheet" href="https://necolas.github.io/normalize.css/latest/normalize.css">
	<script>
			const unfolds_get = () => {
				const unfolds = localStorage.getItem("swagger_unfold");
				if(!unfolds)return [];
				return JSON.parse(unfolds);
			}
			const unfolds_toggle = (id) => {
				if(!id)return;
				let unfolds = unfolds_get();
				if(unfolds.includes(id))unfolds = unfolds.filter(v => v!==id);else unfolds.push(id);
				localStorage.setItem("swagger_unfold", JSON.stringify(unfolds));
			}
			const fold_item = (i, unfold) => {
				if(!i)return;
				i.style.display=unfold?'':'none';
			}
			const toggle = (e) => {
				const parent = e.target.closest('.endpoint');
				const content = parent.querySelector("#content");
				if(!parent || !content)return;
				
				if(parent.id)unfolds_toggle(parent.id);
				
				const unfolds = unfolds_get();
				fold_item(content, parent.id ? unfolds.includes(parent.id) : !!content.style.display);
			}
			const load_toggle = () => {
				const unfolds = unfolds_get();
				const els = document.querySelectorAll(".endpoint");
				els.forEach(e => fold_item(e.querySelector("#content"), unfolds.includes(e.id||'')))
			}
		</script>
	<body onload="load_toggle()">
	<h1>Swagger</h1>
	${
    process.env.SERVER_URL_PREFIX__S
      ? `<h2>Server's prefix is '/${process.env.SERVER_URL_PREFIX__S}'</h2>`
      : ""
  }
	${ends
    .map((e) => {
      const t = (v, text) => (v ? text : "")
      if (typeof e === "string") return e
      if (e.hide) return ""

      const l = e.link || (e.method === "GET" && e.path)
      return `
			<div class="endpoint radius" id="${e.id ?? e.path ?? ""}">
				<div style="display:flex;gap:.6em;align-items:center;">
					<span style="flex-basis:3.6em;"><b>${e.method}</b></span>
					${
            l
              ? `<a href="${
                  process.env.SERVER_URL_PREFIX__S ? "/" + process.env.SERVER_URL_PREFIX__S : ""
                }${l}">`
              : ""
          }
						${e.path}
					${l ? `</a>` : ""}
					${e.comment ? `<span class="comment">${e.comment}</span>` : ""}
					<div style="flex-grow:1"></div>
					${t(
            e.input || e.output,
            `<a onclick="toggle(event)" class="radius" style="float:right;cursor:pointer;padding:.2em;background: #00A03020">More</a>`
          )}
				</div>
				${t(
          e.input || e.output,
          `
				<div id="content">
					<hr style="margin:.2em auto 0"/>
					<div class="col">
					${[e.input, e.output]
            .map(
              (io, i) => `
							<div class="col-6">
							${
                io
                  ? `
								<h4>${i == 0 ? "Input" : "Output"}</h4>
								<div style="white-space:pre-wrap;">${
                  typeof io === "string" ? io : JSON.stringify(io, undefined, 2)
                  // (() => {
                  // 		const t = JSON.stringify(io, undefined, 2);
                  // 		return `<textarea readonly="" class="radius" style="width:100%;min-height: ${
                  // 			t.split(/\r\n|\r|\n/).length * 1.2 + 1
                  // 		}em;line-height:1.2em;background:#FFFFFF90;border:none;">${t}</textarea>`;
                  //   })()
                }</div>
							`
                  : "&nbsp;"
              }
							</div>`
            )
            .join("")}
					</div>
				</div>
				`
        )}
			</div>
		`
    })
    .join(" ")}
	</body>
	`)
}
