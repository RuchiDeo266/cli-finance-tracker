import jwt, { JwtPayload } from "jsonwebtoken";
import {
  generateAccessToken,
  generateRefreshToken,
  verifyAccessToken,
} from "../../utils/jwt-tokens.ts";
interface PayloadInterface extends JwtPayload {
  userId: string;
}
describe("Generate the access token ", () => {
  it("should generate a jwt access token in form of string", () => {
    const expectedUserId = "abc123";
    const expectedAccessToken = generateAccessToken(expectedUserId);

    const decodePayload = jwt.verify(
      expectedAccessToken,
      "accessTokenFinTracker"
    ) as PayloadInterface;

    expect(decodePayload.userId).toBe(expectedUserId);
  });
});
// mock--?
describe.skip("Generate the refresh token", () => {
  it("should generate the refresh token", async () => {
    const expectedUserId = "abc123";
    const expectedRefreshToken = await generateRefreshToken(expectedUserId);

    const decodePayload = jwt.verify(
      expectedRefreshToken,
      "refershTokenFinTracker"
    ) as PayloadInterface;

    expect(decodePayload.userId).toBe(expectedUserId);
  });

  // it("Should verify the refersh token", async () => {
  //   const userId = "abc124";
  //   const token = await generateRefreshToken;
  // });
});

describe("Verify the Generated Tokens", () => {
  it("Should verfiy the access token", async () => {
    const userId = "abc124";
    const token = generateAccessToken(userId);

    const decodedPayload = verifyAccessToken(token) as jwt.JwtPayload;

    expect(decodedPayload).toHaveProperty("iat");
    expect(decodedPayload).toHaveProperty("exp");
  });

  it("Should reject the expired or invalid token", () => {
    const invalidToken = "invalid.token";

    expect(() => verifyAccessToken(invalidToken)).toThrow();
  });

  it("Should throw an error if a wrong secret is used", () => {
    const DIFFERENT_SECRET = "a_completely_different_secret";
    const wrongToken = jwt.sign({ userId: "abc123" }, DIFFERENT_SECRET);

    expect(() => verifyAccessToken(wrongToken)).toThrow(jwt.JsonWebTokenError);
  });
});
