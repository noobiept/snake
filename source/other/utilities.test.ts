import { describe, expect, test } from "vitest";
import { boolToOnOff, joinAndCapitalize } from "./utilities";

describe("Utilities", () => {
    test("boolToOnOff", () => {
        expect(boolToOnOff(true)).toBe("On");
        expect(boolToOnOff(false)).toBe("Off");
    });

    test("joinAndCapitalize", () => {
        expect(joinAndCapitalize([])).toBe("");
        expect(joinAndCapitalize(["one"])).toBe("One");
        expect(joinAndCapitalize(["one", "two", "three"])).toBe(
            "One Two Three"
        );
    });
});
