import { validatePersonalid, validSparID } from './util';

describe("Test swedish id", () => {
  test("it should correctly validate swedish ids", () => {
    const testInput = [
      {sid: '197911072390', expected: true},
      {sid: '7911072390', expected: true},
      {sid: '791107-2390', expected: true},
      {sid: '791107+2390', expected: false}, // we assume person is not 100 years old
      {sid: '791107--2390', expected: false},
      {sid: '79110723901', expected: false},
      {sid: '791107239', expected: false},
      {sid: '7911072391', expected: false}, // incorrect control number
    ];

    for (const [_, value] of Object.entries(testInput)) {
      const result = validatePersonalid(value.sid);
      expect(result).toEqual(value.expected);
    }
  });
  test("it should correctly transform valid ids to the format SparAPI expects", () => {
    const testInput = [
      {sid: '701107-2390', expected: '197011072390'},
      {sid: '7011072390', expected: '197011072390'},
      {sid: '2011072390', expected: '202011072390'},
    ];

    for (const [_, value] of Object.entries(testInput)) {
      const result = validSparID(value.sid);
      expect(result).toEqual(value.expected);
    }
  });
});


