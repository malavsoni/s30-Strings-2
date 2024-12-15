import { lchown } from "graceful-fs";

// Brute Force O(mxn)
function strStr(haystack: string, needle: string): number {
  let result: number = 0;
  let n = haystack.length;
  let m = needle.length;

  let left = 0;
  while (left < n - m) {
    let comparision = 0; // pointer at needle
    if (haystack.charAt(left) == needle.charAt(comparision)) {
      let right = left;
      while (haystack.charAt(right) == needle.charAt(comparision)) {
        right++;
        comparision++;
        if (comparision == m) {
          return left;
        }
      }
    }
    left++;
  }
  return result;
}

function strStr_with_rolling_hash(haystack: string, needle: string): number {
  let n = haystack.length;
  let m = needle.length;
  let letterCount: number = 26;
  let prime = 100001; // Max Input Value
  let posFactor = 1;

  for (let index = 0; index < m; index++) {
    posFactor = (posFactor * 26) % prime;
  }
  function getHashOfChar(char: string): number {
    return char.charCodeAt(0) - "a".charCodeAt(0) + 1;
  }

  let needleHash = 0;
  for (let index = 0; index < needle.length; index++) {
    needleHash =
      (needleHash * letterCount + getHashOfChar(needle.charAt(index))) % prime;
  }

  console.log("Needle Hash = " + needleHash);
  // Sliding Window
  let left = 0;
  let rollingHash = 0;
  for (let right = 0; right < n; right++) {
    let inChar = haystack.charAt(right);
    let inCharHash = getHashOfChar(inChar);
    rollingHash = (rollingHash * letterCount + inCharHash) % prime;

    if (right >= m) {
      // Remove contribution of left value
      let outChar = haystack.charAt(right - m);
      let outCharHash = getHashOfChar(outChar);
      rollingHash = (rollingHash - posFactor * outCharHash) % prime;
      left++;
    }

    if (rollingHash < 0) {
      rollingHash = rollingHash + prime;
    }
    console.log("Rolling Hash Final " + rollingHash);
    if (rollingHash == needleHash) {
      return left;
    }
  }
  return -1;
}

describe("28. Find the Index of the First Occurrence in a String", () => {
  describe("Brute Force", () => {
    it("Happy Path", () => {
      expect(strStr("sadbutsad", "sad")).toStrictEqual(0);
    });

    it("Happy Path - Complex", () => {
      expect(strStr("aaaabaaaa", "aba")).toStrictEqual(3);
    });
  });

  describe("Robin Karp Rolling Hash Tech", () => {
    it("Happy Path", () => {
      expect(strStr_with_rolling_hash("sadbutsad", "sad")).toStrictEqual(0);
    });

    it("Negative", () => {
      expect(strStr_with_rolling_hash("leetcode", "leeto")).toStrictEqual(-1);
    });

    it("Happy Path - Complex", () => {
      expect(strStr_with_rolling_hash("aaaabaaaa", "aba")).toStrictEqual(3);
    });
  });
});
