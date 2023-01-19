import { wE } from "./swagger";
/** Time ping, for reloading */
export const time = new Date();

/**
 * Sets up startup time endpoint
 */
const startup_time = wE((w) => {
  w("get", {
    comment: "Last server startup time",
    output: { time: "milliseconds since epoch" },
  })("/time", (req, res) => res.send({ time: time.getTime() }));
});
export default startup_time;
