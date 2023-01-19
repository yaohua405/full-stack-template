import va from "."

test("Note", () => {
  expect(
    va.default.note({
      value: "Testing",
    })
  ).toBe(true)

  expect(
    va.default.note({
      value: 3,
    })
  ).toBe(false)
})
